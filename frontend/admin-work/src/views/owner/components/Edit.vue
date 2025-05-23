<template>
  <n-modal v-model:show="showModal" :show-icon="false" preset="dialog" :title="title">
    <n-form
      :model="formParams"
      :rules="rules"
      ref="formRef"
      label-placement="left"
      :label-width="80"
      class="py-4"
    >
      <n-form-item label="姓名" path="name">
        <n-input placeholder="请输入姓名" v-model:value="formParams.name" />
      </n-form-item>
      <n-form-item label="手机号" path="phone">
        <n-input type="text" placeholder="请输入地址" v-model:value="formParams.phone" />
      </n-form-item>
      <n-form-item label="房号" path="houseNumber">
        <n-input type="text" placeholder="请输入房号" v-model:value="formParams.houseNumber" />
      </n-form-item>
      <n-form-item label="身份证" path="idNumber">
        <n-input type="text" placeholder="请输入身份证" v-model:value="formParams.idNumber" />
      </n-form-item>
      <n-form-item label="备注" path="remark">
        <n-input type="textarea" placeholder="请输入备注" v-model:value="formParams.remark" />
      </n-form-item>
    </n-form>

    <template #action>
      <n-space>
        <n-button @click="cancel">取消</n-button>
        <n-button type="info" :loading="formBtnLoading" @click="confirmForm">确定</n-button>
      </n-space>
    </template>
  </n-modal>
</template>
<script setup lang="ts">
  import { computed, reactive, ref } from 'vue';
  import { ownerApi } from '@/api/owner/list';

  import { type FormRules } from 'naive-ui';

  const formRef: any = ref(null);
  const showModal = ref(false);
  const formBtnLoading = ref(false);
  const rules: FormRules = {
    name: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入姓名',
    },
    phone: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入手机号',
    },
    houseNumber: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入房号',
    },
    idNumber: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入身份证号',
    },
    remark: {
      trigger: ['blur', 'input'],
      message: '请输入备注',
    },
  };
  const title = computed(() => {
    return formParams.id ? '编辑' : '新建';
  });
  const formParams = reactive({
    id: '',
    name: '',
    phone: '',
    houseNumber: '',
    idNumber: '',
    remark: '',
  });

  const emit = defineEmits(['reload']);

  const show = (params) => {
    showModal.value = true;
    Object.assign(formParams, params);
  };
  const cancel = () => {
    showModal.value = false;
    setTimeout(() => {
      Object.assign(formParams, {
        id: '',
        name: '',
        phone: '',
        houseNumber: '',
        idNumber: '',
        remark: '',
      });
    }, 16);
  };

  const confirmForm = (e) => {
    e.preventDefault();
    formBtnLoading.value = true;
    formRef.value.validate((errors) => {
      if (!errors) {
        ownerApi[formParams.id ? 'update' : 'create'](formParams).then((res) => {
          if (res.code !== 200) {
            return;
          }
          emit('reload');
          window['$message'].success('操作成功');
          cancel();
        });
      } else {
        window['$message'].error('请填写完整信息');
      }
      formBtnLoading.value = false;
    });
  };

  defineExpose({
    show,
  });
</script>
