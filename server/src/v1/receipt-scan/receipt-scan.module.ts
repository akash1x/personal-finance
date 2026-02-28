import { Module } from '@nestjs/common';
import { ReceiptScanService } from './receipt-scan.service';
import { ReceiptScanController } from './receipt-scan.controller';

@Module({
  providers: [ReceiptScanService],
  controllers: [ReceiptScanController],
})
export class ReceiptScanModule {}
