import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  Res,
  Body,
  StreamableFile,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { FileService } from '../services/file.service';
import { FileOutput } from '../dtos/file-output.dto';
import { diskStorage } from 'multer';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();
const uploadDir = configService.get<string>('FILE_UPLOAD_DIR') ?? './upload';
@ApiTags('文件管理')
@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @ApiOperation({ summary: '上传文件', description: '上传文件并返回文件信息' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        description: {
          type: 'string',
        },
        moduleId: {
          type: 'string',
        },
        moduleType: {
          type: 'string',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: '上传成功', type: FileOutput })
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          // 使用服务中的上传目录
          cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
          // 生成唯一文件名
          const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
          cb(null, uniqueFilename);
        },
      }),
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body()
    body: { description?: string; moduleId?: string; moduleType?: string },
  ): Promise<FileOutput> {
    file.originalname = Buffer.from(file.originalname, 'latin1').toString(
      'utf8',
    );
    return this.fileService.uploadFile(
      file,
      body.description,
      body.moduleId,
      body.moduleType,
    );
  }

  @ApiOperation({
    summary: '批量上传文件',
    description: '批量上传多个文件并返回文件信息列表',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        description: {
          type: 'string',
        },
        moduleId: {
          type: 'string',
        },
        moduleType: {
          type: 'string',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: '批量上传成功', type: [FileOutput] })
  @Post('batch-upload')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      // 最多允许上传10个文件
      storage: diskStorage({
        destination: (req, file, cb) => {
          // 使用服务中的上传目录
          const uploadDir = req.app.get('fileService').getUploadDir();
          cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
          // 生成唯一文件名
          const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
          cb(null, uniqueFilename);
        },
      }),
    }),
  )
  async uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Body()
    body: { description?: string; moduleId?: string; moduleType?: string },
  ): Promise<FileOutput[]> {
    return this.fileService.uploadFiles(
      files,
      body.description,
      body.moduleId,
      body.moduleType,
    );
  }

  @ApiOperation({
    summary: '获取文件信息',
    description: '根据文件ID获取文件信息',
  })
  @ApiResponse({ status: 200, description: '获取成功', type: FileOutput })
  @ApiResponse({ status: 404, description: '文件不存在' })
  @Get(':id/info')
  async getFileInfo(@Param('id') id: number): Promise<FileOutput> {
    return this.fileService.getFileInfo(id);
  }

  @ApiOperation({ summary: '下载文件', description: '根据文件ID下载文件' })
  @ApiResponse({ status: 200, description: '下载成功' })
  @ApiResponse({ status: 404, description: '文件不存在' })
  @Get(':id/download')
  async downloadFile(
    @Param('id') id: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    const file = await this.fileService.getFileById(id);

    res.set({
      'Content-Type': file.mimetype,
      'Content-Disposition': `attachment; filename="${encodeURIComponent(file.originalname || file.filename)}"`,
    });

    const fileStream = createReadStream(file.path);
    return new StreamableFile(fileStream);
  }

  @ApiOperation({ summary: '预览文件', description: '根据文件ID预览文件' })
  @ApiResponse({ status: 200, description: '预览成功' })
  @ApiResponse({ status: 404, description: '文件不存在' })
  @Get(':id/preview')
  async previewFile(
    @Param('id') id: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    const file = await this.fileService.getFileById(id);

    res.set({
      'Content-Type': file.mimetype,
      'Content-Disposition': `inline; filename="${encodeURIComponent(file.originalname || file.filename)}"`,
    });

    const fileStream = createReadStream(file.path);
    return new StreamableFile(fileStream);
  }

  @ApiOperation({ summary: '删除文件', description: '根据文件ID删除文件' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '文件不存在' })
  @Delete(':id')
  async deleteFile(@Param('id') id: number): Promise<void> {
    return this.fileService.deleteFile(id);
  }
}
