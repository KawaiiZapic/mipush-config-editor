<template>
  <button @click="handleOpenFile">打开文件</button>
</template>
<script lang="ts" setup>
import { defineEmits } from 'vue';
import { Config } from '../Interfaces/RealConfigFile';

const emits = defineEmits<{
    (e: 'update:modelValue', value: Config): void;
}>();

const handleOpenFile = () => {
    const input  = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.addEventListener("change", e => {
        input.files![0].text().then(text => {
            emits('update:modelValue', JSON.parse(text));
        });
    })
    input.click();
}
</script>