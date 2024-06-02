import type { ShapeSvgComponentProps } from "@/types"

export function createShapeSvgComponent<T>(renderFunction: (shape: T, props: ShapeSvgComponentProps<T>) => unknown) {
  return {
    props: { history: Array, shape: Object, width: Number, height: Number, isActive: Boolean, tools: Array },
    setup(props: ShapeSvgComponentProps<T>) {
      return () => renderFunction(props.shape, props)
    }
  }
}
