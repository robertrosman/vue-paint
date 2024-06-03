import { useFreehand } from './useFreehand/useFreehand'
import { useLine } from './useLine/useLine'
import { useArrow } from './useArrow/useArrow'
import { useRectangle } from './useRectangle/useRectangle'
import { useCrop } from './useCrop/useCrop'
import { useBackground } from './useBackground/useBackground'
import { useTextarea } from './useTextarea/useTextarea'
import { useEraser } from './useEraser/useEraser'
import { useMove, type UseMoveOptions } from './useMove/useMove'

export interface Options extends UseMoveOptions {
  backgroundImage?: Blob | Promise<Blob>
  backgroundColor?: string
}

export function useAllTools(options?: Options) {
  const tools = [useFreehand(), useLine(), useArrow(), useRectangle(), useTextarea(), useCrop(), useEraser(), useMove(options)]
  if (options?.backgroundImage || options?.backgroundColor) {
    return { tools: [useBackground({ blob: options?.backgroundImage, color: options?.backgroundColor }), ...tools] }
  }
  return { tools }
}
