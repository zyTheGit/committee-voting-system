import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CandidateController } from './controllers/candidate.controller';
import { Candidate } from './entities/candidate.entity';
import { CandidateService } from './services/candidate.service';
import { SharedModule } from '../shared/shared.module';
import { VotingRuleModule } from '../voting-rule/voting-rule.module';
import { UserModule } from '../user/user.module';
import { FileModule } from '../file/file.module';

@Module({
  imports: [
    SharedModule,
    TypeOrmModule.forFeature([Candidate]),
    VotingRuleModule,
    UserModule,
    FileModule,
  ],
  controllers: [CandidateController],
  providers: [CandidateService],
  exports: [CandidateService],
})
export class CandidateModule {}