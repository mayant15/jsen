import { createAddInstr, createPushInstr, createSubInstr, EIRValueType } from '../common/ir'
import { VM } from './vm'
import { describe, it, expect } from '@jest/globals'

describe('vm', () => {
    describe('ADD', () => {
        it('should return 1 + 2 = 3', () => {
            const vm = new VM([
                createPushInstr({
                    kind: EIRValueType.NUMBER,
                    data: 2,
                }),
                createPushInstr({
                    kind: EIRValueType.NUMBER,
                    data: 1,
                }),
                createAddInstr(),
            ])
            const { data } = vm.run()
            expect(data).toBe(3)
        })

        it("should return 'ab' + 'cd' = 'abcd'", () => {
            const vm = new VM([
                createPushInstr({
                    kind: EIRValueType.STRING,
                    data: 'cd',
                }),
                createPushInstr({
                    kind: EIRValueType.STRING,
                    data: 'ab',
                }),
                createAddInstr(),
            ])
            const { data } = vm.run()
            expect(data).toBe('abcd')
        })
    })

    describe('SUB', () => {
        it('should return 1 - 2 = -1', () => {
            const vm = new VM([
                createPushInstr({
                    kind: EIRValueType.NUMBER,
                    data: 2,
                }),
                createPushInstr({
                    kind: EIRValueType.NUMBER,
                    data: 1,
                }),
                createSubInstr(),
            ])
            const { data } = vm.run()
            expect(data).toBe(-1)
        })
    })
})

