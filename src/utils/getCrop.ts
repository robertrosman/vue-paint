import type { Crop, Shape } from "@/types";

export function getCrop (history: Shape[], activeShape: Shape | undefined) {
    if (activeShape?.type === "crop") {
        return activeShape
    }
    const cropShapes = history.filter<Crop>((shape): shape is Crop => shape.type === 'crop')
    if (cropShapes.length > 0) {
        return cropShapes.reverse()[0]
    }
}