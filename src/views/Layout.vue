<template>
  <div class="header" v-if="showHeader">
    <div
      class="header-content"
      :style="{ width: proxy.globalInfo.bodyWidth } + 'px'"
    >
      <router-link to="/" class="logo">
        <span
          v-for="item in logoInfo"
          :key="item.letter"
          :style="{ color: item.color }"
        >
          {{ item.letter }}</span
        >
      </router-link>
      <div class="menu-panel"></div>
      <div class="user-info-panel">
        <div class="op-btn">
          <el-button type="primary" class="op-btn"
            >发帖
            <span class="iconfont icon-add"></span>
          </el-button>
          <el-button type="primary" class="op-btn"
            >搜索
            <span class="iconfont icon-search"></span>
          </el-button>
        </div>
        <div v-if="userInfo.userId">
          <div class="message-info">
            <el-dropdown>
              <el-badge :value="12" class="item">
                <div class="iconfont icon-message"></div>
              </el-badge>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>回复我的</el-dropdown-item>
                  <el-dropdown-item>赞了我的帖子</el-dropdown-item>
                  <el-dropdown-item>系统消息</el-dropdown-item>
                  <el-dropdown-item>赞了我的评论</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          <div class="user-info">
            <el-dropdown>
              <avatar></avatar>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>我的主页</el-dropdown-item>
                  <el-dropdown-item>退出</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>

        <el-button-group :style="{ 'margin-left': '10px' }" v-else>
          <el-button type="primary" plain @click="loginAndRegister(1)"
            >登录</el-button
          >
          <el-button type="primary" plain @click="loginAndRegister(0)"
            >注册</el-button
          >
        </el-button-group>
      </div>
    </div>
    <LoginAndRegister ref="loginRegisterRef"></LoginAndRegister>
  </div>
</template>

<script setup>
import LoginAndRegister from "./LoginAndRegister.vue";
import { ref, reactive, getCurrentInstance, nextTick, onMounted,watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const store = useStore();

const api = {
  getUserInfo: "/getUserInfo",
};

const logoInfo = ref([
  { letter: "P", color: "#3285FF" },
  { letter: "o", color: "#FB3624" },
  { letter: "s", color: "#FFBA02" },
  { letter: "t", color: "#3285FF" },
  { letter: "b", color: "#25B24E" },
  { letter: "a", color: "#FD3224" },
  { letter: "r", color: "#FFBA02" },
]);



const getScrollTop = () => {
  let scrollTop =
    document.documentElement.scrollTop ||
    window.pageYOffset ||
    document.body.scrollTop;
  return scrollTop;
};
const showHeader = ref(true);
const initScroll = () => {
  let initScrollTop = getScrollTop();
  let scrollType = "down";
  window.addEventListener("scroll", () => {
    let currentScrollTop = getScrollTop();
    scrollType = currentScrollTop > initScrollTop ? "down" : "up";
    initScrollTop = currentScrollTop;
    if (scrollType === "down" && currentScrollTop > 100)
      showHeader.value = false;
    else showHeader.value = true;
  });
};

const loginRegisterRef = ref(null);
const loginAndRegister = (type) => {
  loginRegisterRef.value.showPanel(type);
};

onMounted(() => {
  initScroll();
  getUserInfo();
});

const getUserInfo = async () => {
  let result = await proxy.Request({
    url: api.getUserInfo,
  });
  if (!result) {
    return;
  }
  store.commit("updateLoginUserInfo", result.data);
};

const userInfo = ref({});
watch(
  () => store.state.loginUserInfo,
  (newVal, oldVal) => {
    userInfo.value = newVal == null || newVal == undefined ? {} : newVal;
  },
  { immediate: true, deep: true }
);
</script>

<style lang="scss">
.header {
  top: 0;
  z-index: 1000;
  width: 100%;
  position: fixed;
  height: 60px;
  box-shadow: 0 6px 6px 0 #ddd;
  .header-content {
    margin: 0px auto;
    align-items: center;
    height: 60px;
    display: flex;
    .logo {
      display: block;
      margin-right: 5px;
      margin-left: 50px;
      text-decoration: none;
      font-size: 30px;
      font-weight: bold;
    }
    .menu-panel {
      flex: 1;
    }
    .user-info-panel {
      width: 400px;
      display: flex;
      align-items: center;
      .op-btn {
        display: flex;
        align-items: center;
        .el-button {
          display: inline-block;
          margin-left: 5px;
        }
        .iconfont {
          margin-left: 5px;
        }
      }
      .message-info {
        margin-left: 5px;
        margin-right: 25px;
        cursor: pointer;
        .icon-message {
          font-size: 25px;
          color: rgb(147, 147, 147);
        }
      }
      .user-info {
        margin-left: 10px;
      }
      .el-button-group {
        display: flex;
        align-items: center;
        margin-left: 10px;
        .el-button {
          display: inline-block;
          margin-left: 5px;
        }
      }
    }
  }
}
</style>
