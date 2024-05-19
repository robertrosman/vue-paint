<script setup lang="ts">
import VpEditor from '@/components/VpEditor.vue'
import { useRectangle } from '@/composables/tools/useRectangle'
import { useArrow } from '@/composables/tools/useArrow'
import type { Tool } from '@/types'

const tools = [useRectangle(), useArrow()]

type ExtractGeneric<Type> = Type extends Tool<infer S> ? S : never
type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never
type History<Tools extends Array<unknown>> = ExtractGeneric<ArrayElement<Tools>>[]

const arrow = useArrow()
const onlyArrow = [arrow]
const arrowHistory: History<typeof tools> = [
  { type: 'arrow', x1: 0, x2: 0, y1: 0, y2: 0, thickness: 2, color: 'red' }
]
const firstArrow = arrowHistory[0]

const shapes: History<typeof tools> = []

shapes[0].type

defineEmits(['save'])
</script>

<template>
  <h1>With less tools</h1>
  <p>The editor will only support the tools you provide it</p>
  <vp-editor class="vue-draw" @save="$emit('save', $event)" :tools></vp-editor>
</template>
