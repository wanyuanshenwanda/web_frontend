import axios from "axios";
import { ElLoading } from "element-plus";
import ElMessagessage from "./Message";
import Message from "./Message";

const contentTypeForm = "application/x-www-form-urlencoded;charset=UTF-8";
const contentTypeJson = "application/json;charset=UTF-8";

const instance = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 10 * 1000,
});
let loading = null;
instance.interceptors.request.use(
  (config) => {
    if (config.showLoading) {
      loading = ElLoading.service({
        lock: true,
        text: "加载中",
        background: "rgba(0, 0, 0, 0.7)",
      });
    }
    return config;
  },
  (error) => {
    if (error.config.showLoading && loading) {
      loading.close();
    }
    Message.error("请求发送失败");
    return Promise.reject("请求发送失败");
  }
);
instance.interceptors.response.use(
  (response) => {
    const { showLoading, errorCallBack, showError } = response.config;
    if (showLoading && loading) {
      loading.close();
    }
    const responseData = response.data;
    if (responseData.code === 200) {
      return responseData;
    } else if (responseData.code === 901) {
      return Promise.reject({ showError: false, msg: "登录超时" });
    } else {
      if (errorCallBack) {
        errorCallBack(responseData);
      }
      return Promise.reject({ showError: showError, msg: responseData.info });
    }
  },
  (error) => {
    if(error.config.showLoading && loading) {
      loading.close();
    }
    return Promise.reject({ showError: true, msg: "网络异常" });
  }
);

const request = (config) => {
  const {
    url,
    params,
    dataType,
    showLoading = true,
    errorCallBack,
    showError = true,
  } = config;
  let contentType = contentTypeForm;
  let formData = new FormData();
  for (let key in params) {
    formData.append(key, params[key] == undefined ? "" : params[key]);
  }
  if (dataType === "json") {
    contentType = contentTypeJson;
    formData = JSON.stringify(params);
  }
  let headers = {
    "Content-Type": contentType,
    "x-Requested-With": "XMLHttpRequest",
  };
  return instance
    .post(url, formData, {
      headers: headers,
      showLoading: showLoading,
      errorCallBack: errorCallBack,
      showError: showError,
    })
    .catch((error) => {
      if (error.showError) {
        Message.error("请求失败");
      }
      return null;
    });
};

export default request;
