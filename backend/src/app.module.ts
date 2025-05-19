import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { UserModule } from './user/user.module';
import { OwnerModule } from './owner/owner.module';
import { FileModule } from './file/file.module';
import { VotingRuleModule } from './voting-rule/voting-rule.module';
import { CandidateModule } from './candidate/candidate.module';
import { VoteModule } from './vote/vote.module';

@Module({
  imports: [
    SharedModule,
    UserModule,
    AuthModule,
    OwnerModule,
    FileModule,
    VotingRuleModule,
    CandidateModule,
    VoteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
