<template>
    <div class="mdui-textfield" ref="input">
        <label class="mdui-textfield-label" v-if="props.label">{{ props.label }}</label>
        <input class="mdui-textfield-input" type="text" v-model="value" />
    </div>
</template>
<script lang="ts" setup>
import mdui from "mdui";
import { onMounted } from "vue";
import { ref, computed } from "vue";

const props = defineProps<{
    label?: string;
    modelValue: string;
}>();
const emit = defineEmits<{
    (event: "update:modelValue", value: string): void;
}>();

const value = computed({
    get() {
        return props.modelValue;
    },
    set(value) {
        emit("update:modelValue", value);
    },
});
const input = ref<HTMLDivElement>();
onMounted(() => {
    mdui.$(input.value!).mutation();
    mdui.updateTextFields(input.value!);
});
</script>