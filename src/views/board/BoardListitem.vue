<template>
  <div class="board-item">
    <div class="board-content">
      <div class="board-name" @click="joinBoardHandle">{{ data.boardName }}</div>
      <div class="joinCount">{{ joinedCount }}人加入</div>
      <div class="board-desc">{{ data.boardDesc }}</div>
    </div>
    <Cover :cover="data.cover" :width="200" v-if="data.cover" class="cover" />
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";

const { proxy } = getCurrentInstance();
const router = useRouter();

const props = defineProps({
  data: {
    type: Object,
  },
});

const api = {
  getJoinedCount: "/board/getJoinedCount",
  joinBoard: "/board/joinBoard",
};

const joinedCount = ref(0);
const getJoinedCount = async () => {
  let result = await proxy.Request({
    url: api.getJoinedCount,
    params: { boardId: props.data.boardId },
  });
  if (!result) {
    return;
  }
  joinedCount.value = result.data == null ? 0 : result.data;
};
getJoinedCount();

const joinBoardHandle = async () => {
  let msg = ref("");
  let result = await proxy.Request({
    url: api.joinBoard,
    params: { boardId: props.data.boardId },
  });
  if (!result) {
    return;
  }
  msg.value = result.data;
  proxy.Message.success(msg.value);
};
</script>

<style lang="scss" scoped>
.board-item {
  display: flex;
  align-items: stretch;
  padding: 15px;
  height: 240px;
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 8px;
  transition: background-color 0.3s;
  cursor: pointer;

  &:hover {
    background-color: #f0f0f0;
  }

  .cover {
    flex: 0 0 200px;
    height: 100%;
    margin-left: 20px;
    border-radius: 8px;
    overflow: hidden;
  }

  .board-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-right: 20px;

    .board-name {
      font-weight: bold;
      font-size: 24px;
      color: #2c3e50;
      margin-bottom: 10px;
    }

    .joinCount {
      font-size: 16px;
      color: #7f8c8d;
      margin-bottom: 5px;
    }

    .board-desc {
      font-size: 14px;
      color: #95a5a6;
    }
  }
}
</style>