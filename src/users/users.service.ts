import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findOneById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id: Number(id) } });
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.usersRepository.create(createUserDto);

    try {
      await this.usersRepository.save(newUser);
      return newUser;
    } catch (error) {
      if (
        error.code === '23505' ||
        (error.driverError?.code === 'ER_DUP_ENTRY' &&
          error.message.includes('email'))
      ) {
        throw new ConflictException(
          `Email '${createUserDto.email}' already exists.`,
        );
      } else {
        console.error('Error creating user:', error);
        throw new InternalServerErrorException('Failed to create user.');
      }
    }
  }
}
