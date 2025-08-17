import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateVideosTable1709999999999 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'videos',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid()',
          },
          {
            name: 'title',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'genre',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'year',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'duration',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'rating',
            type: 'decimal',
            precision: 3,
            scale: 1,
            default: 0,
            isNullable: true,
          },
          {
            name: 'views',
            type: 'int',
            default: 0,
            isNullable: false,
          },
          {
            name: 'thumbnail',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'videoUrl',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'isFeatured',
            type: 'boolean',
            default: false,
            isNullable: false,
          },
          {
            name: 'isNew',
            type: 'boolean',
            default: false,
            isNullable: false,
          },
          {
            name: 'categoryId',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'updatedAt',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
        ],
      }),
      true
    );

    // Add foreign key
    await queryRunner.createForeignKey(
      'videos',
      new TableForeignKey({
        columnNames: ['categoryId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'categories',
        onDelete: 'SET NULL',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('videos');
    const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('categoryId') !== -1);
    await queryRunner.dropForeignKey('videos', foreignKey);
    await queryRunner.dropTable('videos');
  }
}
