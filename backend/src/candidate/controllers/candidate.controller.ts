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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiBody,
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
import { CandidateOutput } from '../dtos/candidate-output.dto';
import { CreateCandidateInput } from '../dtos/candidate-create-input.dto';
import { CandidateService } from '../services/candidate.service';

@ApiTags('候选人')
@Controller('candidates')
export class CandidateController {
  constructor(
    private readonly candidateService: CandidateService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(CandidateController.name);
  }

  @Post()
  @ApiOperation({
    summary: '报名参选（支持上传头像）',
  })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: SwaggerBaseApiResponse(CandidateOutput),
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('avatar'))
  async createCandidate(
    @ReqContext() ctx: RequestContext,
    @Body() input: CreateCandidateInput,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<BaseApiResponse<CandidateOutput>> {
    this.logger.log(ctx, `${this.createCandidate.name} was called`);

    const candidate = await this.candidateService.createCandidate(ctx, input, file);
    return { result: candidate, code: HttpStatus.CREATED, message: 'success' };
  }

  @Get()
  @ApiOperation({
    summary: '获取候选人列表',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse([CandidateOutput]),
  })
  @ApiQuery({ name: 'votingRuleId', required: false, type: Number })
  @ApiQuery({ name: 'isApproved', required: false, type: Boolean })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  async getCandidates(
    @ReqContext() ctx: RequestContext,
    @Query('votingRuleId') votingRuleId?: number,
    @Query('isApproved') isApproved?: boolean,
    @Query() query?: PaginationParamsDto,
  ): Promise<BaseApiResponse<CandidateOutput[]>> {
    this.logger.log(ctx, `${this.getCandidates.name} was called`);

    const { records, count } = await this.candidateService.getCandidates(
      ctx,
      votingRuleId,
      isApproved,
      query?.limit,
      query?.offset,
    );

    return {
      result: records,
      meta: { count },
      code: HttpStatus.OK,
      message: 'success',
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: '通过ID获取候选人',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(CandidateOutput),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  async getCandidate(
    @ReqContext() ctx: RequestContext,
    @Param('id') id: number,
  ): Promise<BaseApiResponse<CandidateOutput>> {
    this.logger.log(ctx, `${this.getCandidate.name} was called`);

    const candidate = await this.candidateService.getCandidateById(ctx, id);
    return { result: candidate, code: HttpStatus.OK, message: 'success' };
  }

  @Patch(':id/approve')
  @ApiOperation({
    summary: '审批候选人',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(CandidateOutput),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  async approveCandidate(
    @ReqContext() ctx: RequestContext,
    @Param('id') id: number,
  ): Promise<BaseApiResponse<CandidateOutput>> {
    this.logger.log(ctx, `${this.approveCandidate.name} was called`);

    const candidate = await this.candidateService.approveCandidate(ctx, id);
    return { result: candidate, code: HttpStatus.OK, message: 'success' };
  }

  @Delete(':id')
  @ApiOperation({
    summary: '撤回候选资格',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(Boolean),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async withdrawCandidate(
    @ReqContext() ctx: RequestContext,
    @Param('id') id: number,
  ): Promise<BaseApiResponse<boolean>> {
    this.logger.log(ctx, `${this.withdrawCandidate.name} was called`);

    const success = await this.candidateService.withdrawCandidate(ctx, id);
    return { result: success, code: HttpStatus.OK, message: 'success' };
  }
}