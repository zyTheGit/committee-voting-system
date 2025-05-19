import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { File } from './entities/file.entity';
import { FileService } from './services/file.service';
import { FileController } from './controllers/file.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([File]),
    ConfigModule,
    MulterModule.register({
      dest: './upload',
    }),
  ],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}