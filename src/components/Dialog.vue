<template>
  <div>
    <el-dialog
      :model-value="show"
      @update:model-value="(value) => (show = value)"
      :show-close="showClose"
      :close-on-click-modal="false"
      :draggable="true"
      :title="title"
      :width="width"
      :top="top"
      @close="close"
      modal-class="custom-dialog"
    >
      <div class="dialog-body">
        <slot></slot>
      </div>
      <template v-if="(buttons && buttons.length > 0) || showCancel">
        <div class="dialog-footer">
          <el-button link @click="close" v-if="showCancel" type="primary">取消</el-button>
          <el-button
            v-for="(btn, index) in buttons"
            :key="index"
            :type="btn.type"
            @click="btn.click"
          >
            {{ btn.text }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {defineEmits} from 'vue'
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "标题",
  },
  showClose: {
    type: Boolean,
    default: true,
  },
  width: {
    type: String,
    default: "30%",
  },
  top: {
    type: String,
    default: "30px",
  },
  buttons: {
    type: Array,
    default: [],
  },
  showCancel: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["close"]);
const close = () => {
  emit("close");
};
</script>

<style lang="scss" scoped>
.custom-dialog {
  margin-bottom: 0 auto !important;
  .el-dialog__body {
    padding: 0px;
  }
  .dialog-body {
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    padding: 15px;
    min-height: 100px;
    max-height: calc(100vh - 190px);
  }
  .dialog-footer {
    padding: 10px 20px;
    text-align: right;
  }
}
</style>
