import { randomId } from "@/utils/randomId";
import { afterEach, describe, expect, it, vi } from "vitest";


describe('randomId', () => {
    afterEach(() => {
        vi.resetAllMocks()
    })
    it('should return a string', () => {
        const id = randomId()
        expect(typeof id).toBe('string')
    })

    it('should return the lowest possible id (beginning with a letter)', () => {
        Math.random = vi.fn().mockReturnValue(0)
        const id = randomId()
        expect(id).toBe('a000000')
    })

    it('should return the lowest possible id (beginning with a letter)', () => {
        Math.random = vi.fn().mockReturnValue(0.9999999999)
        const id = randomId()
        expect(id).toBe('zzzzzzz')
    })
})