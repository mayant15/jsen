import { describe, it, expect } from '@jest/globals'
import { AsmValue, EAsmValueType } from '../common/asm'
import { compile } from '../compiler/compiler'
import { VM } from '../vm/vm'

function compileAndExecute(code: string): AsmValue {
    const program = compile(code)
    const context = new VM(program)
    const result = context.run()
    return result
}

describe('math', () => {
    describe('add', () => {
        describe('literals', () => {
            it('should add two numbers', () => {
                const { kind, data } = compileAndExecute('1 + 2')
                expect(kind).toBe(EAsmValueType.NUMBER)
                expect(data).toBe(3)
            })

            it('should add two strings', () => {
                const { kind, data } = compileAndExecute('"ab" + "cd"')
                expect(kind).toBe(EAsmValueType.STRING)
                expect(data).toBe("abcd")
            })
        })
    })

    describe('sub', () => {
        describe('literals', () => {
            it('should subtract two numbers', () => {
                const { kind, data } = compileAndExecute('1 - 2')
                expect(kind).toBe(EAsmValueType.NUMBER)
                expect(data).toBe(-1)
            })
        })
    })
})

