<template>
  <div
    class="container-body search-body"
    :style="{ width: proxy.globalInfo.bodyWidth + 'px' }"
  >
    <div
      class="search-panel"
      :style="{ 'padding-top': !startSearch ? '200px' : '0px' }"
    >
      <el-form :model="searchForm" ref="searchFormRef" :rules="searchRules">
        <el-form-item prop="keyword">
          <el-input
            size="large"
            clearable
            v-model="searchForm.keyword"
            placeholder="请输入你想要查找的关键词"
            @focus="startSearchHandler"
            @change="changeInput"
            @keyup.enter="search"
          >
            <template #suffix>
              <span
                class="iconfont icon-search"
                @click="search"
                @blur="searchForm.keyword = $event.target.value.trim()"
              />
            </template>
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="article-list">
      <DataList
        :dataSource="articleListInfo"
        :loading="loading"
        @loadData="search"
        noDataMsg="暂无文章"
      >
        <template #default="{ data }">
          <ArticleListItem :data="data" :htmlTitle = "true" />
        </template>
      </DataList>
    </div>
  </div>
</template>

<script setup>
import ArticleListItem from "@/views/forum/ArticleListItem.vue";
import { ref, reactive, getCurrentInstance } from "vue";
import { useRouter, useRoute } from "vue-router";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();

const api = {
  search: "/forum/search",
};

const searchForm = ref({ keyword: "" });
const searchFormRef = ref();
const searchRules = reactive({
  keyword: [{ required: true, message: "请输入关键字", trigger: "blur" }],
});

const startSearch = ref(false);
const startSearchHandler = () => {
  startSearch.value = true;
};

const loading = ref(false);
const articleListInfo = ref({});
const search = async () => {
  loading.value = true;
  let params = {
    keyword: searchForm.value.keyword,
  };
  let result = await proxy.Request({
    url: api.search,
    params: params,
    showLoading: false,
  });
  loading.value = false;
  if (!result) {
    return;
  }
  articleListInfo.value = result.data;

  let list = result.data.list;
  list.forEach((element) => {
    element.title = element.title.replace(
      params.keyword,
      "<span style='color: #f56c6c;'>" + params.keyword + "</span>"
    );
  });
};

const handleKeyup = (event) => {
  if (event.keyCode === 13 || event.keyCode === 32) {
    search();
  }
};

const changeInput = (event) => {
  if (searchForm.value.keyword.trim() == "") {
    articleListInfo.value = {};
  }
};

</script>

<style lang="scss" scoped>
.search-body {
  background: #fff;
  padding: 10px;
  min-height: calc(100vh - 60px);

  .search-panel {
    display: flex;
    justify-content: center;
    .el-input {
      width: 700px;
    }
  }
}
</style>
