import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTable1726896493856 implements MigrationInterface {
    name = 'CreateUserTable1726896493856'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`rol\` (\`id_rol\` int NOT NULL AUTO_INCREMENT, \`nombre_Rol\` varchar(255) NOT NULL, \`estado_Rol\` tinyint NOT NULL, UNIQUE INDEX \`IDX_e72fe0fef1f5412c556ced603d\` (\`nombre_Rol\`), PRIMARY KEY (\`id_rol\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`idUser\` int NOT NULL AUTO_INCREMENT, \`correo\` varchar(255) NOT NULL, \`pass\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_37e80954fd8499125ff14c586d\` (\`correo\`), PRIMARY KEY (\`idUser\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_roles_rol\` (\`userIdUser\` int NOT NULL, \`rolIdRol\` int NOT NULL, INDEX \`IDX_b65e124bce5bddc659ddf3f852\` (\`userIdUser\`), INDEX \`IDX_d5f2db4fb43852c3f1582141eb\` (\`rolIdRol\`), PRIMARY KEY (\`userIdUser\`, \`rolIdRol\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user_roles_rol\` ADD CONSTRAINT \`FK_b65e124bce5bddc659ddf3f852d\` FOREIGN KEY (\`userIdUser\`) REFERENCES \`user\`(\`idUser\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_roles_rol\` ADD CONSTRAINT \`FK_d5f2db4fb43852c3f1582141ebf\` FOREIGN KEY (\`rolIdRol\`) REFERENCES \`rol\`(\`id_rol\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_roles_rol\` DROP FOREIGN KEY \`FK_d5f2db4fb43852c3f1582141ebf\``);
        await queryRunner.query(`ALTER TABLE \`user_roles_rol\` DROP FOREIGN KEY \`FK_b65e124bce5bddc659ddf3f852d\``);
        await queryRunner.query(`DROP INDEX \`IDX_d5f2db4fb43852c3f1582141eb\` ON \`user_roles_rol\``);
        await queryRunner.query(`DROP INDEX \`IDX_b65e124bce5bddc659ddf3f852\` ON \`user_roles_rol\``);
        await queryRunner.query(`DROP TABLE \`user_roles_rol\``);
        await queryRunner.query(`DROP INDEX \`IDX_37e80954fd8499125ff14c586d\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_e72fe0fef1f5412c556ced603d\` ON \`rol\``);
        await queryRunner.query(`DROP TABLE \`rol\``);
    }

}
