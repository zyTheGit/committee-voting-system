import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { UserModule } from './user/user.module';
import { OwnerModule } from './owner/owner.module';

@Module({
  imports: [SharedModule, UserModule, AuthModule, OwnerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
