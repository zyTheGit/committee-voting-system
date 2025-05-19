import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vote } from '../entities/vote.entity';
import { Candidate } from '../../candidate/entities/candidate.entity';
import { VotingRule } from '../../voting-rule/entities/voting-rule.entity';
import { Owner } from '../../owner/entities/owner.entity';

@Injectable()
export class VoteService {
  constructor(
    @InjectRepository(Vote)
    private readonly voteRepository: Repository<Vote>,
    @InjectRepository(Candidate)
    private readonly candidateRepository: Repository<Candidate>,
    @InjectRepository(VotingRule)
    private readonly votingRuleRepository: Repository<VotingRule>,
  ) {}

  async vote(ownerId: number, candidateId: number, votingRuleId: number): Promise<Vote> {
    // 检查投票规则
    const votingRule = await this.votingRuleRepository.findOne({ where: { id: votingRuleId } });
    if (!votingRule || !votingRule.isActive) {
      throw new BadRequestException('投票规则不存在或未激活');
    }

    // 检查候选人
    const candidate = await this.candidateRepository.findOne({ where: { id: candidateId, votingRuleId } });
    if (!candidate) {
      throw new BadRequestException('候选人不存在');
    }

    // 检查业主是否已投票，是否超出最大投票数
    const count = await this.voteRepository.count({ where: { ownerId, votingRuleId } });
    if (count >= votingRule.maxVotesPerUser) {
      throw new BadRequestException('已达到最大投票数');
    }

    // 检查是否重复投票
    const exist = await this.voteRepository.findOne({ where: { ownerId, candidateId, votingRuleId } });
    if (exist) {
      throw new BadRequestException('不能重复投票');
    }

    // 保存投票
    const vote = this.voteRepository.create({ ownerId, candidateId, votingRuleId });
    await this.voteRepository.save(vote);

    // 更新候选人票数
    candidate.votesCount += 1;
    await this.candidateRepository.save(candidate);

    return vote;
  }
}