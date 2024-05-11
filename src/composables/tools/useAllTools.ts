import { useLine } from '@/composables/tools/useLine';
import { useArrow } from '@/composables/tools/useArrow';
import { useRectangle } from '@/composables/tools/useRectangle';
import { useCrop } from '@/composables/tools/useCrop';
import { useBackground } from './useBackground';

export interface Options {
    background?: Blob | Promise<Blob>
}

export function useAllTools(options?: Options) {
    const tools = [
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