import { useElementBounding, usePointerSwipe } from '@vueuse/core'
import { computed, ref, toRef, unref, watchEffect, type MaybeRef } from 'vue';
import { createDataUrl } from '@/utils/createDataUrl';
import { getCrop } from '@/utils/getCrop';

export function useEditor() {
    const activeShape = ref<Shape | undefined>()

    function updateActiveShape() {
        if (settings.value.tool === 'crop') {
            activeShape.value = {
                type: "crop",
                x: minX.value,
                y: minY.value,
                width: (maxX.value - minX.value),
                height: (maxY.value - minY.value),
            }
        }
        else if (settings.value.tool === 'rectangle') {
            activeShape.value = {
                type: settings.value.tool,
                x: minX.value,
                y: minY.value,
                width: (maxX.value - minX.value),
                height: (maxY.value - minY.value),
                thickness: settings.value.thickness,
                color: settings.value.color
            }
        }
        else if (settings.value.tool === 'line' || settings.value.tool === 'arrow') {
            activeShape.value = {
                type: settings.value.tool,
                x1: posStart.x - left.value,
                y1: posStart.y - top.value,
                x2: posEnd.x - left.value,
                y2: posEnd.y - top.value,
                thickness: settings.value.thickness,
                color: settings.value.color
            }
        }
        else {
            activeShape.value = undefined
        }
    }

    const { posStart, posEnd } = usePointerSwipe(svgRef, {
        threshold: 0,
        onSwipe(e) {
            updateActiveShape()
        },
        onSwipeEnd() {
            if (activeShape.value) {
                if (settings.value.tool === 'crop') {
                    emit('crop', crop.value)
                }
                history.value.push(activeShape.value)
                activeShape.value = undefined
            }
        }
    })
    const { top, left, width, height } = useElementBounding(container)

    const minX = computed(() => Math.max(0, Math.min(posStart.x - left.value, posEnd.x - left.value)))
    const minY = computed(() => Math.max(0, Math.min(posStart.y - top.value, posEnd.y - top.value)))
    const maxX = computed(() => Math.min(width.value, Math.max(posStart.x - left.value, posEnd.x - left.value)))
    const maxY = computed(() => Math.min(height.value, Math.max(posStart.y - top.value, posEnd.y - top.value)))

    const crop = computed(() => getCrop(history.value, activeShape.value))

    const backgroundSrc = ref()
    watchEffect(() => {
        const unreffed = unref(props.background)
        if (!unreffed) {
            return undefined
        }
        createDataUrl(unreffed).then(src => backgroundSrc.value = src)
    })

    function setTool(tool: Tool) {
        settings.value.tool = tool
    }

    function undo() {
        if (history.value.length) {
            history.value = history.value.slice(0, -1)
        }
    }

    function save() {
        const svg = container.value.querySelector("svg")
        if (!svg) {
            throw new Error("Couldn't find the svg")
        }
        emit('save', { svg, crop })
    }

    function clear() {
        history.value = []
        emit('clear')
    }

    return {
        updateActiveShape,
        activeShape,
        setTool,
        undo,
        save,
        clear
    }

}