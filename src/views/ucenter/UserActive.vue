<template>
  <Dialog
    :Show="dialogConfig.show"
    :title="dialogConfig.title"
    :buttons="dialogConfig.buttons"
    width="600px"
    :showCancel="false"
    @close="dialogConfig.show = false"
  >
    <el-form :model="formData" ref="formDataRef" label-width="40px">
      <el-form-item label="日期" prop="createTimeRange">
        <el-date-picker
          v-model="formData.createTimeRange"
          type="daterange"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
          @change="loadRecord"
        ></el-date-picker>
      </el-form-item>
    </el-form>
    <div class="data-item">
      <div class="record-type">模块</div>
      <div class="integral">积分</div>
      <div class="create-time">活跃情况</div>
    </div>
    <DataList
      :loading="loading"
      :dataSource="recordInfo"
      @loadData="loadRecord"
      noDataMsg="暂无相关记录"
    >
      <template #default="{ data }">
        <div class="data-item">
          <div class="record-type">{{ data.boardName }}</div>
          <div :class="['integral', data.integral > 0 ? 'add' : 'reduce']">
            {{ data.integral }}
          </div>
          <div class="create-time">{{ data.userStatus }}</div>
        </div>
      </template>
    </DataList>
  </Dialog>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();

const api = {
  loadUserIntegralRecord: "/ucenter/getUserActive",
  getUserStatus: "/board/getUserStatus",
};

const dialogConfig = reactive({
  show: false,
  title: "查看用户活跃情况",
  buttons: [
    {
      type: "primary",
      text: "确定",
      click: (e) => {
        dialogConfig.show = false;
      },
    },
  ],
});

const formData = ref({});
const formDataRef = ref();

const getUserStatus = async (boardId) => {
  let result = await proxy.Request({
    url: api.getUserStatus,
    params: {
      boardId: boardId,
    },
    showLoading: false,
  });
  if (!result) {
    return;
  }
  return result.data;
};

const showRecord = () => {
  dialogConfig.show = true;
  nextTick(() => {
    formDataRef.value.resetFields();
    loadRecord();
  });
};
defineExpose({ showRecord });

const loading = ref(false);
const recordInfo = ref({});
const loadRecord = async () => {
  loading.value = true;

  let params = {};
  if (formData.value.createTimeRange) {
    params.createTimeStart = formData.value.createTimeRange[0];
    params.createTimeEnd = formData.value.createTimeRange[1];
  }

  let result = await proxy.Request({
    url: api.loadUserIntegralRecord,
    params: params,
    showLoading: false,
  });
  loading.value = false;
  if (!result) {
    return;
  }

  // 预处理状态值
  const records = result.data.list || [];
  for (const record of records) {
    record.userStatus = await getUserStatus(record.boardId);
  }

  recordInfo.value = {
    ...result.data,
    list: records,
  };
};
</script>

<style lang="scss">
.data-item {
  display: flex;
  border-bottom: 1px solid #ddd;
  padding: 8px 0px;
  .add {
    color: red;
  }
  .reduce {
    color: green;
  }
  .record-type {
    width: 120px;
  }
  .integral {
    width: 120px;
  }
  .create-time {
    text-align: center;
    flex: 1;
  }
}
</style>