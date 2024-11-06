import { snapToAngle } from '@/utils/snapToAngle'
import { type Position, usePointer, useMousePressed, useElementBounding, type MaybeElement } from '@vueuse/core'
import { computed, reactive, ref, watchEffect, type Ref } from 'vue'

export interface UseDrawOptions {
  target: Ref<MaybeElement>
  onDrawStart?: () => void
  onDraw?: () => void
  onDrawEnd?: () => void
  width: Ref<number>
  height: Ref<number>
  snapAngles?: Ref<number[] | undefined>
}

/** Without this variable you can start drawing in one editor and continue in another (with it's potentially other tool). */
let isDrawingSomewhere = false

export function useDraw({
  target,
  onDrawStart,
  onDraw,
  onDrawEnd,
  width,
  height,
  snapAngles
}: UseDrawOptions) {
  const { x: absoluteX, y: absoluteY, pressure: pointerPressure } = usePointer()

  const { pressed, sourceType } = useMousePressed()

  const {
    top,
    left,
    right,
    bottom,
    width: scaledWidth,
    height: scaledHeight,
    update
  } = useElementBounding(target)
  const isDrawing = ref(false)
  const posStart = reactive<Position>({ x: 0, y: 0 })
  const posEnd = reactive<Position>({ x: 0, y: 0 })
  const lastPos = reactive<Position & { left: number; top: number }>({
    x: 0,
    y: 0,
    left: 0,
    top: 0
  })
  const snapPosition = computed(() => snapToAngle({
    snapAngles,
    posStart,
    x: Math.round(((absoluteX.value - left.value) * width.value) / scaledWidth.value),
    y: Math.round(((absoluteY.value - top.value) * height.value) / scaledHeight.value)
  }))
  const x = computed(() => snapPosition.value.x)
  const y = computed(() => snapPosition.value.y)
  const minX = computed(() => Math.max(0, Math.min(posStart.x, x.value)))
  const minY = computed(() => Math.max(0, Math.min(posStart.y, y.value)))
  const maxX = computed(() => Math.min(width.value, Math.max(posStart.x, x.value)))
  const maxY = computed(() => Math.min(height.value, Math.max(posStart.y, y.value)))
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

  watchEffect(() => {
    const isTouchScrolling =
      !isDrawing.value &&
      absoluteX.value === lastPos.x &&
      absoluteY.value === lastPos.y &&
      (left.value !== lastPos.left || top.value !== lastPos.top)

    let pressure = pointerPressure.value

    // For iOS not sending pressure on touch
    if(pointerPressure.value === 0 && pressed.value && sourceType.value === 'touch') {
      pressure = 0.5
    }

    if (
      pressure &&
      !isDrawing.value &&
      isInside.value &&
      isMoving.value &&
      !isDrawingSomewhere &&
      !isTouchScrolling
    ) {
      update()
      isDrawing.value = true
      isDrawingSomewhere = true
      posStart.x = x.value
      posStart.y = y.value
      posEnd.x = x.value
      posEnd.y = y.value
      onDrawStart?.()
    } else if (pressure && isDrawing.value) {
      posEnd.x = x.value
      posEnd.y = y.value
      onDraw?.()
    } else if (!pressure && isDrawing.value) {
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
