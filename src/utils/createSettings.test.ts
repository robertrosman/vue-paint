import { useLine } from "@/composables/tools/useLine/useLine";
import { createSettings } from "./createSettings";
import { describe, expect, it } from "vitest";
import { useBackground } from "@/composables/tools/useBackground/useBackground";


describe('createSettings', () => {
    it('should return defaultSettings', () => {
        const settings = createSettings([])
        expect(settings.value.color).toBe("#c82d2d")
    })

    it('should pick the first usable tool', () => {
        const settings = createSettings([useBackground({blob: new Blob()}), useLine()])
        expect(settings.value.tool).toBe("line")
    })
})