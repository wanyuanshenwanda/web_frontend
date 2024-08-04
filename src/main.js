import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import VueCookies from "vue-cookies";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "./assets/base.scss";
import "@/assets/icon/iconfont.css";
import Dialog from "./components/Dialog.vue";
import Verify from "./utils/Verify";
import Message from "./utils/Message";
import Request from "./utils/Request";
import Avatar from "./components/Avatar.vue";
import store from "./store";

const app = createApp(App);

app.use(router);
app.use(ElementPlus);
app.use(store);
app.config.globalProperties.VueCookies = VueCookies;
app.config.globalProperties.globalInfo = {
  bodyWidth: 1300,
  avatarUrl:"/file/getAvatar/",
};
app.config.globalProperties.Verify = Verify;
app.config.globalProperties.Message = Message;
app.config.globalProperties.Request = Request;
app.component("Dialog", Dialog);
app.component("Avatar", Avatar);
app.mount("#app");
