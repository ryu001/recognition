<template>
  <div id="app">
    <el-menu
    class="el-menu-demo"
    mode="horizontal"
    :ellipsis="false"
  >
    <el-menu-item index="0" click="handleSelect">X Company</el-menu-item>
    <div class="flex-grow" />
  </el-menu>
    <div class="container mt-3">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "Recognition App",
});
const activeIndex = ref('1')
document.title = "X"
</script>

<style>
.flex-grow {
  flex-grow: 1;
}
</style>
