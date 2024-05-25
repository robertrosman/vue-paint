import { useFreehand } from './useFreehand/useFreehand'
import { useLine } from './useLine/useLine'
import { useArrow } from './useArrow/useArrow'
import { useRectangle } from './useRectangle/useRectangle'
import { useCrop } from './useCrop/useCrop'
import { useBackground } from './useBackground/useBackground'
import { useTextarea } from './useTextarea/useTextarea'

export interface Options {
  background?: Blob | Promise<Blob>
}

export function useAllTools(options?: Options) {
  const tools = [useFreehand(), useLine(), useArrow(), useRectangle(), useTextarea(), useCrop()]
  if (options?.background) {
    return { tools: [useBackground({ blob: options?.background }), ...tools] }
  }
  return { tools }
}
