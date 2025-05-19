import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { VoteService } from '../services/vote.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('投票')
@Controller('votes')
export class VoteController {
  constructor(private readonly voteService: VoteService) {}

  @Post()
  @ApiOperation({ summary: '业主投票' })
  @ApiResponse({ status: 201, description: '投票成功' })
  @UseGuards(JwtAuthGuard)
  async vote(
    @Request() req,
    @Body() body: { candidateId: number; votingRuleId: number },
  ) {
    // 假设 req.user.ownerId 已经通过认证获取到业主ID
    const ownerId = req.user.ownerId;
    await this.voteService.vote(ownerId, body.candidateId, body.votingRuleId);
    return { message: '投票成功' };
  }
}
