<script setup lang="ts">
import type { Settings, Shape, Tool, ToolComposable } from '@/types';

const props = defineProps<{
    tools: ToolComposable<Shape>[]
}>()

const emit = defineEmits<{
    (e: 'save'): void
    (e: 'undo'): void
    (e: 'clear'): void
}>()

const settings = defineModel<Settings>("settings", {
    default: () => ({
        tool: "freehand",
        thickness: 5,
        color: "#c82d2d"
    })
})

// Why is it not updating immediately? Is a separate model really needed at all, or can we make the settings.tool reactive too?
const activeTool = defineModel<Tool>("activeTool")

</script>

<template>
    <div class="toolbar">
        <button v-for="tool in tools.filter(tool => tool.icon)" :key="tool.type"
            :class="{ active: activeTool === tool.type }" @click="activeTool = tool.type as Tool" :title="tool.type"
            v-html="tool.icon"></button>
        <input type="range" min="1" max="10" v-model="settings.thickness" />
        <input type="color" v-model="settings.color" />
        <button @click="emit('undo')"><img src="/src/assets/icons/undo.svg" /></button>
        <button @click="emit('clear')"><img src="/src/assets/icons/clear.svg" /></button>
        <button @click="emit('save')"><img src="/src/assets/icons/save.svg" /></button>
    </div>
</template>

<style scoped>
.toolbar {
    display: flex;
    gap: 0.25em;
}

.toolbar button,
.toolbar input[type=color] {
    background: #eee;
    outline: none;
    width: 2.5em;
    height: 2.5em;
    border-radius: 50%;
    border: 1px solid #aaa;
    box-shadow: 0 0.2em 0.3em #ccc;
    cursor: pointer;
}

.toolbar input[type=color]:hover,
.toolbar button:hover,
.toolbar button.active {
    background: #ddd;
    border: 1px solid #999;
    box-shadow: 0 0.2em 0.3em #bbb;
}
</style>