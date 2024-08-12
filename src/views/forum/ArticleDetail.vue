<template>
  <div>
    <div
      class="container-body article-detail-body"
      :style="{ width: proxy.globalInfo.bodyWidth + 'px' }"
      v-if="Object.keys(articleInfo).length > 0"
    >
      <!-- 板块导航 -->
      <div class="board-info">
        <template v-if="articleInfo.boardId">
          <router-link :to="`/forum/${articleInfo.boardId}`" class="a-link">{{
            articleInfo.boardId ? articleInfo.boardName : "全部"
          }}</router-link>
          <span class="iconfont icon-right"></span>
        </template>

        <span>{{ articleInfo.title }}</span>
      </div>
      <!-- 文章详情 -->
      <div
        class="detail-container"
        :style="{ width: proxy.globalInfo.bodyWidth - 300 + 'px' }"
      >
        <div class="article-detail">
          <!-- 标题 -->
          <div class="title">
            {{ articleInfo.title }}
          </div>
          <!-- 用户信息 -->
          <div class="user-info">
            <Avatar :userId="articleInfo.userId" :width="50" />
            <div class="user-info-detail">
              <router-link
                class="nick-name a-link"
                :to="`/user/${articleInfo.userId}`"
                >{{ articleInfo.nickName }}</router-link
              >
              <span
                class="user-status iconfont icon-user-filling"
                >{{ userStatus }}</span
              >
              <div class="time-info">
                <span>{{ articleInfo.postTime }}</span>
                <span class="iconfont icon-eye-solid">{{
                  articleInfo.readCount == 0 ? "阅读" : articleInfo.readCount
                }}</span>
                <router-link
                  v-if="articleInfo.userId == currentUserInfo.userId"
                  :to="`/editPost/${articleInfo.articleId}`"
                  class="a-link btn-edit"
                >
                  <span class="iconfont icon-edit">编辑</span>
                </router-link>
              </div>
            </div>
          </div>
          <!-- 文章详情 -->
          <div class="detail" id="detail" v-html="articleInfo.content"></div>
        </div>
        <!-- 评论 -->
        <div class="comment-panel" id="view-comment">
          <CommentList
            :articleId="articleInfo.articleId"
            :articleUserId="articleInfo.userId"
            v-if="articleInfo.articleId"
            @updateCommentCount="updateCommentCount"
          />
        </div>
      </div>
    </div>
    <!-- 左侧快捷操作 -->
    <div class="quick-panel" :style="{ left: quickPanelLeft + 'px' }">
      <!-- 点赞 -->
      <el-badge
        :value="articleInfo.goodCount"
        type="info"
        :hidden="!articleInfo.goodCount > 0"
      ></el-badge>
      <div class="quick-item" @click="doLikeHandler">
        <span
          :class="['iconfont', 'icon-good', haveLike ? 'have-like' : '']"
        ></span>
      </div>
      <!-- 评论 -->
      <el-badge
        :value="articleInfo.commentCount"
        type="info"
        :hidden="!articleInfo.commentCount > 0"
      ></el-badge>
      <div class="quick-item" @click="goToPostion('view-comment')">
        <span class="iconfont icon-comment"></span>
      </div>
      <!-- 图片预览 -->
      <ImageViewer
        ref="imageViewerRef"
        :imageList="previewImgList"
      ></ImageViewer>
    </div>
  </div>
</template>

<script setup>
import hljs from "highlight.js";
import {
  ref,
  reactive,
  getCurrentInstance,
  onMounted,
  nextTick,
  onUnmounted,
  watch,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import CommentList from "@/views/forum/CommentList.vue";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const store = useStore();
const api = {
  getArticleDetail: "/forum/getArticleDetail",
  doLike: "/forum/doLike",
  getUserDownloadInfo: "/forum/getUserDownloadInfo",
  getUserStatus: "/board/getUserStatus1",
};
//文章详情
const articleInfo = ref({});
const currentUserInfo = ref({});
//是否已点赞
const haveLike = ref(false);
//用户状态
const userStatus = ref("");

//点赞
const doLikeHandler = async () => {
  if (!store.getters.getLoginUserInfo) {
    store.commit("showLogin", true);
    return;
  }
  let result = await proxy.Request({
    url: api.doLike,
    params: {
      articleId: articleInfo.value.articleId,
    },
  });
  if (!result) {
    return;
  }
  haveLike.value = !haveLike.value;
  let goodCount = 1;
  if (!haveLike.value) {
    goodCount = -1;
  }
  articleInfo.value.goodCount += goodCount;
};

const getUserStatus = async (userId, boardId) => {
  let result = await proxy.Request({
    url: api.getUserStatus,
    params: {
      userId: userId,
      boardId: boardId,
    },
    showLoading: false,
  });
  if (!result) {
    return;
  }
  userStatus.value = result.data;
};

const getArticleDetail = async (articleId) => {
  let result = await proxy.Request({
    url: api.getArticleDetail,
    params: {
      articleId: articleId,
    },
  });
  if (!result) {
    return;
  }
  articleInfo.value = result.data.forumArticle;
  haveLike.value = result.data.haveLike;

  store.commit("setActiveBoardId", result.data.forumArticle.boardId);
  //图片预览
  imagePreview();
  //代码高亮
  highlightCode();
  //获取用户状态
  await getUserStatus(articleInfo.value.userId, articleInfo.value.boardId);
};

onMounted(() => {
  getArticleDetail(route.params.articleId);
});
//快捷操作
const quickPanelLeft =
  (window.innerWidth - proxy.globalInfo.bodyWidth) / 2 - 110;

//跳转
const goToPostion = (domId) => {
  document.querySelector("#" + domId).scrollIntoView();
};

//文章图片列表
const imageViewerRef = ref(null);
const previewImgList = ref([]);
const imagePreview = () => {
  nextTick(() => {
    const imageNodeList = document
      .querySelector("#detail")
      .querySelectorAll("img");
    const imageList = [];
    imageNodeList.forEach((item, index) => {
      const src = item.getAttribute("src");
      imageList.push(src);
      item.addEventListener("click", () => {
        imageViewerRef.value.show(index);
      });
    });
    previewImgList.value = imageList;
  });
};
//代码高亮
const highlightCode = () => {
  nextTick(() => {
    let blocks = document.querySelectorAll("pre code");
    blocks.forEach((item) => {
      hljs.highlightBlock(item);
    });
  });
};

//更新评论数量
const updateCommentCount = (totalCount) => {
  articleInfo.value.commentCount = totalCount;
};

const anchorId = ref(null);
const gotoAnchor = (domId) => {
  const dom = document.querySelector("#" + domId);
  dom.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};

const listenerScroll = () => {
  let currentScrollTop = getScrollTop();
  tocArray.value.some((item, index) => {
    if (
      (index < tocArray.value.length - 1 &&
        currentScrollTop >= tocArray.value[index].offsetTop &&
        currentScrollTop < tocArray.value[index + 1].offsetTop) ||
      (index == tocArray.value.length - 1 &&
        currentScrollTop < tocArray.value[index].offsetTop)
    ) {
      anchorId.value = item.id;
      return true;
    }
  });
};

//获取滚动条的高度
const getScrollTop = () => {
  let scrollTop =
    document.documentElement.scrollTop ||
    window.pageYOffset ||
    document.body.scrollTop;
  return scrollTop;
};

onMounted(() => {
  window.addEventListener("scroll", listenerScroll);
});
onUnmounted(() => {
  window.removeEventListener("scroll", listenerScroll);
});
// 监听登录用户
watch(
  () => store.state.loginUserInfo,
  (newVal, oldVal) => {
    currentUserInfo.value = store.getters.getLoginUserInfo || {};
  },
  { immediate: true, deep: true }
);
</script>

<style lang="scss" scoped>
.article-detail-body {
  position: relative;
  .board-info {
    line-height: 40px;
    .icon-right {
      margin: 0px 10px;
    }
  }
  .detail-container {
    .article-detail {
      background-color: #ffffff;
      padding: 10px;
      .title {
        font-weight: bold;
      }
      .user-info {
        margin-top: 15px;
        display: flex;
        padding-bottom: 10px;
        .user-info-detail {
          margin-left: 10px;
          .nick-name {
            text-decoration: none;
            color: #4e5959;
            font-size: 15px;
          }
          .nick-name:hover {
            color: var(--link);
          }
          .user-status {
            margin-left: 10px; // 添加左边距，使其与昵称分开
            color: #4e5959; // 确保颜色一致
            font-size: 15px; // 确保字体大小一致
          }
          .time-info {
            margin-top: 5px;
            font-size: 13px;
            color: var(--text2);
            .iconfont {
              margin-left: 10px;
            }
            .iconfont:before {
              padding-right: 3px;
            }
            .btn-edit {
              .iconfont {
                font-size: 14px;
              }
            }
          }
        }
      }
      .detail {
        letter-spacing: 1px;
        line-height: 22px;
        a {
          text-decoration: none;
          color: var(--link);
        }
        img {
          max-width: 90%;
          cursor: pointer;
        }
      }
    }
    .comment-panel {
      margin-top: 20px;
      background: #fff;
      padding: 20px;
    }
  }
}

.quick-panel {
  position: fixed;
  width: 50px;
  top: 200px;
  text-align: center;
  .el-badge__content.is-fixed {
    top: 5px;
    right: 15px;
  }
  .quick-item {
    display: flex;
    width: 50px;
    height: 50px;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    background-color: #fff;
    margin-bottom: 30px;
    cursor: pointer;
    .iconfont {
      font-size: 22px;
      color: var(--text2);
    }
    .have-like {
      color: red;
    }
  }
}
.toc-panel {
  position: absolute;
  top: 45px;
  right: 0px;
  width: 285px;

  .top-container {
    width: 285px;
    position: fixed;
    background: #fff;
    height: 500px;
    .toc-title {
      border-bottom: 1px solid #ddd;
      padding: 10px;
    }
    .toc-list {
      max-height: calc(100vh - 200px);
      overflow: auto;
      padding: 5px;
      .no-toc {
        text-align: center;
        color: #5f5d5d;
        line-height: 40px;
        font-size: 13px;
      }
      .toc-item {
        cursor: pointer;
        display: block;
        line-height: 35px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: #555666;
        border-radius: 3px;
        font-size: 14px;
        border-left: 2px solid #fff;
      }
      .toc-item:hover {
        background: #fff;
      }
      .active {
        border-left: 2px solid #6ca1f7;
        border-radius: 0px 3px 3px 0px;
        background: #eeeded;
      }
    }
  }
}
</style>
