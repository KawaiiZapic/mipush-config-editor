<template>
    <label class="mdui-checkbox" ref="checkbox">
        <input type="checkbox"/>
        <i class="mdui-checkbox-icon"></i>
        <slot />
    </label>
</template>
<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import mdui from 'mdui';

const props = defineProps<{
    modelValue: boolean;
    disabled?: boolean;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
}>();

const checkbox = ref<HTMLLabelElement>();

onMounted(() => {
    if (!checkbox.value) return;
    const $ = mdui.$(checkbox.value);
    const input = $.find('input');
    $.on('change', () => {
        emit('update:modelValue', !props.modelValue);
    }).mutation();
    watch(() => props.modelValue, (value) => {
        input.prop("checked", value);
        $.mutation();
    }, {
        immediate: true
    });
});
</script>