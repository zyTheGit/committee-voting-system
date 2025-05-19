<script setup>
import { ref,  } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/user";
import { renderIcon } from "@/utils";
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  SolutionOutlined,
  SettingOutlined,
  MenuOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
} from "@vicons/antd";

const router = useRouter();
const userStore = useUserStore();

const collapsed = ref(false);

const menuOptions = [
  {
    label: "仪表盘",
    key: "dashboard",
    icon: renderIcon(DashboardOutlined),
    path: "/",
  },
  {
    label: "委员管理",
    key: "members",
    icon: renderIcon(UserOutlined),
    path: "/members",
  },
  {
    label: "投票管理",
    key: "votes",
    icon: renderIcon(SolutionOutlined),
    path: "/votes",
  },
  {
    label: "业主管理",
    key: "owner",
    icon: renderIcon(SolutionOutlined),
    path: "/owner",
  },
  {
    label: "系统设置",
    key: "settings",
    icon: renderIcon(SettingOutlined),
    path: "/settings",
  },
];

const handleMenuClick = (key) => {
  const menuItem = menuOptions.find((item) => item.key === key);
  if (menuItem) {
    router.push(menuItem.path);
  }
};

const handleLogout = async () => {
  try {
    await userStore.logout();
    router.push("/login");
  } catch (error) {
    console.error("登出失败", error);
  }
};
</script>

<template>
  <n-layout class="layout" has-sider>
    <!-- 侧边栏 -->
    <n-layout-sider
      bordered
      collapse-mode="width"
      :collapsed-width="64"
      :width="280"
      :collapsed="collapsed"
      show-trigger
      @collapse="collapsed = true"
      @expand="collapsed = false"
      class="layout-sider"
    >
      <div class="logo-container">
        <h2 v-if="!collapsed">投票管理系统</h2>
        <h2 v-else>CVS</h2>
      </div>

      <n-menu
        :collapsed="collapsed"
        :collapsed-width="64"
        :collapsed-icon-size="22"
        :options="menuOptions"
        @update:value="handleMenuClick"
      />
    </n-layout-sider>

    <n-layout>
      <!-- 顶部导航 -->
      <n-layout-header bordered class="layout-header">
        <div class="header-container">
          <div class="header-left">
            <n-button quaternary circle @click="collapsed = !collapsed">
              <template #icon>
                <n-icon>
                  <MenuOutlined v-if="!collapsed" />
                  <MenuUnfoldOutlined v-else />
                </n-icon>
              </template>
            </n-button>
            <h3 class="header-title">管理控制台</h3>
          </div>

          <div class="header-right">
            <n-space>
              <n-badge dot>
                <n-button quaternary circle>
                  <template #icon>
                    <n-icon><BellOutlined /></n-icon>
                  </template>
                </n-button>
              </n-badge>
              <n-dropdown
                :options="[
                  { label: '个人设置', key: 'settings' },
                  { label: '退出登录', key: 'logout' },
                ]"
                @select="handleLogout"
              >
                <n-space align="center">
                  <n-avatar round size="small">
                    {{
                      userStore.userInfo?.username?.charAt(0)?.toUpperCase() ||
                      "U"
                    }}
                  </n-avatar>
                  <span class="username">{{
                    userStore.userInfo?.username || "管理员"
                  }}</span>
                </n-space>
              </n-dropdown>
            </n-space>
          </div>
        </div>
      </n-layout-header>

      <!-- 内容区域 -->
      <n-layout-content class="layout-content">
        <div class="content-container">
          <router-view />
        </div>
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<style scoped>
.layout {
  height: 100vh;
  background-color: #f5f7fa;
}

.layout-sider {
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  z-index: 999;
}

.logo-container {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #f0f0f0;
  background-color: #fff;
}

.logo-container h2 {
  color: #1890ff;
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

.layout-header {
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 998;
}

.header-container {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
}

.header-left,
.header-right {
  display: flex;
  align-items: center;
}

.header-title {
  margin: 0 0 0 12px;
  font-size: 16px;
  font-weight: 500;
  color: #1f2329;
}

.username {
  font-size: 14px;
  color: #1f2329;
}

.layout-content {
  padding: 24px;
  overflow: auto;
}

.content-container {
  background-color: #fff;
  border-radius: 4px;
  padding: 24px;
  min-height: calc(100vh - 112px);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

@media (min-width: 1200px) {
  .content-container {
    max-width: 1400px;
    margin: 0 auto;
  }
}
</style>
