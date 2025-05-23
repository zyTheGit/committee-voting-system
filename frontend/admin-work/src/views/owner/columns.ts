import { BasicColumn } from '@/components/Table';
export interface ListData {
  id: number;
  name: string;
  sex: string;
  avatar: string;
  email: string;
  city: string;
  status: string;
  type: string;
  createDate: string;
}

export const columns: BasicColumn<ListData>[] = [
  {
    title: '姓名',
    key: 'name',
    width: 140,
  },
  {
    title: '手机号',
    key: 'phone',
    width: 140,
  },
  {
    title: '房号',
    key: 'houseNumber',
    width: 180,
  },
  {
    title: '身份证号',
    key: 'idNumber',
    width: 180,
  },
  {
    title: '备注',
    key: 'remark',
    width: 300,
  },
];
