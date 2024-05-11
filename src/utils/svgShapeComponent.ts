export function svgShapeComponent<T>(renderFunction: (shape: T) => unknown) {
    return {
        props: { history: Array, shape: Object, width: Number, height: Number },
        setup(props: { shape: T }) {
            return () => renderFunction(props.shape)
        }
    }
}
