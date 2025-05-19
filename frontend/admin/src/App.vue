<script setup>
import {
  NMessageProvider,
  NDialogProvider,
  NNotificationProvider,
} from "naive-ui";
import { IconConfigProvider } from '@vicons/utils'  // vue3
</script>

<template>
  <IconConfigProvider color="green" size="24">
    <n-message-provider>
      <n-dialog-provider>
        <n-notification-provider>
          <router-view />
        </n-notification-provider>
      </n-dialog-provider>
    </n-message-provider>
  </IconConfigProvider>
</template>

<style>
#app {
  width: 100%;
  height: 100%;
}
</style>
