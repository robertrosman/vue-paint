import type { ToolSvgProps, DrawEvent, ToolComposable } from "@/types"
import { getArrowId } from "@/utils/getArrowId"
import { shapeSvgComponent } from "@/utils/shapeSvgComponent"
import { computed, h } from "vue"

export interface Arrow {
    type: "arrow"
    x1: number
    y1: number
    x2: number
    y2: number
    thickness: number
    color: string
}

export function useArrow(): ToolComposable<Arrow> {
    const type = "arrow"

    function onDraw({ settings, posStart, posEnd, left, top}: DrawEvent): Arrow {
        return {
            type,
            x1: posStart.x - left.value,
            y1: posStart.y - top.value,
            x2: posEnd.x - left.value,
            y2: posEnd.y - top.value,
            thickness: settings.thickness,
            color: settings.color
        }
    }

    const shapeSvg = shapeSvgComponent<Arrow>(arrow => h('line', {
        x1: arrow.x1,
        y1: arrow.y1,
        x2: arrow.x2,
        y2: arrow.y2,
        stroke: arrow.color,
        'stroke-width': arrow.thickness,
        'marker-end': `url(#${getArrowId(arrow)})`
    }))

    const toolSvg = {
        props: { history: Array, activeShape: Object, width: Number, height: Number },
        setup(props: ToolSvgProps) {
            const arrowMarkers = computed(() => {
                return [...props.history, props.activeShape]
                .filter<Arrow>((shape): shape is Arrow => shape?.type === 'arrow')
                .filter((shape, index, self) => self.findIndex(s => getArrowId(s) === getArrowId(shape)) === index) // Unique matches only
                .map(shape => ({
                    id: getArrowId(shape),
                    color: shape.color
                }))
            })
            
            return () => arrowMarkers.value.map(marker => h('defs', h('marker', {
                id: marker.id,
                key: marker.id,
                viewBox: "0 0 10 10",
                refX: "2.5",
                refY: "2.5",
                markerWidth: "8",
                markerHeight: "8",
                orient: "auto-start-reverse"
            }, [h('polygon', {
                points: "0,5 1.7,2.5 0,0 5,2.5",
                fill: marker.color
            })]))
        )
        }
    }

    return { type, onDraw, shapeSvg, toolSvg }
}

