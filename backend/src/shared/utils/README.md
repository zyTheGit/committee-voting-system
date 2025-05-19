# 分页工具类使用指南

## 简介

本工具类提供了统一的分页查询参数处理和响应格式化功能，旨在标准化后端API的分页查询接口，使项目中所有分页相关的API保持一致的请求和响应格式。

## 功能特点

- 统一处理分页参数（页码、每页数量等）
- 提供两种标准响应格式
  - 格式一：`{data: T, code: number, message: string}`
  - 格式二：`{records: T[], code: number, message: string, meta: {total: number}}`
- 自动计算分页元数据（总数、当前页等）

## 使用方法

### 1. 导入必要的类和接口

```typescript
import { PaginationParamsDto } from '../dtos/pagination-params.dto';
import { PaginationUtil, StandardResponse, PaginatedResponse } from './pagination.util';
```

### 2. 在控制器中使用

#### 处理分页参数

```typescript
// 在控制器方法中
async getItems(@Query() query: PaginationParamsDto) {
  // 处理分页参数
  const { limit, offset, page } = PaginationUtil.getPaginationParams(query);
  
  // 使用处理后的参数进行数据查询
  // ...
}
```

#### 返回格式一响应

```typescript
// 返回标准响应格式
return PaginationUtil.createResponse(data, 200, '获取成功');
```

#### 返回格式二响应（带分页元数据）

```typescript
// 返回带分页元数据的响应格式
return PaginationUtil.createPaginatedResponse(records, total, query, 200, '获取成功');
```

## 完整示例

请参考 `pagination.example.ts` 文件中的示例控制器，展示了如何在实际应用中使用分页工具类。

## 响应格式说明

### 格式一：标准响应

```json
{
  "data": [...],  // 数据内容
  "code": 200,    // 状态码
  "message": "操作成功" // 响应消息
}
```

### 格式二：带分页元数据的响应

```json
{
  "records": [...],  // 数据记录列表
  "code": 200,       // 状态码
  "message": "操作成功", // 响应消息
  "meta": {
    "total": 100,    // 总记录数
    "page": 1,       // 当前页码
    "limit": 10      // 每页记录数
  }
}
```

## 注意事项

- 在使用格式二响应时，请确保传入正确的总记录数（total）
- 分页参数处理会自动将字符串类型的参数转换为数字类型
- 默认的每页记录数为10，起始偏移量为0