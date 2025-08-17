import { DataSource } from 'typeorm';
import { User, UserRole, UserStatus } from '../entities/user.entity';
import * as bcrypt from 'bcryptjs';

export const seedUsers = async (dataSource: DataSource) => {
  const userRepository = dataSource.getRepository(User);

  const users = [
    {
      email: 'admin@filmxane.com',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      emailVerified: true,
    },
    {
      email: 'test@filmxane.com',
      password: 'test123',
      firstName: 'Test',
      lastName: 'User',
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
      emailVerified: true,
    },
    {
      email: 'serkan@filmxane.com',
      password: 'serkan123',
      firstName: 'Serkan',
      lastName: 'Developer',
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      emailVerified: true,
    },
  ];

  for (const userData of users) {
    const existingUser = await userRepository.findOne({
      where: { email: userData.email },
    });

    if (!existingUser) {
      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

      const user = userRepository.create({
        ...userData,
        password: hashedPassword,
      });

      await userRepository.save(user);
      console.log(`✅ User created: ${userData.email} (${userData.password})`);
    } else {
      console.log(`ℹ️ User already exists: ${userData.email}`);
    }
  }
};
