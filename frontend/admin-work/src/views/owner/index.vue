<template>
  <n-card :bordered="false">
    <BasicForm @register="register" @submit="handleSubmit" @reset="handleReset">
      <template #statusSlot="{ model, field }">
        <n-input v-model:value="model[field]" />
      </template>
    </BasicForm>
  </n-card>
  <n-card :bordered="false" class="mt-3">
    <BasicTable
      :columns="columns"
      :request="loadDataTable"
      :row-key="(row:ListData) => row.id"
      ref="actionRef"
      :actionColumn="actionColumn"
      @update:checked-row-keys="onCheckedRow"
      :scroll-x="1090"
      :striped="true"
    >
      <template #tableTitle>
        <n-space>
          <n-button type="primary" @click="addTable">
            <template #icon>
              <n-icon>
                <PlusOutlined />
              </n-icon>
            </template>
            新建
          </n-button>

          <n-button type="primary" @click="importTable">
            <template #icon>
              <n-icon>
                <PlusOutlined />
              </n-icon>
            </template>
            导入
          </n-button>
        </n-space>
      </template>

      <template #toolbar> </template>
    </BasicTable>

    <Edit ref="formRef" :reload="reloadTable" />
  </n-card>
</template>

<script lang="ts" setup>
  import { h, reactive, ref } from 'vue';
  import { PlusOutlined } from '@vicons/antd';
  import { BasicTable, TableAction } from '@/components/Table';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import Edit from './components/edit.vue';
  import { ownerApi } from '@/api/owner/list';
  import { columns, ListData } from './columns';

  const schemas: FormSchema[] = [
    {
      field: 'name',
      component: 'NInput',
      label: '姓名',
      componentProps: {
        placeholder: '请输入姓名',
        onInput: (e: any) => {
          console.log(e);
        },
      },
      rules: [{ message: '请输入姓名', trigger: ['blur'] }],
    },
    {
      field: 'phone',
      component: 'NInputNumber',
      label: '手机号',
      componentProps: {
        placeholder: '请输入手机号码',
        showButton: false,
        onInput: (e: any) => {
          console.log(e);
        },
      },
    },
  ];

  const formRef: any = ref(null);
  const actionRef = ref();

  const actionColumn = reactive({
    width: 140,
    title: '操作',
    key: 'action',
    fixed: 'right',
    render(record) {
      return h(TableAction as any, {
        style: 'button',
        actions: [
          {
            label: '编辑',
            onClick: handleEdit.bind(null, record),
          },
          {
            label: '删除',
            type: 'error',
            popConfirm: {
              title: '是否删除该数据？',
              okText: '确认',
              confirm: handleDelete.bind(null, record),
            },
            // dashed: true,
          },
        ],
      });
    },
  });

  const [register, { getFieldsValue }] = useForm({
    gridProps: { cols: '1 s:1 m:2 l:3 xl:4 2xl:4' },
    labelWidth: 80,
    schemas,
  });

  function addTable() {
    formRef.value.show();
  }

  function importTable() {
    console.log('导入');
  }

  const loadDataTable = (res) => {
    return ownerApi.pages({ ...getFieldsValue(), ...res });
  };

  function onCheckedRow(rowKeys) {
    console.log(rowKeys);
  }

  function reloadTable(params = {}) {
    actionRef.value.reload(params);
  }

  function handleEdit(record: Recordable) {
    formRef.value.show(record);
  }

  function handleDelete(record: Recordable) {
    ownerApi
      .delete(record.id)
      .then((res) => {
        if (res.code !== 200) {
          return;
        }
        window['$message'].success('删除成功');
        reloadTable();
      })
      .catch((err) => {
        console.log(err);
        window['$message'].error('删除失败');
      });
  }

  function handleSubmit(values: Recordable) {
    reloadTable(values);
  }

  function handleReset(values: Recordable) {
    console.log(values);
  }
</script>

<style lang="less" scoped></style>
