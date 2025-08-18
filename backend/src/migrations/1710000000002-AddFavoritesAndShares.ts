import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm'

export class AddFavoritesAndShares1710000000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Favorites tablosunu oluştur
    await queryRunner.createTable(
      new Table({
        name: 'favorites',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '36',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'userId',
            type: 'varchar',
            length: '36',
          },
          {
            name: 'videoId',
            type: 'varchar',
            length: '36',
          },
          {
            name: 'type',
            type: 'varchar',
            length: '10',
            default: "'movie'",
          },
          {
            name: 'isActive',
            type: 'boolean',
            default: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true
    )

    // Foreign key'leri ekle
    await queryRunner.createForeignKey(
      'favorites',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      })
    )

    await queryRunner.createForeignKey(
      'favorites',
      new TableForeignKey({
        columnNames: ['videoId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'videos',
        onDelete: 'CASCADE',
      })
    )

    // Videos tablosuna shares alanını ekle
    await queryRunner.query(`ALTER TABLE "videos" ADD COLUMN "shares" integer NOT NULL DEFAULT 0`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Foreign key'leri kaldır
    const favoritesTable = await queryRunner.getTable('favorites')
    const userIdForeignKey = favoritesTable.foreignKeys.find(fk => fk.columnNames.indexOf('userId') !== -1)
    const videoIdForeignKey = favoritesTable.foreignKeys.find(fk => fk.columnNames.indexOf('videoId') !== -1)
    
    if (userIdForeignKey) {
      await queryRunner.dropForeignKey('favorites', userIdForeignKey)
    }
    if (videoIdForeignKey) {
      await queryRunner.dropForeignKey('favorites', videoIdForeignKey)
    }

    // Favorites tablosunu kaldır
    await queryRunner.dropTable('favorites')

    // Videos tablosundan shares alanını kaldır
    await queryRunner.query(`ALTER TABLE "videos" DROP COLUMN "shares"`)
  }
}
