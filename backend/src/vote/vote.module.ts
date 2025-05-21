import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtAuthStrategy } from '../auth/strategies/jwt-auth.strategy';
import { SharedModule } from '../shared/shared.module';
import { VoteController } from './controllers/vote.controller';
import { Vote } from './entities/vote.entity';
import { Candidate } from '../candidate/entities/candidate.entity';
import { VotingRule } from '../voting-rule/entities/voting-rule.entity';
import { VoteService } from './services/vote.service';
import { FileModule } from '../file/file.module';

@Module({
  imports: [
    SharedModule,
    TypeOrmModule.forFeature([Vote, Candidate, VotingRule]),
    FileModule,
  ],
  providers: [VoteService, JwtAuthStrategy],
  controllers: [VoteController],
  exports: [VoteService],
})
export class VoteModule {}
