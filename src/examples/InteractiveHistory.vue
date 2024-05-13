<script setup lang="ts">

import PaintEditor from '@/components/PaintEditor.vue'
import { useAllTools } from '@/composables/tools/useAllTools'
import type { Settings, Shape } from '@/types';
import { computed, ref } from 'vue';

const history = ref<Shape[]>([])
const settings = ref<Settings>({
    tool: 'line',
    thickness: 3,
    color: "#cf7520"
})

const { tools } = useAllTools()

const historyJson = computed({
    get() {
        return JSON.stringify(history.value, null, 2)
    },
    set(value: string) {
        history.value = JSON.parse(value)
    }
})

const settingsJson = computed({
    get() {
        return JSON.stringify(settings.value, null, 2)
    },
    set(value: string) {
        settings.value = JSON.parse(value)
    }
})

function addRandomLine() {
    history.value.push({
    type: "line",
    x1: Math.floor(Math.random() * 500),
    y1: Math.floor(Math.random() * 300),
    x2: Math.floor(Math.random() * 500),
    y2: Math.floor(Math.random() * 300),
    thickness: Math.floor(Math.random() * 5 + 1),
    color: settings.value.color
  })
}

</script>

<template>
    <h1>Interactive history</h1>
    <p>You can inspect and modify the history and settings objects down below to see it update automatically. This can
        of course be done programmatically as well.</p>
    <paint-editor class="vue-draw" v-model:settings="settings" v-model:history="history" :tools />
    <button @click="addRandomLine">Add random line</button>
    <textarea v-model="historyJson"></textarea>
    <textarea v-model="settingsJson"></textarea>
</template>

<style>

textarea {
    width: 250px;
    height: 500px;
}

</style>