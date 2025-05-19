/**
 * 分页工具类使用示例
 * 本文件展示了如何在控制器中使用PaginationUtil进行分页查询和响应格式化
 */

import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationParamsDto } from '../dtos/pagination-params.dto';
import { PaginationUtil, PaginatedResponse, StandardResponse } from './pagination.util';

// 示例数据接口
interface ExampleItem {
  id: number;
  name: string;
}

/**
 * 示例服务类
 */
class ExampleService {
  // 模拟数据库查询方法
  async findAll(limit: number, offset: number): Promise<{ items: ExampleItem[]; total: number }> {
    // 这里通常是数据库查询，这里仅作示例
    const items: ExampleItem[] = [];
    for (let i = offset; i < offset + limit && i < 100; i++) {
      items.push({ id: i + 1, name: `Item ${i + 1}` });
    }
    return { items, total: 100 };
  }
}

/**
 * 示例控制器 - 展示如何使用PaginationUtil
 */
@ApiTags('示例')
@Controller('examples')
export class ExampleController {
  private exampleService = new ExampleService();

  /**
   * 使用格式一的分页响应 {data: T, code: number, message: string}
   */
  @ApiOperation({ summary: '获取列表(格式一)', description: '使用标准响应格式' })
  @ApiResponse({ status: 200, description: '获取成功' })
  @Get('format1')
  async getListFormat1(
    @Query() query: PaginationParamsDto,
  ): Promise<StandardResponse<ExampleItem[]>> {
    // 1. 处理分页参数
    const { limit, offset } = PaginationUtil.getPaginationParams(query);
    
    // 2. 查询数据
    const { items } = await this.exampleService.findAll(limit, offset);
    
    // 3. 返回格式一的响应
    return PaginationUtil.createResponse(items);
  }

  /**
   * 使用格式二的分页响应 {records: T[], code: number, message: string, meta: {total: number}}
   */
  @ApiOperation({ summary: '获取列表(格式二)', description: '使用带元数据的分页响应格式' })
  @ApiResponse({ status: 200, description: '获取成功' })
  @Get('format2')
  async getListFormat2(
    @Query() query: PaginationParamsDto,
  ): Promise<PaginatedResponse<ExampleItem>> {
    // 1. 处理分页参数
    const { limit, offset } = PaginationUtil.getPaginationParams(query);
    
    // 2. 查询数据
    const { items, total } = await this.exampleService.findAll(limit, offset);
    
    // 3. 返回格式二的响应
    return PaginationUtil.createPaginatedResponse(items, total, query);
  }
}

/**
 * 使用示例 - 在现有控制器中应用
 * 
 * 1. 导入PaginationUtil和相关接口
 * ```typescript
 * import { PaginationParamsDto } from '../shared/dtos/pagination-params.dto';
 * import { PaginationUtil, PaginatedResponse } from '../shared/utils/pagination.util';
 * ```
 * 
 * 2. 在控制器方法中使用
 * ```typescript
 * @Get()
 * async getItems(@Query() query: PaginationParamsDto): Promise<PaginatedResponse<Item>> {
 *   const { limit, offset } = PaginationUtil.getPaginationParams(query);
 *   const { items, total } = await this.itemService.findAll(limit, offset);
 *   return PaginationUtil.createPaginatedResponse(items, total, query);
 * }
 * ```
 */