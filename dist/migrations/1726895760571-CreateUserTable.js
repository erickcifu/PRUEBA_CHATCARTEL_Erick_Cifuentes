"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserTable1726895760571 = void 0;
class CreateUserTable1726895760571 {
    constructor() {
        this.name = 'CreateUserTable1726895760571';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TABLE \`rol\` (\`id_rol\` int NOT NULL AUTO_INCREMENT, \`nombre_Rol\` varchar(255) NOT NULL, \`estado_Rol\` tinyint NOT NULL, UNIQUE INDEX \`IDX_e72fe0fef1f5412c556ced603d\` (\`nombre_Rol\`), PRIMARY KEY (\`id_rol\`)) ENGINE=InnoDB`);
            yield queryRunner.query(`CREATE TABLE \`user\` (\`idUser\` int NOT NULL AUTO_INCREMENT, \`correo\` varchar(255) NOT NULL, \`pass\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_37e80954fd8499125ff14c586d\` (\`correo\`), PRIMARY KEY (\`idUser\`)) ENGINE=InnoDB`);
            yield queryRunner.query(`CREATE TABLE \`user_roles_rol\` (\`userIdUser\` int NOT NULL, \`rolIdRol\` int NOT NULL, INDEX \`IDX_b65e124bce5bddc659ddf3f852\` (\`userIdUser\`), INDEX \`IDX_d5f2db4fb43852c3f1582141eb\` (\`rolIdRol\`), PRIMARY KEY (\`userIdUser\`, \`rolIdRol\`)) ENGINE=InnoDB`);
            yield queryRunner.query(`ALTER TABLE \`user_roles_rol\` ADD CONSTRAINT \`FK_b65e124bce5bddc659ddf3f852d\` FOREIGN KEY (\`userIdUser\`) REFERENCES \`user\`(\`idUser\`) ON DELETE CASCADE ON UPDATE CASCADE`);
            yield queryRunner.query(`ALTER TABLE \`user_roles_rol\` ADD CONSTRAINT \`FK_d5f2db4fb43852c3f1582141ebf\` FOREIGN KEY (\`rolIdRol\`) REFERENCES \`rol\`(\`id_rol\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`user_roles_rol\` DROP FOREIGN KEY \`FK_d5f2db4fb43852c3f1582141ebf\``);
            yield queryRunner.query(`ALTER TABLE \`user_roles_rol\` DROP FOREIGN KEY \`FK_b65e124bce5bddc659ddf3f852d\``);
            yield queryRunner.query(`DROP INDEX \`IDX_d5f2db4fb43852c3f1582141eb\` ON \`user_roles_rol\``);
            yield queryRunner.query(`DROP INDEX \`IDX_b65e124bce5bddc659ddf3f852\` ON \`user_roles_rol\``);
            yield queryRunner.query(`DROP TABLE \`user_roles_rol\``);
            yield queryRunner.query(`DROP INDEX \`IDX_37e80954fd8499125ff14c586d\` ON \`user\``);
            yield queryRunner.query(`DROP TABLE \`user\``);
            yield queryRunner.query(`DROP INDEX \`IDX_e72fe0fef1f5412c556ced603d\` ON \`rol\``);
            yield queryRunner.query(`DROP TABLE \`rol\``);
        });
    }
}
exports.CreateUserTable1726895760571 = CreateUserTable1726895760571;
//# sourceMappingURL=1726895760571-CreateUserTable.js.map