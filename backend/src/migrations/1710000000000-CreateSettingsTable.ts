import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateSettingsTable1710000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'settings',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'key',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'value',
            type: 'text',
          },
          {
            name: 'type',
            type: 'varchar',
            default: "'string'",
          },
          {
            name: 'isActive',
            type: 'boolean',
            default: true,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
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
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true
    )

    // Insert default settings
    await queryRunner.query(`
      INSERT INTO settings (key, value, type, description) VALUES
      ('site_name', 'Filmxane', 'string', 'Site name'),
      ('site_description', 'Kurdish Video Platform', 'string', 'Site description'),
      ('maintenance_mode', 'false', 'boolean', 'Maintenance mode'),
      ('allow_registrations', 'true', 'boolean', 'Allow user registrations'),
      ('contact_email', 'admin@filmxane.com', 'string', 'Contact email'),
      ('max_users', '1000', 'number', 'Maximum users'),
      ('enable_comments', 'true', 'boolean', 'Enable comments'),
      ('enable_ratings', 'true', 'boolean', 'Enable ratings'),
      ('enable_notifications', 'true', 'boolean', 'Enable notifications'),
      ('theme', 'light', 'string', 'Site theme'),
      ('logo_url', '', 'string', 'Logo URL'),
      ('favicon_url', '', 'string', 'Favicon URL')
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('settings')
  }
}
