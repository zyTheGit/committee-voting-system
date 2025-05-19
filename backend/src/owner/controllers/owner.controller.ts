import {
  Controller,
  Post,
  Get,
  UploadedFile,
  UseInterceptors,
  Res,
  Query,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { OwnerService } from '../services/owner.service';
import { Owner } from '../entities/owner.entity';
import { OwnerInput } from '../dtos/owner-update-input.dto';
import { OwnerOutput } from '../dtos/owner-output.dto';

@ApiTags('业主')
@Controller('owners')
export class OwnerController {
  constructor(private readonly ownerService: OwnerService) {}

  @ApiOperation({ summary: '新增业主', description: '创建新的业主信息' })
  @ApiResponse({ status: 201, description: '创建成功' })
  @ApiResponse({ status: 400, description: '参数错误' })
  @Post()
  async create(@Body() owner: Owner): Promise<Owner> {
    return this.ownerService.create(owner);
  }

  @ApiOperation({ summary: '更新业主信息', description: '根据ID更新业主信息' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 404, description: '业主不存在' })
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateOwnerDto: Partial<OwnerInput>,
  ): Promise<OwnerOutput> {
    return this.ownerService.update(id, updateOwnerDto);
  }

  @ApiOperation({ summary: '删除业主', description: '根据ID删除业主信息' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '业主不存在' })
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.ownerService.remove(id);
  }

  @ApiOperation({
    summary: '导入业主信息',
    description: '通过Excel文件导入业主信息',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: '导入成功' })
  @ApiResponse({ status: 400, description: '文件格式错误' })
  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async import(@UploadedFile() file: Express.Multer.File) {
    return this.ownerService.importFromExcel(file);
  }

  @ApiOperation({
    summary: '搜索业主',
    description: '根据姓名、电话或身份证号搜索业主',
  })
  @ApiResponse({ status: 200, description: '搜索成功' })
  @Get()
  async getOwners(
    @Query()
    query: {
      name?: string;
      phone?: string;
      idNumber?: string;
      page?: number;
      limit?: number;
    },
  ) {
    const { records, count } = await this.ownerService.getOwners(query);

    return { data: records, meta: { count } };
  }

  @ApiOperation({
    summary: '导出业主信息',
    description: '导出所有业主信息到Excel文件',
  })
  @ApiResponse({
    status: 200,
    description: '导出成功',
    content: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Get('export')
  async export(@Res() res: Response) {
    const buffer = await this.ownerService.exportToExcel();
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename=owners.xlsx');
    res.send(buffer);
  }
}
