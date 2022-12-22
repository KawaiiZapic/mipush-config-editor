<template>
    <div class="mdui-card">
        <div class="mdui-card-header" v-if="slots.title || slots.subtitle">
            <div class="mdui-card-header-title">
                <slot name="title"/>
            </div>
            <div class="mdui-card-header-subtitle">
                <slot name="subtitle"/>
            </div>
        </div>
        <div class="mdui-card-content">
            <slot/>
        </div>
        <div class="mdui-card-actions">
            <slot name="actions"/>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { useSlots } from "vue";

const slots = useSlots();
</script>