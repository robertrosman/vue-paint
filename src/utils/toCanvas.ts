import type { Crop } from "@/types";
import { unref, type MaybeRef } from "vue";
import { toImgSrc } from "./toImgSrc";

interface Options {
    svg: MaybeRef<SVGGraphicsElement>
    canvas: MaybeRef<HTMLCanvasElement>
    crop?: MaybeRef<Crop | undefined>
}

export async function toCanvas({ svg, canvas, crop }: Options) {
    const image64 = toImgSrc({ svg, crop })

    return new Promise<void>((resolve, reject) => {
        // set it as the source of the img element
        const img = new Image()
        img.onload = () => {
            // draw the image onto the canvas once loaded
            const unreffedCanvas = unref(canvas)
            unreffedCanvas.height = img.height
            unreffedCanvas.width = img.width
            unreffedCanvas.getContext('2d')?.drawImage(img, 0, 0);
            resolve()
        }
        img.onerror = () => reject(img);
        img.src = image64;
    });
}