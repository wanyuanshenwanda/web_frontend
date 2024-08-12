<template>
  <div>
    <Dialog
      :Show="dialogConfig.show"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      width="400px"
      :showCancel="false"
      @close="closeDialog"
    >
      <el-form
        :model="formData"
        :rules="rules"
        ref="formDataRef"
        class="login-register"
      >
        <!--input输入-->
        <el-form-item prop="email" required>
          <el-input
            size="large"
            clearable
            placeholder="请输入邮箱"
            v-model="formData.email"
            maxLength="100"
          >
            <template #prefix>
              <span class="iconfont icon-account"></span> </template
          ></el-input>
        </el-form-item>
        <!-- 登录密码 -->
        <el-form-item prop="password" required v-if="opType === 1">
          <el-input
            size="large"
            @keyup.enter="doSubmit"
            placeholder="请输入密码"
            v-model="formData.password"
            show-password
          >
            <template #prefix>
              <span class="iconfont icon-password"></span>
            </template>
          </el-input>
        </el-form-item>
        <!-- 注册 -->
        <div v-if="opType === 0 || opType === 2">
          <el-form-item prop="nickName" v-if="opType === 0">
            <el-input
              size="large"
              clearable
              placeholder="请输入昵称"
              v-model="formData.nickName"
              maxLength="20"
            >
              <template #prefix>
                <span class="iconfont icon-account"></span> </template
            ></el-input>
          </el-form-item>
          <el-form-item prop="registerPassword" required>
            <el-input
              size="large"
              placeholder="请输入密码"
              v-model="formData.registerPassword"
              show-password
            >
              <template #prefix>
                <span class="iconfont icon-password"></span>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="reRegisterPassword" required>
            <el-input
              size="large"
              placeholder="请再次输入密码"
              v-model="formData.reRegisterPassword"
              show-password
            >
              <template #prefix>
                <span class="iconfont icon-password"></span> </template
            ></el-input>
          </el-form-item>
        </div>
        <el-form-item>
          <div class="remember-me-panel">
            <el-checkbox v-model="formData.rememberMe" v-if="opType === 1"
              >记住我</el-checkbox
            >
          </div>
          <div class="no-account">
            <a
              href="javascript:void(0)"
              class="a-link"
              @click="showPanel(0)"
              v-if="opType === 1"
              >没有账号?</a
            >
            <a
              href="javascript:void(0)"
              class="a-link"
              @click="showPanel(1)"
              v-if="opType === 0"
              >已有帐号</a
            >
            <a
              href="javascript:void(0)"
              class="a-link"
              @click="showPanel(1)"
              v-if="opType === 2"
              >去登录</a
            >
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="op-btn" @click="doSubmit"
            ><span v-if="opType === 0">注册</span
            ><span v-if="opType === 1">登录</span
            ></el-button
          >
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import md5 from "js-md5";
const { proxy } = getCurrentInstance();
const router = useRouter();
const store = useStore();
const api = {
  register: "/register",
  login: "/login",
};
//0:注册 1：登录 
const opType = ref();
const showPanel = (type) => {
  opType.value = type;
  resetForm();
};


//登录，注册，弹窗配置
const dialogConfig = reactive({
  show: false,
  title: "登录",
  buttons: [],
});

const checkRePassword = (rule, value, callback) => {
  if (value !== formData.value.registerPassword) {
    callback(new Error(rule.message));
  } else {
    callback();
  }
};
const formData = ref({});
const formDataRef = ref();
const rules = reactive({
  email: [
    { required: true, message: "请输入邮箱" },
    { validator: proxy.Verify.email, message: "请输入正确的邮箱" },
  ],
  password: [{ required: true, message: "请输入密码" }],
  nickName: [{ required: true, message: "请输入昵称" }],
  registerPassword: [
    { required: true, message: "请输入密码" },
    {
      validator: proxy.Verify.password,
      message: "密码只能是数字，字母，特殊字符 8-18位",
    },
  ],
  reRegisterPassword: [
    { required: true, message: "请再次输入密码" },
    {
      validator: checkRePassword,
      message: "两次输入的密码不一致",
    },
  ],
});

//密码显示隐藏
const passwordEyeType = reactive({
  passwordEyeOpen: false,
  RegisterPasswordEyeOpen: false,
  reRegisterPasswordEyeOpen: false,
});
const eyeChange = (type) => {
  passwordEyeType[type] = !passwordEyeType[type];
};
//重置表单
const resetForm = () => {
  dialogConfig.show = true;
  if (opType.value === 0) {
    dialogConfig.title = "注册";
  } else if (opType.value === 1) {
    dialogConfig.title = "登录";
  } 
  nextTick(() => {
    formDataRef.value.resetFields();
    formData.value = {};
    if (opType.value === 1) {
      const cookieLoginInfo = proxy.VueCookies.get("loginInfo");
      if (cookieLoginInfo) {
        formData.value = cookieLoginInfo;
      }
    }
  });
};
//登录、注册、重置密码 提交表单
const doSubmit = () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    let params = {};
    Object.assign(params, formData.value);

    //注册
    if (opType.value == 0 ) {
      params.password = params.registerPassword;
      delete params.registerPassword;
      delete params.reRegisterPassword;
    }

    //登录
    if (opType.value == 1) {
      let cookieLoginInfo = proxy.VueCookies.get("loginInfo");
      let cookiePassword =
        cookieLoginInfo == null ? null : cookieLoginInfo.password;
      if (params.password !== cookiePassword) {
        params.password = md5(params.password);
      }
    }
    let url = null;
    if (opType.value == 0) {
      url = api.register;
    } else if (opType.value == 1) {
      url = api.login;
    } 
    let result = await proxy.Request({
      url: url,
      params: params,
      errorCallback: () => {
        proxy.Message.error(opType.value==1?"账号或密码错误":"注册失败");
      },
    });

    if (!result) {
      return;
    }

    if (opType.value == 0) {
      proxy.Message.success("注册成功，请返回登录窗口登录");
      showPanel(1);
    }
    //登录
    else if (opType.value == 1) {
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
      store.commit("updateLoginUserInfo", result.data);
    }
  });
};

const closeDialog=()=>{
  dialogConfig.show = false
  store.commit("showLogin",false)
}
defineExpose({ showPanel });
</script>

<style lang="scss" scoped>
.login-register {
  .send-email-panel {
    display: flex;
    width: 100%;
    .send-mail-btn {
      margin-left: 5px;
    }
  }
  .check-code-panel {
    display: flex;
    .check-code {
      margin-left: 5px;
      cursor: pointer;
    }
  }
  .remember-me-panel {
    width: 100%;
  }
  .no-account {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .op-btn {
    width: 100%;
  }
}
</style>