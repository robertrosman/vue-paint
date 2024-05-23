import type { ExportParameters } from "@/types";
import { exportSvg } from "./exportSvg";

// Inspired from https://stackoverflow.com/a/15832662/829505
export function downloadSvg({ svg, history, tools }: ExportParameters) {
    const uri = exportSvg({ svg, history, tools })
    const link = document.createElement("a");
    link.download = 'image.svg';
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}