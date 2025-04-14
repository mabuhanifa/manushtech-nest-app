import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { OrderItem } from 'src/orders/entities/order-item.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  async seed() {
    this.logger.log('Seeding started...');

    try {
      await this.orderItemRepository.delete({});
      await this.orderRepository.delete({});
      await this.productRepository.delete({});
      await this.userRepository.delete({});
      this.logger.log('Cleared existing data.');

      const users = await this.seedUsers();

      const products = await this.seedProducts();

      await this.seedOrders(users, products);

      this.logger.log('Seeding completed successfully!');
    } catch (error) {
      this.logger.error('Seeding failed', error.stack);
      throw error;
    }
  }

  private async seedUsers(): Promise<User[]> {
    const usersData = [
      { name: 'User 1', email: 'user1@example.com', password: 'password1' },
      { name: 'User 2', email: 'user2@example.com', password: 'password2' },
      { name: 'User 3', email: 'user3@example.com', password: 'password3' },
      { name: 'User 4', email: 'user4@example.com', password: 'password4' },
      { name: 'User 5', email: 'user5@example.com', password: 'password5' },
    ];

    const users = await Promise.all(
      usersData.map(async (userData) => {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        return this.userRepository.create({
          name: userData.name,
          email: userData.email,
          password: hashedPassword,
        });
      }),
    );

    return this.userRepository.save(users);
  }

  private async seedProducts(): Promise<Product[]> {
    const productsData = [
      { name: 'Product A', price: 10 },
      { name: 'Product B', price: 15 },
      { name: 'Product C', price: 20 },
      { name: 'Product D', price: 25 },
      { name: 'Product E', price: 30 },
      { name: 'Product F', price: 35 },
      { name: 'Product G', price: 40 },
      { name: 'Product H', price: 45 },
      { name: 'Product I', price: 50 },
      { name: 'Product J', price: 55 },
    ];

    const products = productsData.map((productData) =>
      this.productRepository.create(productData),
    );

    return this.productRepository.save(products);
  }

  private async seedOrders(users: User[], products: Product[]): Promise<void> {
    const orders: Order[] = [];

    for (const user of users) {
      for (let i = 0; i < 5; i++) {
        const order = this.orderRepository.create({
          user,
          createdAt: this.getRandomDate(),
          totalAmount: 0,
        });

        orders.push(await this.orderRepository.save(order));
      }
    }

    for (const order of orders) {
      const numProducts = this.getRandomInt(2, 4);
      const selectedProducts = this.getRandomElements(products, numProducts);

      for (const product of selectedProducts) {
        const quantity = this.getRandomInt(1, 3);
        const price = product.price * quantity;

        const orderItem = this.orderItemRepository.create({
          order,
          product,
          quantity,
          price,
        });

        await this.orderItemRepository.save(orderItem);

        order.totalAmount += price;
      }

      await this.orderRepository.save(order);
    }
  }

  private getRandomDate(): Date {
    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 6);

    return new Date(
      sixMonthsAgo.getTime() +
        Math.random() * (now.getTime() - sixMonthsAgo.getTime()),
    );
  }

  private getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private getRandomElements<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
}
