import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtAuthStrategy } from '../auth/strategies/jwt-auth.strategy';
import { SharedModule } from '../shared/shared.module';
import { VoteController } from './controllers/vote.controller';
import { Vote } from './entities/vote.entity';
import { VoteService } from './services/vote.service';
import { FileModule } from '../file/file.module';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([Vote]), FileModule],
  providers: [VoteService, JwtAuthStrategy],
  controllers: [VoteController],
  exports: [VoteService],
})
export class VoteModule {}
