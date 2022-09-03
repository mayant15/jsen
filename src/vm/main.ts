import { createAddInstr, createPushInstr, createSubInstr, EIRValueType, Program } from '../common/ir'
import { logger } from '../common/logger'
import { VM } from './vm'

const TEST_PROGRAMS: Program[] = [
    // ADD
    [
        createPushInstr({
            kind: EIRValueType.NUMBER,
            data: 2,
        }),
        createPushInstr({
            kind: EIRValueType.NUMBER,
            data: 1,
        }),
        createAddInstr(),
    ],

    // SUB
    [
        createPushInstr({
            kind: EIRValueType.NUMBER,
            data: 2,
        }),
        createPushInstr({
            kind: EIRValueType.NUMBER,
            data: 1,
        }),
        createSubInstr(),
    ]
]

async function main() {
    for (const program of TEST_PROGRAMS) {
        const context = new VM(program)
        const result = context.run()
        logger.info(`[driver] Result: `, result)
    }
}

main()
    .catch(e => logger.error(e))

