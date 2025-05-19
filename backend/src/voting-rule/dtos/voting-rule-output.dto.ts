import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class VotingRuleOutput {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty({ required: false, nullable: true })
  description: string;

  @Expose()
  @ApiProperty({ required: false, nullable: true })
  startTime: Date;

  @Expose()
  @ApiProperty({ required: false, nullable: true })
  endTime: Date;

  @Expose()
  @ApiProperty()
  isActive: boolean;

  @Expose()
  @ApiProperty()
  maxVotesPerUser: number;

  @Expose()
  @ApiProperty()
  minCandidates: number;

  @Expose()
  @ApiProperty()
  maxCandidates: number;

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty()
  updatedAt: Date;
}