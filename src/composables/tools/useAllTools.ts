import { useFreehand } from './useFreehand';
import { useLine } from './useLine';
import { useArrow } from './useArrow';
import { useRectangle } from './useRectangle';
import { useCrop } from './useCrop';
import { useBackground } from './useBackground';

export interface Options {
    background?: Blob | Promise<Blob>
}

export function useAllTools(options?: Options) {
    const tools = [
        useFreehand(),
        useLine(),
        useArrow(),
        useRectangle(),
        useCrop()
    ]
    if (options?.background) {
        return { tools: [
            useBackground({ blob: options?.background }),
            ...tools
        ]}
    }
    return { tools }
}