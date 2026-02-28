import {
  Injectable,
  BadRequestException,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, GenerateContentResult } from '@google/generative-ai';
import { ScanReceiptResponseDto } from './dto/response.dto';
import { Category, Currency } from 'src/utils/enums';

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 2000;

@Injectable()
export class ReceiptScanService {
  private readonly logger = new Logger(ReceiptScanService.name);
  private genAI: GoogleGenerativeAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error(
        'GEMINI_API_KEY is not configured. Please add it to your .env file.',
      );
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async scanReceipt(
    file: Express.Multer.File,
  ): Promise<ScanReceiptResponseDto> {
    const model = this.genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
    });

    const imagePart = {
      inlineData: {
        data: file.buffer.toString('base64'),
        mimeType: file.mimetype,
      },
    };

    const prompt = `Analyze this receipt image and extract the following information in JSON format:
{
  "description": "A brief description of the purchase (e.g., 'Grocery shopping at Walmart')",
  "amount": <total amount as a number, e.g., 45.99>,
  "category": "<one of: food, transportation, housing, utilities, entertainment, health, education, other>",
  "date": "<date in YYYY-MM-DD format, or today's date if not visible>",
  "currency": "<one of: usd, eur, gbp, jpy, cny, inr>",
  "rawText": "<raw text extracted from the receipt>"
}

Rules:
- Return ONLY valid JSON, no markdown or extra text.
- For "amount", use the total/grand total amount. If no total is found, sum the items.
- For "category", choose the most appropriate category from the list.
- For "currency", infer from currency symbols or country context. Default to "usd".
- For "date", use the date shown on the receipt. If not clear, use today: ${new Date().toISOString().split('T')[0]}.
- For "description", create a concise summary of the purchase.`;

    try {
      const result = await this.callWithRetry(() =>
        model.generateContent([prompt, imagePart]),
      );
      const response = result.response;
      const text = response.text();

      // Parse the JSON response, handling possible markdown wrapping
      let jsonStr = text.trim();
      if (jsonStr.startsWith('```json')) {
        jsonStr = jsonStr.slice(7);
      } else if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.slice(3);
      }
      if (jsonStr.endsWith('```')) {
        jsonStr = jsonStr.slice(0, -3);
      }
      jsonStr = jsonStr.trim();

      const parsed = JSON.parse(jsonStr);

      // Validate and normalize the response
      const dto = new ScanReceiptResponseDto();
      dto.description = parsed.description || 'Receipt purchase';
      dto.amount = parseFloat(parsed.amount) || 0;
      dto.category = this.normalizeCategory(parsed.category);
      dto.date = this.normalizeDate(parsed.date);
      dto.currency = this.normalizeCurrency(parsed.currency);
      dto.rawText = parsed.rawText || '';

      return dto;
    } catch (error) {
      if (error instanceof ServiceUnavailableException) {
        throw error;
      }
      if (error instanceof SyntaxError) {
        throw new BadRequestException(
          'Failed to parse receipt data. Please try with a clearer image.',
        );
      }
      throw new BadRequestException(
        `Receipt scanning failed: ${error.message}`,
      );
    }
  }

  private async callWithRetry(
    fn: () => Promise<GenerateContentResult>,
  ): Promise<GenerateContentResult> {
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        return await fn();
      } catch (error) {
        if (!this.isRateLimitError(error)) {
          throw error;
        }

        if (attempt === MAX_RETRIES) {
          this.logger.error(
            `Gemini API rate limit exceeded after ${MAX_RETRIES} retries`,
          );
          throw new ServiceUnavailableException(
            'Receipt scanning is temporarily unavailable due to API rate limits. Please try again in a minute.',
          );
        }

        const delayMs = BASE_DELAY_MS * Math.pow(2, attempt - 1); // 2s, 4s, 8s
        this.logger.warn(
          `Gemini API rate limited (attempt ${attempt}/${MAX_RETRIES}). Retrying in ${delayMs}ms...`,
        );
        await this.delay(delayMs);
      }
    }

    // Should never reach here, but TypeScript needs it
    throw new ServiceUnavailableException('Unexpected retry failure');
  }

  private isRateLimitError(error: any): boolean {
    const message = error?.message || '';
    return (
      message.includes('429') ||
      message.includes('Too Many Requests') ||
      message.includes('quota')
    );
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private normalizeCategory(category: string): string {
    const validCategories = Object.values(Category);
    const normalized = category?.toLowerCase().trim();
    if (validCategories.includes(normalized as Category)) {
      return normalized;
    }
    return Category.OTHER;
  }

  private normalizeCurrency(currency: string): string {
    const validCurrencies = Object.values(Currency);
    const normalized = currency?.toLowerCase().trim();
    if (validCurrencies.includes(normalized as Currency)) {
      return normalized;
    }
    return Currency.USD;
  }

  private normalizeDate(date: string): string {
    try {
      const parsed = new Date(date);
      if (isNaN(parsed.getTime())) {
        return new Date().toISOString().split('T')[0];
      }
      return parsed.toISOString().split('T')[0];
    } catch {
      return new Date().toISOString().split('T')[0];
    }
  }
}
