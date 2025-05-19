import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtAuthStrategy } from '../auth/strategies/jwt-auth.strategy';
import { SharedModule } from '../shared/shared.module';
import { OwnerController } from './controllers/owner.controller';
import { Owner } from './entities/owner.entity';
import { OwnerService } from './services/owner.service';
import { OwnerAclService } from './services/owner-acl.service';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([Owner])],
  providers: [OwnerService, JwtAuthStrategy, OwnerAclService],
  controllers: [OwnerController],
  exports: [OwnerService],
})
export class OwnerModule {}