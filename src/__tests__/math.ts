import { describe, it, expect } from '@jest/globals'
import { EAsmValueType } from '../common/asm'
import { compileAndExecute } from '../wrapper'

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

    describe('div', () => {
        describe('literals', () => {
            it('should divide two numbers', () => {
                const { kind, data } = compileAndExecute('1 / 2')
                expect(kind).toBe(EAsmValueType.NUMBER)
                expect(data).toBe(0.5)
            })
        })
    })

    describe('mul', () => {
        describe('literals', () => {
            it('should multiply two numbers', () => {
                const { kind, data } = compileAndExecute('2 * 3')
                expect(kind).toBe(EAsmValueType.NUMBER)
                expect(data).toBe(6)
            })
        })
    })
})

