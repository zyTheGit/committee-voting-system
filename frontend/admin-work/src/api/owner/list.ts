import { Alova } from '@/utils/http/alova/index';

export const ownerApi = {
  pages: (params) => Alova.Get('/owners', { params }),
  create: (data) => Alova.Post('/owners', data),
  update: (data) => Alova.Patch(`/owners/${data.id}`, data),
  delete: (id) => Alova.Delete(`/owners/${id}`),
};
