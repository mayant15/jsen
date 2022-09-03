import { createAddInstr, createPushInstr, EIRValueType, Program } from '../common/ir'
import { logger } from '../common/logger'
import { VM } from './vm'

const TEST_PROGRAM: Program = [
    createPushInstr({
        kind: EIRValueType.NUMBER,
        data: 2,
    }),
    createPushInstr({
        kind: EIRValueType.NUMBER,
        data: 1,
    }),
    createAddInstr(),
]

async function main() {
    const context = new VM(TEST_PROGRAM)
    const result = context.run()

    logger.info(`[driver] Result: `, result)
}

main()
    .catch(e => logger.error(e))

