import { type Position, usePointer, useElementBounding, tryOnMounted } from '@vueuse/core'
import { computed, reactive, ref, unref, watchEffect, type MaybeRef } from 'vue'

export interface UseDrawOptions {
  container: MaybeRef<HTMLElement | undefined>
  onDrawStart?: () => void
  onDraw?: () => void
  onDrawEnd?: () => void
  width: number
  height: number
}

/** Without this variable you can start drawing in one editor and continue in another (with it's potentially other tool). */
let isDrawingSomewhere = false

export function useDraw({
  container,
  onDrawStart,
  onDraw,
  onDrawEnd,
  width,
  height
}: UseDrawOptions) {
  const { x: absoluteX, y: absoluteY, pressure, pointerType } = usePointer()
  const {
    top,
    left,
    right,
    bottom,
    width: scaledWidth,
    height: scaledHeight
  } = useElementBounding(container)
  const isDrawing = ref(false)
  const posStart = reactive<Position>({ x: 0, y: 0 })
  const posEnd = reactive<Position>({ x: 0, y: 0 })
  const lastPos = reactive<Position & { left: number; top: number }>({
    x: 0,
    y: 0,
    left: 0,
    top: 0
  })
  const x = computed(() => Math.round(((absoluteX.value - left.value) * width) / scaledWidth.value))
  const y = computed(() =>
    Math.round(((absoluteY.value - top.value) * height) / scaledHeight.value)
  )
  const minX = computed(() => Math.max(0, Math.min(posStart.x, x.value)))
  const minY = computed(() => Math.max(0, Math.min(posStart.y, y.value)))
  const maxX = computed(() => Math.min(width, Math.max(posStart.x, x.value)))
  const maxY = computed(() => Math.min(height, Math.max(posStart.y, y.value)))
  const isInside = computed(
    () =>
      absoluteX.value >= left.value &&
      absoluteX.value <= right.value &&
      absoluteY.value >= top.value &&
      absoluteY.value <= bottom.value
  )
  const isMoving = computed(
    () => Math.floor(absoluteX.value) !== lastPos.x || Math.floor(absoluteY.value) !== lastPos.y
  )

  tryOnMounted(() => {
    unref(container)?.style?.setProperty('touch-action', 'none')
    unref(container)?.style?.setProperty('user-select', 'none')
  })

  watchEffect(() => {
    const isTouchScrolling =
      !isDrawing.value &&
      absoluteX.value === lastPos.x &&
      absoluteY.value === lastPos.y &&
      (left.value !== lastPos.left || top.value !== lastPos.top)

    if (
      pressure.value &&
      !isDrawing.value &&
      isInside.value &&
      isMoving.value &&
      !isDrawingSomewhere &&
      !isTouchScrolling
    ) {
      isDrawing.value = true
      isDrawingSomewhere = true
      posStart.x = x.value
      posStart.y = y.value
      posEnd.x = x.value
      posEnd.y = y.value
      onDrawStart?.()
    } else if (pressure.value && isDrawing.value) {
      posEnd.x = x.value
      posEnd.y = y.value
      onDraw?.()
    } else if (!pressure.value && isDrawing.value) {
      isDrawing.value = false
      isDrawingSomewhere = false
      onDrawEnd?.()
    }
    lastPos.x = Math.floor(absoluteX.value)
    lastPos.y = Math.floor(absoluteY.value)
    lastPos.left = Math.floor(left.value)
    lastPos.top = Math.floor(top.value)
  })

  return {
    x,
    y,
    minX,
    minY,
    maxX,
    maxY,
    top,
    left,
    bottom,
    right,
    width,
    height,
    posStart,
    posEnd,
    isDrawing,
    isInside,
    absoluteX,
    absoluteY,
    isMoving
  }
}
