<template>
    <component :is="props.tag" class="mdui-btn" :class="{
        'mdui-btn-raised': props.raised,
        'mdui-btn-icon': props.icon,
        'mdui-btn-dense': props.dense,
        'mdui-btn-block': props.block,
        'mdui-btn-active': props.active
    }">
        <slot v-if="!props.icon" />
        <i v-else class="mdui-icon material-icons">{{ props.icon }}</i>
    </component>
</template>
<script lang="ts" setup>
const props = withDefaults(defineProps<{
    tag?: string;
    raised?: boolean;
    icon?: string;
    dense?: boolean;
    block?: boolean;
    active?: boolean;
}>(), {
    tag: "button"
});
</script>