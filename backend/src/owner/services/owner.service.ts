import { Injectable, UploadedFile, UseInterceptors } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as ExcelJS from 'exceljs';
import { Owner } from '../entities/owner.entity';
import { OwnerExcelDto } from '../dtos/owner-excel.dto';
import { plainToClass } from 'class-transformer';
import { OwnerOutput } from '../dtos/owner-output.dto';
import { OwnerInput } from '../dtos/owner-update-input.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { RequestContext } from 'src/shared/request-context/request-context.dto';

@Injectable()
export class OwnerService {
  constructor(
    @InjectRepository(Owner)
    private ownerRepository: Repository<Owner>,
  ) {}

  @UseInterceptors(FileInterceptor('file'))
  async importFromExcel(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Owner[]> {
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

  async exportToExcel(): Promise<Buffer> {
    const owners = await this.ownerRepository.find();
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Owners');

    // Add headers
    worksheet.addRow(['姓名', '电话', '房号', '身份证号', '备注']);

    // Add data
    owners.forEach((owner) => {
      worksheet.addRow([
        owner.name,
        owner.phone,
        owner.houseNumber,
        owner.idNumber,
        owner.remark,
      ]);
    });

    return (await workbook.xlsx.writeBuffer()) as Buffer;
  }
}
