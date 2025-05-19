import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class OwnerOutput {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(2, 100)
  name: string;

  @Expose()
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(11, 11)
  phone: string;

  @Expose()
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(1, 20)
  houseNumber: string;

  @Expose()
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(18, 18)
  idNumber: string;

  @Expose()
  @ApiProperty({ required: false })
  remark?: string;

  @Expose()
  @ApiProperty()
  createdAt: string;

  @Expose()
  @ApiProperty()
  updatedAt: string;
}