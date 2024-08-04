<template>
  <div class="login-regiser">
    <Dialog
      :show="dialogConfig.show"
      :title="dialogConfig.title"
      width="400px"
      :show-cancel="false"
      @close="dialogConfig.show = false"
    >
      <el-form :model="formData" :rules="rules" ref="formDataRef">
        <el-form-item prop="email">
          <el-input
            size="large"
            clearable
            placeholder="请输入邮箱"
            v-model.trim="formData.email"
          >
            <template #prefix>
              <span class="iconfont icon-account"></span>
            </template>
          </el-input>
        </el-form-item>

        <!-- 登录 -->
        <div v-if="onType == 1">
          <el-form-item prop="password">
            <el-input
              size="large"
              :type="passwordEyeType.passwordEyeOpen ? 'text' : 'password'"
              placeholder="请输入密码"
              v-model.trim="formData.password"
            >
              <template #prefix>
                <span class="iconfont icon-password"></span>
              </template>
              <template #suffix>
                <span
                  @click="eyeChange('0')"
                  :class="[
                    'iconfont',
                    passwordEyeType.passwordEyeOpen ? 'icon-eye' : 'icon-close-eye',
                  ]"
                ></span>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <div class="rememberme-panel">
              <el-checkbox v-model="formData.remember">记住我</el-checkbox>
            </div>
            <div class="no-account">
              <a href="javascript:void(0)" class="a-link" @click="showPanel(0)">没有账号?</a>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="op-btn" @click="doSubmit">登录</el-button>
          </el-form-item>
        </div>

        <!-- 注册 -->
        <div v-if="onType == 0">
          <el-form-item prop="nickName">
            <el-input
              size="large"
              clearable
              placeholder="请输入昵称"
              v-model.trim="formData.nickName"
            >
              <template #prefix>
                <span class="iconfont icon-account"></span>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="registerPassword">
            <el-input
              size="large"
              :type="passwordEyeType.registerPasswordEyeOpen ? 'text' : 'password'"
              placeholder="请输入密码"
              v-model.trim="formData.registerPassword"
            >
              <template #prefix>
                <span class="iconfont icon-password"></span>
              </template>
              <template #suffix>
                <span
                  @click="eyeChange('1')"
                  :class="[
                    'iconfont',
                    passwordEyeType.registerPasswordEyeOpen ? 'icon-eye' : 'icon-close-eye',
                  ]"
                ></span>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="rePassword">
            <el-input
              size="large"
              :type="passwordEyeType.rePasswordEyeOpen ? 'text' : 'password'"
              placeholder="请再次输入密码"
              v-model.trim="formData.rePassword"
            >
              <template #prefix>
                <span class="iconfont icon-password"></span>
              </template>
              <template #suffix>
                <span
                  @click="eyeChange('2')"
                  :class="[
                    'iconfont',
                    passwordEyeType.rePasswordEyeOpen ? 'icon-eye' : 'icon-close-eye',
                  ]"
                ></span>
              </template>
            </el-input>
          </el-form-item>
          <div class="no-account">
            <a href="javascript:void(0)" class="a-link" @click="showPanel(1)">已有账号?</a>
          </div>
          <el-form-item>
            <el-button type="primary" class="op-btn" @click="doSubmit">注册</el-button>
          </el-form-item>
        </div>
      </el-form>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
import md5 from "js-md5";
import Dialog from "@/components/Dialog.vue";

const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();

const api = {
  login: "/login",
  register: "/register",
};

const onType = ref();

const showPanel = (type) => {
  onType.value = type;
  resetForm();
  passwordEyeType.rePasswordEyeOpen = false;
};

defineExpose({ showPanel });

const dialogConfig = reactive({
  show: false,
  title: "标题",
});

const formData = ref({});
const formDataRef = ref();
const rules = {
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    { validator: proxy.Verify.email, message: "请输入正确的邮箱地址", trigger: "blur" },
    { max: 50, message: "邮箱太长", trigger: "blur" },
  ],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  nickName: [
    { required: true, message: "请输入昵称", trigger: "blur" },
    { max: 20, message: "昵称太长", trigger: "blur" },
  ],
  registerPassword: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { validator: proxy.Verify.password, message: "密码只能是数字,字母,特殊字符,8到18位", trigger: "blur" },
  ],
  rePassword: [
    { required: true, message: "请再次输入密码", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        if (value !== formData.registerPassword) {
          callback(new Error("两次输入密码不一致"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
};

const passwordEyeType = reactive({
  passwordEyeOpen: false,
  rePasswordEyeOpen: false,
  registerPasswordEyeOpen: false,
});

const eyeChange = (type) => {
  switch (type) {
    case "0":
      passwordEyeType.passwordEyeOpen = !passwordEyeType.passwordEyeOpen;
      break;
    case "1":
      passwordEyeType.registerPasswordEyeOpen = !passwordEyeType.registerPasswordEyeOpen;
      break;
    case "2":
      passwordEyeType.rePasswordEyeOpen = !passwordEyeType.rePasswordEyeOpen;
      break;
  }
};

const resetForm = () => {
  dialogConfig.show = true;
  dialogConfig.title = onType.value === 0 ? "注册" : "登录";
  nextTick(() => {
    formDataRef.value.resetFields();
    formData.value = {};

    if (onType.value === 1) {
      const cookieLoginInfo = proxy.VueCookies.get("loginInfo");
      if (cookieLoginInfo) {
        formData.value = cookieLoginInfo;
      }
    }
  });
};

const doSubmit = () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) return;
    let params = { ...formData.value };
    let url = null;
    let result = null;

    if (onType.value === 0) {
      params.password = params.registerPassword;
      url = api.register;
      result = await proxy.Request({ url, params });
      if (!result) return;
      proxy.Message.success("注册成功,请登录");
      showPanel(1);
    } else if (onType.value === 1) {
      url = api.login;
      const cookieLoginInfo = proxy.VueCookies.get("loginInfo");
      const cookiePassword = cookieLoginInfo ? cookieLoginInfo.password : null;
      if (params.password !== cookiePassword) {
        params.password = md5(params.password);
      }
      if (params.rememberMe) {
        const loginInfo = {
          email: params.email,
          password: params.password,
          rememberMe: params.rememberMe,
        };
        proxy.VueCookies.set("loginInfo", loginInfo, "7d");
      } else {
        proxy.VueCookies.remove("loginInfo");
      }
      dialogConfig.show = false;
      proxy.Message.success("登录成功");
    }
  });
};
</script>

<style lang="scss" scoped>
.login-regiser {
  .rememberme-panel {
    width: 100%;
  }
  .no-account {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .op-btn {
    width: 100%;
    display: flex;
    justify-content: center;
  }
}
</style>