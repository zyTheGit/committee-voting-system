<template>
  <n-form
    :model="model"
    :rules="rules"
    :label-width="labelWidth"
    :size="size"
    :inline="inline"
    v-bind="$attrs"
  >
    <template v-for="(item, idx) in items" :key="item.key">
      <n-form-item
        :label="item.label"
        :path="item.key"
        v-bind="item.formItemProps"
      >
        <component
          :is="item.component"
          v-model="model[item.key]"
          v-bind="item.componentProps"
        >
          <template v-for="(slotFn, name) in $slots" #[name]="slotProps">
            <slot :name="name" v-bind="slotProps" />
          </template>
        </component>
      </n-form-item>
    </template>
    <slot />
  </n-form>
</template>

<script setup>
import { NForm, NFormItem } from 'naive-ui'
import { toRefs } from 'vue'
const props = defineProps({
  model: {
    type: Object,
    required: true
  },
  rules: {
    type: Object,
    default: () => ({})
  },
  items: {
    type: Array,
    required: true
  },
  labelWidth: {
    type: [Number, String],
    default: 120
  },
  size: {
    type: String,
    default: 'medium'
  },
  inline: {
    type: Boolean,
    default: false
  }
})
</script>