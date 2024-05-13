import { type Position, usePointer, useElementBounding, tryOnMounted } from "@vueuse/core";
import { computed, reactive, ref, unref, watchEffect, type MaybeRef } from "vue";

export interface UseDrawOptions {
    target: MaybeRef<HTMLElement | undefined>
    container: MaybeRef<HTMLElement | undefined>
    onDrawStart?: () => void
    onDraw?: () => void
    onDrawEnd?: () => void
}

export function useDraw({ container, target, onDrawStart, onDraw, onDrawEnd }: UseDrawOptions) {

    const { x: absoluteX, y: absoluteY, pressure } = usePointer({ target })
    const { top, left, right, bottom, width, height } = useElementBounding(container)
    const isDrawing = ref(false)
    const posStart = reactive<Position>({x: 0, y: 0})
    const posEnd = reactive<Position>({x: 0, y: 0})
    const x = computed(() => Math.round(absoluteX.value - left.value))
    const y = computed(() => Math.round(absoluteY.value - top.value))
    const minX = computed(() => Math.max(0, Math.min(posStart.x, x.value)))
    const minY = computed(() => Math.max(0, Math.min(posStart.y, y.value)))
    const maxX = computed(() => Math.min(width.value, Math.max(posStart.x, x.value)))
    const maxY = computed(() => Math.min(height.value, Math.max(posStart.y, y.value)))


    tryOnMounted(() => {
        unref(target)?.style?.setProperty('touch-action', 'none')
        unref(container)?.style?.setProperty('touch-action', 'none')
        unref(target)?.style?.setProperty('user-select', 'none')
        unref(container)?.style?.setProperty('user-select', 'none')
    })

    watchEffect(() => {
        if (pressure.value && !isDrawing.value) {
            isDrawing.value = true
            posStart.x = x.value
            posStart.y = y.value
            posEnd.x = x.value
            posEnd.y = y.value
            onDrawStart?.()
        }
        else if (pressure.value && isDrawing.value) {
            posEnd.x = x.value
            posEnd.y = y.value
            onDraw?.()
        }
        else if (!pressure.value && isDrawing.value) {
            isDrawing.value = false
            onDrawEnd?.()
        }
    })

    return { 
        x, y, 
        minX, minY, maxX, maxY,
        top, left, bottom, right, width, height,
        posStart, posEnd,
        isDrawing
    }
}