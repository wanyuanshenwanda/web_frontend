<template>
  <div class="container-body board-list-body">
    <div class="board-panel">
      <div class="board-list" v-for="board in boardList" :key="board.boardId">
        <router-link :to="'/forum/' + board.boardId">
          <BoardListitem :data="board" />
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from "vue";
import { useRouter, useRoute } from "vue-router";
import BoardListitem from "./BoardListitem.vue";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();

const boardList = ref([]);
const api = {
  loadBoard: "/board/loadBoard",
};

const loadBoard = async () => {
  let result = await proxy.Request({
    url: api.loadBoard,
  });
  if (!result) {
    return;
  }
  boardList.value = result.data;
};
loadBoard();
</script>

<style lang="scss" scoped>
.board-list-body {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.board-panel {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 8px;

  .board-list {
    flex: 1 1 calc(33.333% - 20px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.3s;

    &:hover {
      transform: translateY(-10px);
    }

    a {
      text-decoration: none;
      color: inherit;
    }
  }
}
</style>