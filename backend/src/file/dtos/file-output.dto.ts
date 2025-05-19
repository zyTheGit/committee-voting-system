import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class FileOutput {
  @Expose()
  @ApiProperty({ description: '文件ID' })
  id: number;

  @Expose()
  @ApiProperty({ description: '文件名称' })
  filename: string;

  @Expose()
  @ApiProperty({ description: '文件类型' })
  mimetype: string;

  @Expose()
  @ApiProperty({ description: '文件大小(字节)' })
  size: number;

  @Expose()
  @ApiProperty({ description: '文件扩展名' })
  extension: string;

  @Expose()
  @ApiProperty({ description: '原始文件名' })
  originalname: string;

  @Expose()
  @ApiProperty({ description: '文件描述' })
  description: string;

  @Expose()
  @ApiProperty({ description: '创建时间' })
  createdAt: Date;

  @Expose()
  @ApiProperty({ description: '更新时间' })
  updatedAt: Date;
}