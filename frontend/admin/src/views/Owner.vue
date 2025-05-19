<script setup>
import { ref, h, onMounted } from "vue";
import {
  NButton,
  NDataTable,
  NModal,
  NUpload,
  NUploadDragger,
  NSpace,
  NForm,
  NFormItem,
  NInput,
  useMessage,
  useDialog,
} from "naive-ui";
import { CloudUploadOutlined } from "@vicons/antd";
import { ownerApi } from "@/api/owner";

const columns = [
  { title: "姓名", key: "name" },
  { title: "房号", key: "roomNumber" },
  { title: "联系方式", key: "phone" },
  {
    title: "操作",
    key: "actions",
    render(row) {
      return h(NSpace, null, {
        default: () => [
          h(NButton, { size: "small", onClick: () => handleEdit(row) }, "编辑"),
          h(
            NButton,
            { size: "small", type: "error", onClick: () => handleDelete(row) },
            "删除"
          ),
        ],
      });
    },
  },
];

const data = ref([]);
const showModal = ref(false);
const showImportModal = ref(false);
const form = ref({ name: "", roomNumber: "", phone: "" });
const formRef = ref(null);
const message = useMessage();
const dialog = useDialog();

const rules = {
  name: { required: true, message: "请输入姓名", trigger: "blur" },
  roomNumber: { required: true, message: "请输入房号", trigger: "blur" },
  phone: { required: true, message: "请输入联系方式", trigger: "blur" },
};

const fetchOwners = async () => {
  const { data } = await ownerApi.list();
  data.forEach((item) => {
    item.key = item.id;
  });
  data.value = data;
};
const createOwner = async (owner) => {
  await ownerApi.create(owner);
};

const handleAdd = () => {
  form.value = { name: "", roomNumber: "", phone: "" };
  showModal.value = true;
};

const handleSubmit = async () => {
  try {
    await formRef.value?.validate();
    if (form.value.id) {
      await ownerApi.create(form.value);
      message.success("更新成功");
    } else {
      await createOwner(form.value);
      message.success("添加成功");
    }
    showModal.value = false;
    fetchOwners();
  } catch (error) {
    if (error.errors) {
      message.error("请填写完整信息");
    } else {
      message.error("操作失败");
    }
  }
};

const handleEdit = (row) => {
  showModal.value = true;
  form.value = { ...row };
};

const handleDelete = (row) => {
  dialog.warning({
    title: "确认删除",
    content: `确定要删除业主 ${row.name} 吗？`,
    positiveText: "确定",
    negativeText: "取消",
    onPositiveClick: async () => {
      try {
        await deleteOwner(row.id);
        message.success("删除成功");
        fetchOwners();
      } catch (error) {
        message.error("删除失败");
      }
    },
  });
};

const handleImport = () => {
  showImportModal.value = true;
};

onMounted(() => {
  fetchOwners();
});
</script>

<template>
  <div class="owner-container">
    <n-page-header title="业主管理">
      <template #subtitle>全体业主成员信息</template>
    </n-page-header>

    <n-card title="业主列表" class="owner-card">
      <template #header-extra>
        <n-button type="primary" @click="handleAdd">添加业主</n-button>
        <n-button type="info" @click="handleImport" style="margin-left: 12px"
          >批量导入</n-button
        >
      </template>

      <n-data-table :columns="columns" :data="data" />

      <n-modal
        v-model:show="showModal"
        :title="form.id ? '编辑业主' : '添加业主'"
      >
        <n-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-placement="left"
          label-width="auto"
          require-mark-placement="right-hanging"
        >
          <n-form-item label="姓名" path="name">
            <n-input v-model:value="form.name" placeholder="请输入姓名" />
          </n-form-item>
          <n-form-item label="房号" path="roomNumber">
            <n-input v-model:value="form.roomNumber" placeholder="请输入房号" />
          </n-form-item>
          <n-form-item label="联系方式" path="phone">
            <n-input v-model:value="form.phone" placeholder="请输入联系方式" />
          </n-form-item>
          <n-form-item>
            <n-space>
              <n-button type="primary" @click="handleSubmit">提交</n-button>
              <n-button @click="showModal = false">取消</n-button>
            </n-space>
          </n-form-item>
        </n-form>
      </n-modal>

      <n-modal
        :style="{ width: '600px' }"
        v-model:show="showImportModal"
        title="批量导入业主"
      >
        <n-upload action="">
          <n-upload-dragger>
            <div style="margin-bottom: 12px">
              <n-icon size="48" :depth="3">
                <CloudUploadOutlined />
              </n-icon>
            </div>
            <n-text style="font-size: 16px"> 点击或拖拽文件到此处上传 </n-text>
          </n-upload-dragger>
        </n-upload>
      </n-modal>
    </n-card>
  </div>
</template>

<style scoped>
.owner-container {
  padding: 16px;
}

.owner-card {
  margin-top: 24px;
}
</style>
