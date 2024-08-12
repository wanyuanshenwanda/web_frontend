<template>
  <div class="error">
    <div>迷路了吗?前方的区域,以后再来探索吧</div>
    <div><router-link to="/" class="a-link">返回首页</router-link></div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.error {
  text-align: center;
  padding-top: 800px;
  .a-link {
    color: var(--link);
    font-size: 50px;
    text-decoration: none;
    &:hover {
      color: var(--link-hover);
    }
  }
}
</style>