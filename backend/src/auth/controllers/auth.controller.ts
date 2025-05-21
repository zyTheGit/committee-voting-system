import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation,ApiResponse, ApiTags } from '@nestjs/swagger';

import {
  BaseApiErrorResponse,
  BaseApiResponse,
  SwaggerBaseApiResponse,
} from '../../shared/dtos/base-api-response.dto';
import { AppLogger } from '../../shared/logger/logger.service';
import { ReqContext } from '../../shared/request-context/req-context.decorator';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { LoginInput } from '../dtos/auth-login-input.dto';
import { RefreshTokenInput } from '../dtos/auth-refresh-token-input.dto';
import { RegisterInput } from '../dtos/auth-register-input.dto';
import { RegisterOutput } from '../dtos/auth-register-output.dto';
import { AuthTokenOutput } from '../dtos/auth-token-output.dto';
import { JwtRefreshGuard } from '../guards/jwt-refresh.guard';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { AuthService } from '../services/auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(AuthController.name);
  }
  @Post('login')
  @ApiOperation({
    summary: '用户登录',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(AuthTokenOutput),
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: BaseApiErrorResponse,
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  login(
    @ReqContext() ctx: RequestContext,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() credential: LoginInput,
  ): BaseApiResponse<AuthTokenOutput> {
    this.logger.log(ctx, `${this.login.name} was called`);

    const authToken = this.authService.login(ctx);
    
    return { result: authToken, code: HttpStatus.OK, message: 'success' };
  }

  @Post('register')
  @ApiOperation({
    summary: '用户注册',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: SwaggerBaseApiResponse(RegisterOutput),
  })
  async registerLocal(
    @ReqContext() ctx: RequestContext,
    @Body() input: RegisterInput,
  ): Promise<BaseApiResponse<RegisterOutput>> {
    const registeredUser = await this.authService.register(ctx, input);
    return { result: registeredUser, code: HttpStatus.OK, message: 'success' };
  }

  @Post('refresh-token')
  @ApiOperation({
    summary: '刷新token',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(AuthTokenOutput),
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: BaseApiErrorResponse,
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async refreshToken(
    @ReqContext() ctx: RequestContext,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() credential: RefreshTokenInput,
  ): Promise<BaseApiResponse<AuthTokenOutput>> {
    this.logger.log(ctx, `${this.refreshToken.name} was called`,RefreshTokenInput);
    
    const authToken = await this.authService.refreshToken(ctx);
    return { result: authToken, code: HttpStatus.OK, message: 'success' };
  }
  @Post('logout')
  @ApiOperation({ summary: '退出登录' })
  @ApiResponse({ status: HttpStatus.OK, type: SwaggerBaseApiResponse(Object) })
  @HttpCode(HttpStatus.OK)
  async logout(@ReqContext() ctx: RequestContext): Promise<BaseApiResponse<null>> {
    this.logger.log(ctx, `${this.logout.name} was called`);
    await this.authService.logout(ctx);
    return { result: null, code: HttpStatus.OK, message: 'success' };
  }
}
