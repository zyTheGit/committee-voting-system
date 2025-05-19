import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateVotingRules1747666426777 implements MigrationInterface {
    name = 'CreateVotingRules1747666426777'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "voting_rules" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "description" text, "startTime" TIMESTAMP, "endTime" TIMESTAMP, "isActive" boolean NOT NULL DEFAULT false, "maxVotesPerUser" integer NOT NULL DEFAULT '1', "minCandidates" integer NOT NULL DEFAULT '1', "maxCandidates" integer NOT NULL DEFAULT '10', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a1886cd41ad78ca231d293cce31" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "candidates" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "votingRuleId" integer NOT NULL, "statement" text, "avatarUrl" text, "isApproved" boolean NOT NULL DEFAULT false, "votesCount" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_140681296bf033ab1eb95288abb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "candidates" ADD CONSTRAINT "FK_10d0384a816526f8c7f6b1e67b3" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "candidates" ADD CONSTRAINT "FK_0252ce0680ef6ed291ce57e585f" FOREIGN KEY ("votingRuleId") REFERENCES "voting_rules"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "candidates" DROP CONSTRAINT "FK_0252ce0680ef6ed291ce57e585f"`);
        await queryRunner.query(`ALTER TABLE "candidates" DROP CONSTRAINT "FK_10d0384a816526f8c7f6b1e67b3"`);
        await queryRunner.query(`DROP TABLE "candidates"`);
        await queryRunner.query(`DROP TABLE "voting_rules"`);
    }

}
