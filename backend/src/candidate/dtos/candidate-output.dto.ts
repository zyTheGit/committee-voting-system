import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { UserOutput } from '../../user/dtos/user-output.dto';
import { VotingRuleOutput } from '../../voting-rule/dtos/voting-rule-output.dto';

export class CandidateOutput {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  userId: number;

  @Expose()
  @Type(() => UserOutput)
  @ApiProperty({ type: () => UserOutput })
  user: UserOutput;

  @Expose()
  @ApiProperty()
  votingRuleId: number;

  @Expose()
  @Type(() => VotingRuleOutput)
  @ApiProperty({ type: () => VotingRuleOutput })
  votingRule: VotingRuleOutput;

  @Expose()
  @ApiProperty({ required: false, nullable: true })
  statement: string;

  @Expose()
  @ApiProperty({ required: false, nullable: true })
  avatarUrl: string;

  @Expose()
  @ApiProperty()
  isApproved: boolean;

  @Expose()
  @ApiProperty()
  votesCount: number;

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty()
  updatedAt: Date;
}