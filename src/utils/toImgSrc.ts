import type { Crop } from "@/types";
import { unref, type MaybeRef } from "vue";

interface Options {
    svg: MaybeRef<SVGGraphicsElement>
    crop?: MaybeRef<Crop | undefined>
}

// Inspired by https://jsfiddle.net/Wijmo5/h2L3gw88/
export function toImgSrc({ svg, crop }: Options) {
    // get svg data
    const clone = unref(svg).cloneNode(true) as SVGElement
    const unreffedCrop = unref(crop)
    if (unreffedCrop) {
        const { x, y, width, height } = unreffedCrop
        clone.setAttribute('width', String(width))
        clone.setAttribute('height', String(height))
        clone.setAttribute('viewBox', `${x} ${y} ${width} ${height}`)
        clone.querySelector(".overlay")?.remove()
    }
    const xml = new XMLSerializer().serializeToString(clone);

    // make it base64
    const svg64 = btoa(xml);

    // prepend a "header"
    return `data:image/svg+xml;base64,${svg64}`;
}