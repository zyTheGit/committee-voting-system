import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateVotingRuleInput {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  startTime?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  endTime?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  maxVotesPerUser?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  minCandidates?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  maxCandidates?: number;
}