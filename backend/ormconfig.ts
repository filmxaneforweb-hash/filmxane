import { DataSource } from 'typeorm';
import { join } from 'path';

export default new DataSource({
  type: 'sqlite',
  database: join(__dirname, '../filmxane.db'),
  entities: [__dirname + '/src/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/src/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: true,
});
