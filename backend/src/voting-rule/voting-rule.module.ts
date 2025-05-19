import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { VotingRuleController } from './controllers/voting-rule.controller';
import { VotingRule } from './entities/voting-rule.entity';
import { VotingRuleService } from './services/voting-rule.service';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([VotingRule])],
  controllers: [VotingRuleController],
  providers: [VotingRuleService],
  exports: [VotingRuleService],
})
export class VotingRuleModule {}