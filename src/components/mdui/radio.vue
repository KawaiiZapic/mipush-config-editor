<template>
    <label class="mdui-radio" ref="radio">
        <input type="radio" :name="props.name" />
        <i class="mdui-radio-icon"></i>
        <slot />
    </label>
</template>
<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import mdui from 'mdui';

const props = defineProps<{
    modelValue: unknown;
    disabled?: boolean;
    name: string;
    value: unknown;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: unknown): void;
}>();

const radio = ref<HTMLLabelElement>();

onMounted(() => {
    if (!radio.value) return;
    const $ = mdui.$(radio.value);
    const input = $.find('input');
    $.on('change', () => {
        emit('update:modelValue', props.value);
    }).mutation();
    watch(() => props.modelValue, (value) => {
        if (value === props.value) {
            input.prop('checked', true);
        } else {
            input.prop('checked', false);
        }
        $.mutation();
    }, {
        immediate: true
    });
});
</script>