import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ReceiptScanService } from './receipt-scan.service';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

@Controller('receipt-scan')
export class ReceiptScanController {
  constructor(
    @Inject(ReceiptScanService)
    private receiptScanService: ReceiptScanService,
  ) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('receipt', {
      limits: { fileSize: MAX_FILE_SIZE },
      fileFilter: (_req, file, callback) => {
        if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
          return callback(
            new BadRequestException(
              'Only JPEG, PNG, and WebP images are allowed.',
            ),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async uploadReceipt(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded.');
    }
    return this.receiptScanService.scanReceipt(file);
  }
}
