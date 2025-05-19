import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ROLE } from '../../auth/constants/role.constant';
import { Roles } from '../../auth/decorators/role.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import {
  BaseApiErrorResponse,
  BaseApiResponse,
  SwaggerBaseApiResponse,
} from '../../shared/dtos/base-api-response.dto';
import { PaginationParamsDto } from '../../shared/dtos/pagination-params.dto';
import { AppLogger } from '../../shared/logger/logger.service';
import { ReqContext } from '../../shared/request-context/req-context.decorator';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { VotingRuleOutput } from '../dtos/voting-rule-output.dto';
import { CreateVotingRuleInput } from '../dtos/voting-rule-create-input.dto';
import { UpdateVotingRuleInput } from '../dtos/voting-rule-update-input.dto';
import { VotingRuleService } from '../services/voting-rule.service';

@ApiTags('投票规则')
@Controller('voting-rules')
export class VotingRuleController {
  constructor(
    private readonly votingRuleService: VotingRuleService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(VotingRuleController.name);
  }

  @Post()
  @ApiOperation({
    summary: '创建投票规则',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: SwaggerBaseApiResponse(VotingRuleOutput),
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  async createVotingRule(
    @ReqContext() ctx: RequestContext,
    @Body() input: CreateVotingRuleInput,
  ): Promise<BaseApiResponse<VotingRuleOutput>> {
    this.logger.log(ctx, `${this.createVotingRule.name} was called`);

    const votingRule = await this.votingRuleService.createVotingRule(ctx, input);
    return { data: votingRule, statusCode: HttpStatus.CREATED, message: 'success' };
  }

  @Get()
  @ApiOperation({
    summary: '获取投票规则列表',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse([VotingRuleOutput]),
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  async getVotingRules(
    @ReqContext() ctx: RequestContext,
    @Query() query: PaginationParamsDto,
  ): Promise<BaseApiResponse<VotingRuleOutput[]>> {
    this.logger.log(ctx, `${this.getVotingRules.name} was called`);

    const { records, count } = await this.votingRuleService.getVotingRules(
      ctx,
      query.limit,
      query.offset,
    );

    return {
      data: records,
      meta: { count },
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: '通过ID获取投票规则',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(VotingRuleOutput),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  async getVotingRule(
    @ReqContext() ctx: RequestContext,
    @Param('id') id: number,
  ): Promise<BaseApiResponse<VotingRuleOutput>> {
    this.logger.log(ctx, `${this.getVotingRule.name} was called`);

    const votingRule = await this.votingRuleService.getVotingRuleById(ctx, id);
    return { data: votingRule, statusCode: HttpStatus.OK, message: 'success' };
  }

  @Patch(':id')
  @ApiOperation({
    summary: '更新投票规则',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(VotingRuleOutput),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  async updateVotingRule(
    @ReqContext() ctx: RequestContext,
    @Param('id') id: number,
    @Body() input: UpdateVotingRuleInput,
  ): Promise<BaseApiResponse<VotingRuleOutput>> {
    this.logger.log(ctx, `${this.updateVotingRule.name} was called`);

    const votingRule = await this.votingRuleService.updateVotingRule(
      ctx,
      id,
      input,
    );
    return { data: votingRule, statusCode: HttpStatus.OK, message: 'success' };
  }

  @Delete(':id')
  @ApiOperation({
    summary: '删除投票规则',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(Boolean),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  @ApiBearerAuth()
  async deleteVotingRule(
    @ReqContext() ctx: RequestContext,
    @Param('id') id: number,
  ): Promise<BaseApiResponse<boolean>> {
    this.logger.log(ctx, `${this.deleteVotingRule.name} was called`);

    const success = await this.votingRuleService.deleteVotingRule(ctx, id);
    return { data: success, statusCode: HttpStatus.OK, message: 'success' };
  }
}