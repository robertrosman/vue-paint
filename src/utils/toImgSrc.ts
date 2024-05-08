import { unref, type MaybeRef } from "vue";

// Inspired by https://jsfiddle.net/Wijmo5/h2L3gw88/
export function toImgSrc(svg: MaybeRef<SVGElement>) {
    // get svg data
    const xml = new XMLSerializer().serializeToString(unref(svg));

    // make it base64
    const svg64 = btoa(xml);
    const b64Start = 'data:image/svg+xml;base64,';

    // prepend a "header"
    return b64Start + svg64;
}