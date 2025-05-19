import { PaginationParamsDto } from '../dtos/pagination-params.dto';

/**
 * 分页响应接口 - 格式一
 * 用于返回 {data: T, code: number, message: string} 格式的响应
 */
export interface StandardResponse<T> {
  data: T;
  code: number;
  message: string;
}

/**
 * 分页元数据接口
 */
export interface PaginationMeta {
  total: number;
  page?: number;
  limit?: number;
  [key: string]: any;
}

/**
 * 分页响应接口 - 格式二
 * 用于返回 {records: T[], code: number, message: string, meta: {total: number}} 格式的响应
 */
export interface PaginatedResponse<T> {
  records: T[];
  code: number;
  message: string;
  meta: PaginationMeta;
}

/**
 * 分页工具类
 * 提供统一的分页参数处理和响应格式化功能
 */
export class PaginationUtil {
  /**
   * 处理分页参数
   * @param params 分页参数
   * @returns 处理后的分页参数 {limit, offset, page}
   */
  static getPaginationParams(params: PaginationParamsDto): {
    limit: number;
    offset: number;
    page: number;
  } {
    const limit = params.limit || 10;
    const offset = params.offset || 0;
    const page = Math.floor(offset / limit) + 1;

    return { limit, offset, page };
  }

  /**
   * 创建标准响应 - 格式一
   * @param data 响应数据
   * @param code 状态码
   * @param message 响应消息
   * @returns 标准响应对象
   */
  static createResponse<T>(
    data: T,
    code = 200,
    message = '操作成功',
  ): StandardResponse<T> {
    return {
      data,
      code,
      message,
    };
  }

  /**
   * 创建分页响应 - 格式二
   * @param records 记录列表
   * @param total 总记录数
   * @param params 分页参数
   * @param code 状态码
   * @param message 响应消息
   * @returns 分页响应对象
   */
  static createPaginatedResponse<T>(
    records: T[],
    total: number,
    params?: PaginationParamsDto,
    code = 200,
    message = '操作成功',
  ): PaginatedResponse<T> {
    const meta: PaginationMeta = { total };
    
    if (params) {
      const { limit, page } = this.getPaginationParams(params);
      meta.limit = limit;
      meta.page = page;
    }

    return {
      records,
      code,
      message,
      meta,
    };
  }
}