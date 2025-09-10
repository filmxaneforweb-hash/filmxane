import { MigrationInterface, QueryRunner, Table, Index } from 'typeorm';

export class AddSubtitlesTable1735123456789 implements MigrationInterface {
  name = 'AddSubtitlesTable1735123456789';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'subtitles',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'language',
            type: 'varchar',
            length: '10',
            isNullable: false,
          },
          {
            name: 'languageName',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'format',
            type: 'varchar',
            length: '10',
            default: "'srt'",
            isNullable: false,
          },
          {
            name: 'fileUrl',
            type: 'varchar',
            length: '500',
            isNullable: false,
          },
          {
            name: 'filePath',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          {
            name: 'isDefault',
            type: 'boolean',
            default: true,
            isNullable: false,
          },
          {
            name: 'isActive',
            type: 'boolean',
            default: true,
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'downloadCount',
            type: 'int',
            default: 0,
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'videoId',
            type: 'uuid',
            isNullable: false,
          },
        ],
        foreignKeys: [
          {
            columnNames: ['videoId'],
            referencedTableName: 'videos',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
        indices: [
          new Index('IDX_subtitles_video_id', ['videoId']),
          new Index('IDX_subtitles_language', ['language']),
          new Index('IDX_subtitles_is_default', ['isDefault']),
          new Index('IDX_subtitles_is_active', ['isActive']),
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('subtitles');
  }
}
