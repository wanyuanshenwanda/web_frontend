<template>
    <div class="create-board container-body">
      <el-form
        :model="formData"
        :rules="rules"
        ref="formDataRef"
        label-width="auto"
        class="board-panel"
      >
        <el-card :body-style="{ padding: '5px' }">
          <template #header>
            <span class="header">创建新板块</span>
          </template>
          <div class="board-inner">
            <el-form-item label="板块名称" prop="boardName">
              <el-input
                :maxlength="50"
                clearable
                placeholder="请输入板块名称"
                v-model.trim="formData.boardName"
              ></el-input>
            </el-form-item>
            <el-form-item label="板块描述" prop="description">
              <el-input
                clearable
                placeholder="请输入板块描述"
                type="textarea"
                :rows="5"
                :maxlength="200"
                resize="none"
                show-word-limit
                v-model="formData.description"
              ></el-input>
            </el-form-item>
            <el-form-item label="封面" props="cover">
                <CoverUpload v-model="formData.cover"></CoverUpload>
              </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                :style="{ width: '100%' }"
                @click="createBoardHandler"
                >创建</el-button
              >
            </el-form-item>
          </div>
        </el-card>
      </el-form>
    </div>
  </template>
  
  <script setup>
  import { ref, getCurrentInstance, onMounted } from "vue";
  import { useRouter } from "vue-router";
  const { proxy } = getCurrentInstance();
  const router = useRouter();
  
  const api = {
    loadBoard: "/board/loadBoard",
    createBoard: "/board/createBoard",
  };
  
  const formData = ref({
    boardName: "",
    description: "",
    cover: "",
  });
  const formDataRef = ref();
  const rules = {
    boardName: [
      { required: true, message: "请输入板块名称" },
      { max: 50, message: "板块名称太长" },
    ],
    description: [{ max: 200, message: "描述太长" }],
  };
  
  const createBoardHandler = () => {
    formDataRef.value.validate(async (valid) => {
    console.log("你好");
    
      if (!valid) {
        return;
      }
      let params = { ...formData.value };
      let result = await proxy.Request({
        url: api.createBoard,
        params: params,
      });
      if (!result) {
        return;
      }
      proxy.Message.success("板块创建成功");
      router.push(`/forum/${result.data}`);
    });
  };
  
  // 板块信息
  const boardProps = {
    multiple: false,
    checkStrictly: true,
    value: "boardId",
    label: "boardName",
  };
  const boardList = ref([]);
  const loadBoardList = async () => {
    let result = await proxy.Request({
      url: api.loadBoard,
    });
    if (!result) {
      return;
    }
    boardList.value = result.data;
  };
  onMounted(() => {
    loadBoardList();
  });
  </script>
  
  <style lang="scss" scoped>
  .create-board {
    width: 60%;
    .board-panel {
      .board-inner {

        align-items: center;
        padding: 10px;
        .el-form-item {
          margin-bottom: 20px;
        }
      }
    }
    
  }
  </style>