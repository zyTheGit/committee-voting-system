import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCandidateInput {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  votingRuleId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  statement?: string;

  // 头像文件不需要在DTO中声明，直接用 @UploadedFile() 获取
}