import type { Shape, Tool } from "@/types"
import { computed, type Ref } from "vue"

interface UseSimplifiedHistoryOptions {
  history: Ref<any[]>
  tools: Ref<Tool<any>[]>
  activeShape?: Ref<Shape | undefined>
}

export function useSimplifiedHistory({ history, tools, activeShape}: UseSimplifiedHistoryOptions) {

    const simplifiedHistory = computed(() => {
        const historyWithActiveShape = activeShape?.value ? [...history.value, activeShape.value] : [...history.value]
        return tools.value.reduce((history, tool) => tool.simplifyHistory?.(history, tools.value) ?? history, historyWithActiveShape)
            .filter(s => s.id !== activeShape?.value?.id)
    })

    return { simplifiedHistory }
}