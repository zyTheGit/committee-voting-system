import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateVote1747667797938 implements MigrationInterface {
    name = 'CreateVote1747667797938'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "votes" ("id" SERIAL NOT NULL, "ownerId" integer NOT NULL, "candidateId" integer NOT NULL, "votingRuleId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_af172411476871a5c2865f16910" UNIQUE ("ownerId", "candidateId", "votingRuleId"), CONSTRAINT "PK_f3d9fd4a0af865152c3f59db8ff" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "votes" ADD CONSTRAINT "FK_bff2880e28e53ca5ded0362672f" FOREIGN KEY ("ownerId") REFERENCES "owners"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "votes" ADD CONSTRAINT "FK_298bec07d3e3d5b91c79ff3e0fd" FOREIGN KEY ("candidateId") REFERENCES "candidates"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "votes" ADD CONSTRAINT "FK_8d3b27a655af5b55f47f8971b50" FOREIGN KEY ("votingRuleId") REFERENCES "voting_rules"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "votes" DROP CONSTRAINT "FK_8d3b27a655af5b55f47f8971b50"`);
        await queryRunner.query(`ALTER TABLE "votes" DROP CONSTRAINT "FK_298bec07d3e3d5b91c79ff3e0fd"`);
        await queryRunner.query(`ALTER TABLE "votes" DROP CONSTRAINT "FK_bff2880e28e53ca5ded0362672f"`);
        await queryRunner.query(`DROP TABLE "votes"`);
    }

}
