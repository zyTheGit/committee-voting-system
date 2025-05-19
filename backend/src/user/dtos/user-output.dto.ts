import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

import { ROLE } from '../../auth/constants/role.constant';

export class UserOutput {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  username: string;

  @Expose()
  @ApiProperty({ example: [ROLE.USER] })
  roles: ROLE[];

  // @Expose()
  // @ApiProperty()
  // email: string;

  @Expose()
  @ApiProperty()
  isAccountDisabled: boolean;

  @Expose()
  @ApiProperty()
  @Transform(({ value }) => value ? new Date(value).toISOString().replace('T', ' ').substring(0, 19) : value, { toPlainOnly: true })
  createdAt: string;

  @Expose()
  @ApiProperty()
  @Transform(({ value }) => value ? new Date(value).toISOString().replace('T', ' ').substring(0, 19) : value, { toPlainOnly: true })
  updatedAt: string;
}
