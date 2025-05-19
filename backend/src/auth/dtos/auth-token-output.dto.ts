import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { ROLE } from '../constants/role.constant';
import { UserOutput } from 'src/user/dtos/user-output.dto';

export class AuthTokenOutput {
  @Expose()
  @ApiProperty()
  accessToken: string;

  @Expose()
  @ApiProperty()
  refreshToken: string;

  @Expose()
  @ApiProperty()
  user: UserOutput;
}

export class UserAccessTokenClaims {
  @Expose()
  id: number;
  @Expose()
  username: string;
  @Expose()
  roles: ROLE[];
}

export class UserRefreshTokenClaims {
  id: number;
}
