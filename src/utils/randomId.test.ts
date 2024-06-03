import { randomId } from "@/utils/randomId";
import { describe, expect, it } from "vitest";


describe('randomId', () => {
    it('should return a string', () => {
        const id = randomId()
        expect(typeof id).toBe('string')
    })

    it('should return the lowest possible id (beginning with a letter)', () => {
        const id = randomId(() => 0)
        expect(id).toBe('a000000')
    })

    it('should return the lowest possible id (beginning with a letter)', () => {
        const id = randomId(() => 0.9999999999)
        expect(id).toBe('zzzzzzz')
    })
})