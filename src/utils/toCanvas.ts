import type { ExportParameters } from "@/types";
import { unref, type MaybeRef } from "vue";
import { exportSvg } from "./exportSvg";

interface Options extends ExportParameters {
    canvas: MaybeRef<HTMLCanvasElement>
}

export async function toCanvas({ svg, canvas, tools, history }: Options) {
    const image64 = exportSvg({ svg, tools, history })

    const img = new Image()
    img.src = image64;

    // Wait for image to load
    await img.decode()

    // draw the image onto the canvas once loaded
    const unreffedCanvas = unref(canvas)
    unreffedCanvas.height = img.height
    unreffedCanvas.width = img.width
    unreffedCanvas.getContext('2d')?.drawImage(img, 0, 0);
    
}