import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm'

export class UpdateSettingsTable1710000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop the old settings table
    await queryRunner.dropTable('settings')

    // Create the new system_settings table
    await queryRunner.createTable(
      new Table({
        name: 'system_settings',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'siteName',
            type: 'varchar',
            default: "'Filmxane'",
          },
          {
            name: 'siteDescription',
            type: 'text',
            default: "'Platforma fîlm û rêzefîlman'",
          },
          {
            name: 'maintenanceMode',
            type: 'boolean',
            default: false,
          },
          {
            name: 'allowRegistration',
            type: 'boolean',
            default: true,
          },
          {
            name: 'allowComments',
            type: 'boolean',
            default: true,
          },
          {
            name: 'maxUploadSize',
            type: 'integer',
            default: 100,
          },
          {
            name: 'allowedFileTypes',
            type: 'text',
            default: "'mp4,avi,mov,mkv'",
          },
          {
            name: 'emailNotifications',
            type: 'boolean',
            default: true,
          },
          {
            name: 'pushNotifications',
            type: 'boolean',
            default: true,
          },
          {
            name: 'theme',
            type: 'varchar',
            default: "'auto'",
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
      INSERT INTO system_settings (id, "siteName", "siteDescription", "maintenanceMode", "allowRegistration", "allowComments", "maxUploadSize", "allowedFileTypes", "emailNotifications", "pushNotifications", theme) VALUES
      (uuid_generate_v4(), 'Filmxane', 'Platforma fîlm û rêzefîlman', false, true, true, 100, 'mp4,avi,mov,mkv', true, true, 'auto')
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the new system_settings table
    await queryRunner.dropTable('system_settings')

    // Recreate the old settings table
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

    // Insert old default settings
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
}
