import { Controller, Get } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('monthly-sales')
  async getMonthlySalesReport() {
    return this.reportsService.getMonthlySalesReport();
  }

  @Get('user-orders')
  async getUserOrderReport() {
    return this.reportsService.getUserOrderReport();
  }

  @Get('product-sales')
  async getProductSalesReport() {
    return this.reportsService.getProductSalesReport();
  }
}
