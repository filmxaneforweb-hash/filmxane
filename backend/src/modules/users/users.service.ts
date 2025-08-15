import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User, UserStatus } from '../../entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      select: ['id', 'email', 'firstName', 'lastName', 'role', 'status', 'createdAt'],
    });
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('بەکارهێنەر نەدۆزرایەوە');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    
    Object.assign(user, updateUserDto);
    
    return await this.userRepository.save(user);
  }

  async updateStatus(id: string, status: UserStatus): Promise<User> {
    const user = await this.findById(id);
    user.status = status;
    
    return await this.userRepository.save(user);
  }

  async delete(id: string): Promise<void> {
    const user = await this.findById(id);
    await this.userRepository.remove(user);
  }

  async getProfile(userId: string): Promise<User> {
    return await this.findById(userId);
  }

  async updateProfile(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    return await this.update(userId, updateUserDto);
  }

  async getStats(): Promise<{
    totalUsers: number;
    activeUsers: number;
    newUsersThisMonth: number;
  }> {
    const totalUsers = await this.userRepository.count();
    
    const activeUsers = await this.userRepository.count({
      where: { status: UserStatus.ACTIVE },
    });

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const newUsersThisMonth = await this.userRepository.count({
      where: {
        createdAt: startOfMonth,
      },
    });

    return {
      totalUsers,
      activeUsers,
      newUsersThisMonth,
    };
  }
}
