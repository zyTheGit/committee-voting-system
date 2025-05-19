import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { File } from '../entities/file.entity';
import { FileOutput } from '../dtos/file-output.dto';
import { plainToClass } from 'class-transformer';

const mkdirAsync = promisify(fs.mkdir);
const existsAsync = promisify(fs.exists);
const unlinkAsync = promisify(fs.unlink);

@Injectable()
export class FileService {
  private uploadDir: string;

  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,
    private configService: ConfigService,
  ) {
    // 获取配置的上传目录，默认为项目根目录下的upload文件夹
    this.uploadDir =
      this.configService.get<string>('file.uploadDir') ||
      path.join(process.cwd(), 'upload');
    // 确保上传目录存在
    this.ensureUploadDirExists();
  }

  private async ensureUploadDirExists(): Promise<void> {
    try {
      if (!(await existsAsync(this.uploadDir))) {
        await mkdirAsync(this.uploadDir, { recursive: true });
      }
    } catch (error) {
      console.error('创建上传目录失败:', error);
      throw new Error('创建上传目录失败');
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    description?: string,
    moduleId?: string,
    moduleType?: string,
  ): Promise<FileOutput> {
    // 解析文件扩展名
    const extension = path.extname(file.originalname).toLowerCase();

    // 创建文件记录
    const fileEntity = new File();
    fileEntity.filename = file.filename;
    fileEntity.originalname = file.originalname;
    fileEntity.mimetype = file.mimetype;
    fileEntity.size = file.size;
    fileEntity.path = file.path;
    fileEntity.extension = extension;
    fileEntity.description = description ?? '';
    fileEntity.moduleId = moduleId ?? '';
    fileEntity.moduleType = moduleType ?? '';

    // 保存文件记录到数据库
    const savedFile = await this.fileRepository.save(fileEntity);

    // 转换为DTO并返回
    return plainToClass(FileOutput, savedFile, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * 批量上传文件
   * @param files 文件数组
   * @param description 文件描述
   * @param moduleId 关联模块ID
   * @param moduleType 关联模块类型
   * @returns 文件信息数组
   */
  async uploadFiles(
    files: Express.Multer.File[],
    description?: string,
    moduleId?: string,
    moduleType?: string,
  ): Promise<FileOutput[]> {
    // 创建文件实体数组
    const fileEntities = files.map((file) => {
      const extension = path.extname(file.originalname).toLowerCase();

      const fileEntity = new File();
      fileEntity.filename = file.filename;
      fileEntity.originalname = file.originalname;
      fileEntity.mimetype = file.mimetype;
      fileEntity.size = file.size;
      fileEntity.path = file.path;
      fileEntity.extension = extension;
      fileEntity.description = description ?? '';
      fileEntity.moduleId = moduleId ?? '';
      fileEntity.moduleType = moduleType ?? '';

      return fileEntity;
    });

    // 批量保存文件记录到数据库
    const savedFiles = await this.fileRepository.save(fileEntities);

    // 转换为DTO并返回
    return savedFiles.map((file) =>
      plainToClass(FileOutput, file, {
        excludeExtraneousValues: true,
      }),
    );
  }

  async getFileById(id: number): Promise<File> {
    const file = await this.fileRepository.findOneBy({ id });
    if (!file) {
      throw new NotFoundException(`文件ID ${id} 不存在`);
    }
    return file;
  }

  async getFileInfo(id: number): Promise<FileOutput> {
    const file = await this.getFileById(id);
    return plainToClass(FileOutput, file, {
      excludeExtraneousValues: true,
    });
  }

  async deleteFile(id: number): Promise<void> {
    const file = await this.getFileById(id);

    // 删除物理文件
    try {
      if (await existsAsync(file.path)) {
        await unlinkAsync(file.path);
      }
    } catch (error) {
      console.error(`删除文件 ${file.path} 失败:`, error);
      // 即使物理文件删除失败，也继续删除数据库记录
    }

    // 删除数据库记录
    await this.fileRepository.remove(file);
  }

  // 获取文件的物理路径
  getFilePath(id: number): Promise<string> {
    return this.getFileById(id).then((file) => file.path);
  }

  // 获取上传目录
  getUploadDir(): string {
    return this.uploadDir;
  }
}
