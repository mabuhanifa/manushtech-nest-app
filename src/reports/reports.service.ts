import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItem } from 'src/orders/entities/order-item.entity';
import { Order } from 'src/orders/entities/order.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  async getMonthlySalesReport() {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    return this.orderRepository
      .createQueryBuilder('order')
      .select("TO_CHAR(order.createdAt, 'YYYY-MM')", 'month')
      .addSelect('SUM(order.totalAmount)', 'totalSales')
      .where('order.createdAt >= :sixMonthsAgo', { sixMonthsAgo })
      .groupBy("TO_CHAR(order.createdAt, 'YYYY-MM')")
      .orderBy('month', 'ASC')
      .getRawMany();
  }

  async getUserOrderReport() {
    return this.userRepository
      .createQueryBuilder('user')
      .select('user.id', 'userId')
      .addSelect('user.name', 'userName')
      .addSelect('COUNT(order.id)', 'totalOrders')
      .addSelect('SUM(order.totalAmount)', 'totalSpending')
      .leftJoin('user.orders', 'order')
      .groupBy('user.id')
      .getRawMany();
  }

  async getProductSalesReport() {
    return this.orderItemRepository
      .createQueryBuilder('orderItem')
      .select('product.id', 'productId')
      .addSelect('product.name', 'productName')
      .addSelect('SUM(orderItem.quantity)', 'totalQuantity')
      .addSelect('SUM(orderItem.price)', 'totalRevenue')
      .innerJoin('orderItem.product', 'product')
      .groupBy('product.id, product.name')
      .orderBy('"totalQuantity"', 'DESC')
      .getRawMany();
  }
}
