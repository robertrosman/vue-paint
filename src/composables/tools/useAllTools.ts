import { useLine } from '@/composables/tools/useLine';
import { useArrow } from '@/composables/tools/useArrow';
import { useRectangle } from '@/composables/tools/useRectangle';
import { useCrop } from '@/composables/tools/useCrop';

export function useAllTools() {
    const tools = [
        useLine(),
        useArrow(),
        useRectangle(),
        useCrop()
    ]

    return { tools }
}