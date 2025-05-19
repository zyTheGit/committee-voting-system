import { Injectable, UploadedFile, UseInterceptors } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as ExcelJS from 'exceljs';
import { Owner } from '../entities/owner.entity';
import { OwnerExcelDto } from '../dtos/owner-excel.dto';
import { plainToClass } from 'class-transformer';
import { OwnerOutput } from '../dtos/owner-output.dto';
import { OwnerInput } from '../dtos/owner-update-input.dto';
import { FileService } from 'src/file/services/file.service';
import { FileOutput } from 'src/file/dtos/file-output.dto';

@Injectable()
export class OwnerService {
  constructor(
    @InjectRepository(Owner)
    private ownerRepository: Repository<Owner>,
    private fileService: FileService,
  ) {}

  async importFromExcel(file: Express.Multer.File): Promise<Owner[]> {
    // 保存上传的Excel文件并获取文件信息
    const fileInfo = await this.fileService.uploadFile(
      file,
      '业主信息导入Excel文件',
      undefined,
      'owner-excel'
    );
    
    // 使用文件的buffer或从路径读取
    const fileBuffer = file instanceof Buffer ? file : file.buffer;
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(fileBuffer);

    const worksheet = workbook.worksheets[0];
    const owners: Owner[] = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        // Skip header row
        const owner = new Owner();
        const name = row.getCell(1).value?.toString();
        const phone = row.getCell(2).value?.toString();
        const houseNumber = row.getCell(3).value?.toString();
        const idNumber = row.getCell(4).value?.toString();

        if (!name || !phone || !houseNumber || !idNumber) {
          throw new Error(`第${rowNumber}行数据不完整，请检查必填字段`);
        }

        owner.name = name;
        owner.phone = phone;
        owner.houseNumber = houseNumber;
        owner.idNumber = idNumber;
        owner.remark = row.getCell(5).value?.toString() ?? '';
        owners.push(owner);
      }
    });

    return this.ownerRepository.save(owners);
  }

  async getOwners(query: {
    name?: string;
    phone?: string;
    idNumber?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ records: Owner[]; count: number }> {
    const where = [];
    if (query.name) where.push({ name: query.name });
    if (query.phone) where.push({ phone: query.phone });
    if (query.idNumber) where.push({ idNumber: query.idNumber });
    const [owners, count] = await this.ownerRepository.findAndCount({
      where: where.length > 0 ? where : undefined,
      take: query.limit ?? 100,
      skip: query.offset ?? 0,
    });
    const ownersOutput = plainToClass(Owner, owners, {
      excludeExtraneousValues: true,
    });

    return { records: ownersOutput, count };
  }

  async create(owner: Owner): Promise<Owner> {
    return this.ownerRepository.save(owner);
  }

  async update(id: number, input: Partial<OwnerInput>): Promise<OwnerOutput> {
    // 检查是否存在
    const owner = await this.ownerRepository.findOneBy({ id });
    if (!owner) {
      throw new Error(`Owner with ID ${id} not found`);
    }
    const updateOwner: Owner = {
      ...owner,
      ...input,
      remark:
        typeof input.remark === 'string' ? input.remark : owner.remark ?? '',
    };

    await this.ownerRepository.save(updateOwner);

    return plainToClass(OwnerOutput, updateOwner, {
      excludeExtraneousValues: true,
    });
  }

  async remove(id: number): Promise<void> {
    await this.ownerRepository.delete(id);
  }

  async exportToExcel(): Promise<{ buffer: Buffer; fileInfo: FileOutput }> {
    const owners = await this.ownerRepository.find();
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('业主信息');

    // 添加表头
    worksheet.addRow(['姓名', '电话', '房号', '身份证号', '备注']);

    // 添加数据
    owners.forEach((owner) => {
      worksheet.addRow([
        owner.name,
        owner.phone,
        owner.houseNumber,
        owner.idNumber,
        owner.remark,
      ]);
    });

    // 生成Excel文件的buffer
    const buffer = await workbook.xlsx.writeBuffer() as Buffer;
    
    // 创建临时文件路径和名称
    const filename = `业主信息导出_${new Date().getTime()}.xlsx`;
    const tempFilePath = `${this.fileService.getUploadDir()}/${filename}`;
    
    // 将buffer写入临时文件
    const fs = require('fs');
    fs.writeFileSync(tempFilePath, buffer);
    
    // 创建文件记录
    const fileInfo = await this.fileService.uploadFile(
      {
        filename,
        originalname: filename,
        mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        size: buffer.length,
        path: tempFilePath,
        buffer
      } as Express.Multer.File,
      '业主信息导出Excel文件',
      undefined,
      'owner-excel'
    );
    
    return { buffer, fileInfo };
  }
}
