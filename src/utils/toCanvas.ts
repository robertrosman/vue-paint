import type { Crop } from "@/types";
import { unref, type MaybeRef } from "vue";
import { toImgSrc } from "./toImgSrc";

// Inspired by https://jsfiddle.net/Wijmo5/h2L3gw88/
export function toCanvas(svg: MaybeRef<SVGGraphicsElement>, canvas: MaybeRef<HTMLCanvasElement>, crop?: Crop) {
    const image64 = toImgSrc(svg)

    // set it as the source of the img element
    const img = new Image()
    img.onload = () => {
        // draw the image onto the canvas
        const unreffedCanvas = unref(canvas)
        unreffedCanvas.height = crop?.height ?? Number(unref(svg).getAttribute('height'))
        unreffedCanvas.width = crop?.width ?? Number(unref(svg).getAttribute('width'))
        unreffedCanvas.getContext('2d')?.drawImage(img,
            crop?.x ?? 0, crop?.y ?? 0, unreffedCanvas.width, unreffedCanvas.height,
            0, 0, unreffedCanvas.width, unreffedCanvas.height
        );
    }
    img.src = image64;
}