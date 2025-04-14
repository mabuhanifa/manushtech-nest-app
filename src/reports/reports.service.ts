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
    return this.orderRepository.query(`
      SELECT 
        TO_CHAR("order"."createdAt", 'YYYY-MM') AS month,
        SUM("order"."totalAmount") AS total_sales
      FROM 
        "order"
      WHERE 
        "order"."createdAt" >= NOW() - INTERVAL '6 months'
      GROUP BY 
        TO_CHAR("order"."createdAt", 'YYYY-MM')
      ORDER BY 
        month ASC;
    `);
  }

  async getUserOrderReport() {
    return this.userRepository.query(`
      SELECT
        "user"."id" AS userId,
        "user"."name" AS userName,
        COUNT("order"."id") AS totalOrders,
        SUM("order"."totalAmount") AS totalSpending
      FROM "user"
      LEFT JOIN "order" ON "user"."id" = "order"."userId"
      GROUP BY "user"."id", "user"."name"
      ORDER BY "user"."id";
    `);
  }

  async getProductSalesReport() {
    return this.orderItemRepository.query(`
      SELECT
        product.id AS "productId",
        product.name AS "productName",
        SUM(order_item.quantity) AS "totalQuantity",
        SUM(order_item.price * order_item.quantity) AS "totalRevenue"
      FROM order_item
      INNER JOIN product ON order_item."productId" = product.id
      GROUP BY product.id, product.name
      ORDER BY "totalQuantity" DESC;
    `);
  }
}
