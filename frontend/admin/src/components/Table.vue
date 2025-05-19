<template>
  <n-data-table
    :columns="columns"
    :data="data"
    :bordered="bordered"
    :single-line="singleLine"
    :pagination="pagination"
    :row-key="rowKey"
    v-bind="$attrs"
  >
    <template v-for="(slotFn, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps" />
    </template>
  </n-data-table>
</template>

<script setup>
import { NDataTable } from 'naive-ui'
import { toRefs } from 'vue'
const props = defineProps({
  columns: {
    type: Array,
    required: true
  },
  data: {
    type: Array,
    required: true
  },
  bordered: {
    type: Boolean,
    default: false
  },
  singleLine: {
    type: Boolean,
    default: false
  },
  pagination: {
    type: [Boolean, Object],
    default: false
  },
  rowKey: {
    type: [String, Function],
    default: 'id'
  }
})
</script>