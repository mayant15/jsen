import fs from 'fs/promises'
import { createAddInstr, createPushInstr, EIRValueType, Program } from './ir'
import { logger } from './logger'
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
    const inputPath = process.argv[2]
    if (!inputPath) {
        throw Error("No input file provided")
    }

    const code = await fs.readFile(inputPath, {
        encoding: 'utf8'
    })
    logger.info(`[driver] Read code: ${code}`)

    const context = new VM(TEST_PROGRAM)
    const result = context.run()

    logger.info(`[driver] Result: `, result)
}

main()
    .catch(e => logger.error(e))

