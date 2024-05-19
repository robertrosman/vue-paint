export function shapeSvgComponent<T>(renderFunction: (shape: T) => unknown) {
  return {
    props: { history: Array, shape: Object, width: Number, height: Number },
    setup(props: { shape: T }) {
      return () => renderFunction(props.shape)
    }
  }
}
