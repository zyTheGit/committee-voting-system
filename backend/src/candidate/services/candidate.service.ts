import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AppLogger } from '../../shared/logger/logger.service';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { UserService } from '../../user/services/user.service';
import { CreateCandidateInput } from '../dtos/candidate-create-input.dto';
import { CandidateOutput } from '../dtos/candidate-output.dto';
import { Candidate } from '../entities/candidate.entity';
import { VotingRuleService } from '../../voting-rule/services/voting-rule.service';
import { FileService } from '../../file/services/file.service';
import { ROLE } from 'src/auth/constants/role.constant';

@Injectable()
export class CandidateService {
  constructor(
    @InjectRepository(Candidate)
    private readonly candidateRepository: Repository<Candidate>,
    private readonly logger: AppLogger,
    private readonly votingRuleService: VotingRuleService,
    private readonly userService: UserService,
    private readonly fileService: FileService,
  ) {
    this.logger.setContext(CandidateService.name);
  }

  async createCandidate(
    ctx: RequestContext,
    input: CreateCandidateInput,
    file?: Express.Multer.File,
  ): Promise<CandidateOutput> {
    this.logger.log(ctx, `${this.createCandidate.name} was called`);

    // 验证投票规则是否存在
    const votingRule = await this.votingRuleService.getVotingRuleById(
      ctx,
      input.votingRuleId,
    );

    if (!ctx.user) {
      throw new Error('用户不存在');
    }

    // 创建候选人实体
    const candidate = new Candidate();
    candidate.userId = ctx.user.id;
    candidate.votingRuleId = input.votingRuleId;
    candidate.statement = input.statement ?? '';

    // 处理头像文件
    if (file) {
      // 修正 originalname 编码
      file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
      const fileInfo = await this.fileService.uploadFile(
        file,
        '候选人头像',
        candidate.userId.toString(),
        'candidate',
      );
      candidate.avatarUrl = await this.fileService.getFilePath(fileInfo.id);
    } else {
      candidate.avatarUrl = '';
    }

    // 保存候选人
    const savedCandidate = await this.candidateRepository.save(candidate);

    return this.toCandidateOutput(ctx, savedCandidate);
  }

  async getCandidates(
    ctx: RequestContext,
    votingRuleId?: number,
    isApproved?: boolean,
    limit?: number,
    offset?: number,
  ): Promise<{ records: CandidateOutput[]; count: number }> {
    this.logger.log(ctx, `${this.getCandidates.name} was called`);

    const queryBuilder =
      this.candidateRepository.createQueryBuilder('candidate');

    if (votingRuleId) {
      queryBuilder.andWhere('candidate.votingRuleId = :votingRuleId', {
        votingRuleId,
      });
    }

    if (isApproved !== undefined) {
      queryBuilder.andWhere('candidate.isApproved = :isApproved', {
        isApproved,
      });
    }

    queryBuilder.orderBy('candidate.votesCount', 'DESC');

    if (limit) {
      queryBuilder.take(limit);
    }

    if (offset) {
      queryBuilder.skip(offset);
    }

    const [candidates, count] = await queryBuilder.getManyAndCount();

    const candidateOutputs = await Promise.all(
      candidates.map((candidate) => this.toCandidateOutput(ctx, candidate)),
    );

    return { records: candidateOutputs, count };
  }

  async getCandidateById(
    ctx: RequestContext,
    id: number,
  ): Promise<CandidateOutput> {
    this.logger.log(ctx, `${this.getCandidateById.name} was called`);

    const candidate = await this.candidateRepository.findOne({
      where: { id },
    });

    if (!candidate) {
      throw new Error('候选人不存在');
    }

    return this.toCandidateOutput(ctx, candidate);
  }

  async approveCandidate(
    ctx: RequestContext,
    id: number,
  ): Promise<CandidateOutput> {
    this.logger.log(ctx, `${this.approveCandidate.name} was called`);

    const candidate = await this.candidateRepository.findOne({
      where: { id },
    });

    if (!candidate) {
      throw new Error('候选人不存在');
    }

    candidate.isApproved = true;
    const updatedCandidate = await this.candidateRepository.save(candidate);

    return this.toCandidateOutput(ctx, updatedCandidate);
  }

  async withdrawCandidate(ctx: RequestContext, id: number): Promise<boolean> {
    this.logger.log(ctx, `${this.withdrawCandidate.name} was called`);

    const candidate = await this.candidateRepository.findOne({
      where: { id },
    });

    if (!candidate) {
      throw new Error('候选人不存在');
    }

    // 只有候选人本人或管理员可以撤回候选资格
    if (
      ctx.user &&
      candidate.userId !== ctx.user.id &&
      !ctx.user.roles.includes(ROLE.ADMIN)
    ) {
      throw new Error('没有权限执行此操作');
    }

    await this.candidateRepository.remove(candidate);

    return true;
  }

  /**
   * 上传候选人头像
   * @param ctx 请求上下文
   * @param id 候选人ID
   * @param file 上传的文件
   * @returns 更新后的候选人信息
   */
  async uploadAvatar(
    ctx: RequestContext,
    id: number,
    file: Express.Multer.File,
  ): Promise<CandidateOutput> {
    this.logger.log(ctx, `${this.uploadAvatar.name} was called`);

    // 获取候选人
    const candidate = await this.getCandidateById(ctx, id);

    // 上传文件
    const fileInfo = await this.fileService.uploadFile(
      file,
      '候选人头像',
      id.toString(),
      'candidate',
    );

    // 更新候选人头像URL
    candidate.avatarUrl = await this.fileService.getFilePath(fileInfo.id);
    const updatedCandidate = await this.candidateRepository.save(candidate);

    return this.toCandidateOutput(ctx, updatedCandidate);
  }

  async toCandidateOutput(
    ctx: RequestContext,
    candidate: Candidate,
  ): Promise<CandidateOutput> {
    const candidateOutput = new CandidateOutput();

    candidateOutput.id = candidate.id;
    candidateOutput.userId = candidate.userId;
    candidateOutput.votingRuleId = candidate.votingRuleId;
    candidateOutput.statement = candidate.statement;
    candidateOutput.avatarUrl = candidate.avatarUrl;
    candidateOutput.isApproved = candidate.isApproved;
    candidateOutput.votesCount = candidate.votesCount;
    candidateOutput.createdAt = candidate.createdAt;
    candidateOutput.updatedAt = candidate.updatedAt;

    // 加载用户信息
    try {
      const user = await this.userService.getUserById(ctx, candidate.userId);
      candidateOutput.user = user;
    } catch (error: any) {
      this.logger.error(ctx, `Error loading user: ${error.message}`);
    }

    // 加载投票规则信息
    try {
      const votingRule = await this.votingRuleService.getVotingRuleById(
        ctx,
        candidate.votingRuleId,
      );
      candidateOutput.votingRule = votingRule;
    } catch (error: any) {
      this.logger.error(ctx, `Error loading voting rule: ${error.message}`);
    }

    return candidateOutput;
  }
}
