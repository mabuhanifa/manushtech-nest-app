import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @UseGuards(AuthGuard)
  @Get('monthly-sales')
  async getMonthlySalesReport() {
    return this.reportsService.getMonthlySalesReport();
  }

  @UseGuards(AuthGuard)
  @Get('user-orders')
  async getUserOrderReport() {
    return this.reportsService.getUserOrderReport();
  }

  @UseGuards(AuthGuard)
  @Get('product-sales')
  async getProductSalesReport() {
    return this.reportsService.getProductSalesReport();
  }
}
