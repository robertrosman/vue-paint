import type { Movement, Handle } from "@/types"

interface RectangleLike {
  x: number
  y: number
  width: number
  height: number
}

export const rectangleHandles: Handle<RectangleLike>[] = [
    {
        name: 'base',
        position: ({ x, y, width, height }: RectangleLike) => ({ x: x + width / 2, y: y + height / 2 }),
        onMove: ({ x, y }: Movement) => ({ x, y })
    },
    {
        name: 'top-left',
        opposite: 'bottom-right',
        position: ({ x, y }: RectangleLike) => ({ x, y }),
        onMove: ({ x, y }: Movement) => ({ x, y, width: -x, height: -y })
    },
    {
        name: 'top-right',
        opposite: 'bottom-left',
        position: ({ x, y, width }: RectangleLike) => ({ x: x + width, y }),
        onMove: ({ x, y }: Movement) => ({ width: x, height: -y, y })
    },
    {
        name: 'bottom-left',
        opposite: 'top-right',
        position: ({ x, y, height }: RectangleLike) => ({ x, y: y + height }),
        onMove: ({ x, y }: Movement) => ({ x, width: -x, height: y })
    },
    {
        name: 'bottom-right',
        opposite: 'top-left',
        position: ({ x, y, width, height }: RectangleLike) => ({ x: x + width, y: y + height }),
        onMove: ({ x, y }: Movement) => ({ width: x, height: y })
    }
]