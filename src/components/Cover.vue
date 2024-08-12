<template>
    <div class="cover" :style="{ width: width + 'px', height: width + 'px' }">
      <el-image
        :style="{ width: width + 'px', height: width + 'px' }"
        fit="scale-down"
        loading="lazy"
        :src="proxy.globalInfo.imageUrl + cover"
      >
      </el-image>
      <img src="@/assets/image/27bd05027c8832ec4d5a3a2f8b86b1ee.jpg" alt="">
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, getCurrentInstance } from "vue";
  const { proxy } = getCurrentInstance();
  //默认封面
  // const localCover=new URL(@/assets/image/27bd05027c8832ec4d5a3a2f8b86b1ee.jpg',import.meta.url).href
  const props = defineProps({
    cover: {
      type: String,
    },
    width: {
      type: Number,
      default: 60,
    },
  });
  </script>
  
  <style lang="scss" scoped>
  .cover {
    background: #ddd;
    border-radius: 5px;
    overflow: hidden;
  }
  </style>