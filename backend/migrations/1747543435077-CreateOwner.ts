import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOwner1747543435077 implements MigrationInterface {
    name = 'CreateOwner1747543435077'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "owners" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "phone" character varying(200) NOT NULL, "houseNumber" character varying(20) NOT NULL, "idNumber" character varying(100) NOT NULL, "remark" text, "createdAt" TIMESTAMP DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), CONSTRAINT "PK_42838282f2e6b216301a70b02d6" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "owners"`);
    }

}
