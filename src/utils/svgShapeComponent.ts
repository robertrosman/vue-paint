export function svgShapeComponent<T>(renderFunction: (shape: T) => unknown) {
    return {
        props: { shape: Object },
        setup(props: { shape: T }) {
            return () => renderFunction(props.shape)
        }
    }
}
