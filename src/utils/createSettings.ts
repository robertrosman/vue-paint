import type { Settings, Tool } from "@/types";
import { ref, type Ref } from "vue";

export const defaultSettings: Settings = {
  tool: 'freehand',
  thickness: 5,
  color: '#c82d2d',
  angleSnap: false
}

/** Use this function to create your settings ref. It will use the default settings as a base and merge in the settings you provide. */
export function createSettings<Tools extends Tool<any>[]>(tools: Tools, settings: Partial<Settings> = {}): Ref<Settings> {
    // TODO: let the tools declare what settings they need, and merge them in here
    const usableTool = tools.find(t => t.icon)
    return ref(Object.assign(
        {},
        defaultSettings,
        { tool: usableTool?.type ?? 'freehand'},
        settings
    ))
}