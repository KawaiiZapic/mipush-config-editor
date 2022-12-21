<template>
  <div>
    MiPush推送配置
  </div>
  <file-open v-model="config" />
  {{ config }}
</template>

<script setup lang="ts">
import FileOpen from "./components/File.vue";
import { ref } from "vue";
import { Config } from "./Interfaces/RealConfigFile";

const config = ref<Config>();
</script>

<style lang="scss" scoped>
</style>