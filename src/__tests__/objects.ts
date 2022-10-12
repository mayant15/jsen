
import { describe, it, expect } from '@jest/globals'
import { EAsmValueType } from '../common/asm'
import { compileAndExecute } from '../wrapper'

describe('objects', () => {
    describe('object literals', () => {
        it('should handle numeric literal properties', () => {
            const { kind, data } = compileAndExecute(`
                const obj = { x: 42 }
                obj.x
            `)
            expect(kind).toBe(EAsmValueType.NUMBER)
            expect(data).toBe(42)
        })
    })
})

