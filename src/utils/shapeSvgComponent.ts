import type { ShapeSvgProps } from "@/types"

export function shapeSvgComponent<T>(renderFunction: (shape: T, props: ShapeSvgProps<T>) => unknown) {
  return {
    props: { history: Array, shape: Object, width: Number, height: Number, isActive: Boolean },
    setup(props: ShapeSvgProps<T>) {
      return () => renderFunction(props.shape, props)
    }
  }
}
