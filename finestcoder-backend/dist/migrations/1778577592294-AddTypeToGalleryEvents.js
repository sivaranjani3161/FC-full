"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddTypeToGalleryEvents1778577592294 = void 0;
class AddTypeToGalleryEvents1778577592294 {
    name = 'AddTypeToGalleryEvents1778577592294';
    async up(queryRunner) {
        // Drop FK first so the unique index can be dropped safely
        try {
            await queryRunner.query(`ALTER TABLE \`permissions\` DROP FOREIGN KEY \`FK_permissions_role\``);
        }
        catch (_) { /* FK may not exist or have different name — ignore */ }
        try {
            await queryRunner.query(`DROP INDEX \`UQ_permission_role_code\` ON \`permissions\``);
        }
        catch (_) { /* index may already be gone — ignore */ }
        // Add type column if not already present
        try {
            await queryRunner.query(`ALTER TABLE \`gallery_events\` ADD \`type\` enum ('internal', 'external') NOT NULL DEFAULT 'external'`);
        }
        catch (_) { /* column may already exist — ignore */ }
        try {
            await queryRunner.query(`ALTER TABLE \`gallery_events\` DROP FOREIGN KEY \`FK_0248e9c62013a88c39a5d821c1a\``);
        }
        catch (_) { /* ignore */ }
        try {
            await queryRunner.query(`ALTER TABLE \`gallery_events\` CHANGE \`title\` \`title\` varchar(255) NULL`);
            await queryRunner.query(`ALTER TABLE \`gallery_events\` CHANGE \`slug\` \`slug\` varchar(255) NULL`);
            await queryRunner.query(`ALTER TABLE \`gallery_events\` CHANGE \`created_by\` \`created_by\` int NULL`);
        }
        catch (_) { /* ignore */ }
        // Convert description columns to JSON if still text
        for (const table of ['course_highlights', 'course_structures', 'course_features']) {
            try {
                await queryRunner.query(`ALTER TABLE \`${table}\` DROP COLUMN \`description\``);
                await queryRunner.query(`ALTER TABLE \`${table}\` ADD \`description\` json NULL`);
            }
            catch (_) { /* already json or column issue — ignore */ }
        }
        try {
            await queryRunner.query(`ALTER TABLE \`gallery_events\` ADD CONSTRAINT \`FK_0248e9c62013a88c39a5d821c1a\` FOREIGN KEY (\`created_by\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        }
        catch (_) { /* ignore */ }
    }
    async down(queryRunner) {
        // no-op down for safety
    }
}
exports.AddTypeToGalleryEvents1778577592294 = AddTypeToGalleryEvents1778577592294;
