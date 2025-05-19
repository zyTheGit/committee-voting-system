import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { VotingRule } from '../../voting-rule/entities/voting-rule.entity';

@Entity('candidates')
export class Candidate {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => VotingRule)
  @JoinColumn({ name: 'votingRuleId' })
  votingRule: VotingRule;

  @Column()
  votingRuleId: number;

  @Column({ type: 'text', nullable: true })
  statement: string;

  @Column({ type: 'text', nullable: true })
  avatarUrl: string;

  @Column({ default: false })
  isApproved: boolean;

  @Column({ type: 'int', default: 0 })
  votesCount: number;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;
}