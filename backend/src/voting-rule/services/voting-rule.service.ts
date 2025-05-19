import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AppLogger } from '../../shared/logger/logger.service';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { VotingRule } from '../entities/voting-rule.entity';
import { CreateVotingRuleInput } from '../dtos/voting-rule-create-input.dto';
import { UpdateVotingRuleInput } from '../dtos/voting-rule-update-input.dto';
import { VotingRuleOutput } from '../dtos/voting-rule-output.dto';

@Injectable()
export class VotingRuleService {
  constructor(
    @InjectRepository(VotingRule)
    private readonly votingRuleRepository: Repository<VotingRule>,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(VotingRuleService.name);
  }

  async createVotingRule(
    ctx: RequestContext,
    input: CreateVotingRuleInput,
  ): Promise<VotingRuleOutput> {
    this.logger.log(ctx, `${this.createVotingRule.name} was called`);

    const votingRule = this.votingRuleRepository.create(input);
    const savedVotingRule = await this.votingRuleRepository.save(votingRule);

    return this.toVotingRuleOutput(savedVotingRule);
  }

  async getVotingRules(
    ctx: RequestContext,
    limit: number,
    offset: number,
  ): Promise<{ records: VotingRuleOutput[]; count: number }> {
    this.logger.log(ctx, `${this.getVotingRules.name} was called`);

    const [votingRules, count] = await this.votingRuleRepository.findAndCount({
      skip: offset,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    const votingRuleOutputs = votingRules.map((votingRule) =>
      this.toVotingRuleOutput(votingRule),
    );

    return { records: votingRuleOutputs, count };
  }

  async getVotingRuleById(
    ctx: RequestContext,
    id: number,
  ): Promise<VotingRuleOutput> {
    this.logger.log(ctx, `${this.getVotingRuleById.name} was called`);

    const votingRule = await this.votingRuleRepository.findOne({
      where: { id },
    });

    if (!votingRule) {
      throw new Error('投票规则不存在');
    }

    return this.toVotingRuleOutput(votingRule);
  }

  async updateVotingRule(
    ctx: RequestContext,
    id: number,
    input: UpdateVotingRuleInput,
  ): Promise<VotingRuleOutput> {
    this.logger.log(ctx, `${this.updateVotingRule.name} was called`);

    const votingRule = await this.votingRuleRepository.findOne({
      where: { id },
    });

    if (!votingRule) {
      throw new Error('投票规则不存在');
    }

    const updatedVotingRule = await this.votingRuleRepository.save(
      Object.assign(votingRule, input),
    );

    return this.toVotingRuleOutput(updatedVotingRule);
  }

  async deleteVotingRule(ctx: RequestContext, id: number): Promise<boolean> {
    this.logger.log(ctx, `${this.deleteVotingRule.name} was called`);

    const votingRule = await this.votingRuleRepository.findOne({
      where: { id },
    });

    if (!votingRule) {
      throw new Error('投票规则不存在');
    }

    await this.votingRuleRepository.remove(votingRule);

    return true;
  }

  toVotingRuleOutput(votingRule: VotingRule): VotingRuleOutput {
    const votingRuleOutput = new VotingRuleOutput();

    votingRuleOutput.id = votingRule.id;
    votingRuleOutput.name = votingRule.name;
    votingRuleOutput.description = votingRule.description;
    votingRuleOutput.startTime = votingRule.startTime;
    votingRuleOutput.endTime = votingRule.endTime;
    votingRuleOutput.isActive = votingRule.isActive;
    votingRuleOutput.maxVotesPerUser = votingRule.maxVotesPerUser;
    votingRuleOutput.minCandidates = votingRule.minCandidates;
    votingRuleOutput.maxCandidates = votingRule.maxCandidates;
    votingRuleOutput.createdAt = votingRule.createdAt;
    votingRuleOutput.updatedAt = votingRule.updatedAt;

    return votingRuleOutput;
  }
}