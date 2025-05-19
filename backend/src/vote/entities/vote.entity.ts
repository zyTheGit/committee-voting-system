import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Unique } from 'typeorm';
import { Owner } from '../../owner/entities/owner.entity';
import { Candidate } from '../../candidate/entities/candidate.entity';
import { VotingRule } from '../../voting-rule/entities/voting-rule.entity';

@Entity('votes')
@Unique(['ownerId', 'candidateId', 'votingRuleId'])
export class Vote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ownerId: number;

  @ManyToOne(() => Owner)
  owner: Owner;

  @Column()
  candidateId: number;

  @ManyToOne(() => Candidate)
  candidate: Candidate;

  @Column()
  votingRuleId: number;

  @ManyToOne(() => VotingRule)
  votingRule: VotingRule;

  @CreateDateColumn()
  createdAt: Date;
}