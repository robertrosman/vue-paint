<script setup lang="ts">
import type { Settings, Tool, ToolComposable } from '@/types';

const props = defineProps<{
    tools: ToolComposable<unknown>[]
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

function hasTool(tool: Tool) {
    return props.tools.some(t => t.type === tool)
}

</script>

<template>
    <button v-if="hasTool('freehand')" @click="settings.tool = 'freehand'">Freehand</button>
    <button v-if="hasTool('line')" @click="settings.tool = 'line'">Line</button>
    <button v-if="hasTool('arrow')" @click="settings.tool = 'arrow'">Arrow</button>
    <button v-if="hasTool('rectangle')" @click="settings.tool = 'rectangle'">Rectangle</button>
    <button v-if="hasTool('crop')" @click="settings.tool = 'crop'">Crop</button>
    <input type="range" min="1" max="10" v-model="settings.thickness" />
    <input type="color" v-model="settings.color" />
    <button @click="emit('undo')">Undo</button>
    <button @click="emit('clear')">Clear</button>
    <button @click="emit('save')">Save</button>
</template>