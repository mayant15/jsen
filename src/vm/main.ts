import { Program } from '../common/asm'
import { logger } from '../common/logger'
import { VM } from './vm'

const TEST_PROGRAMS: Program[] = []

async function main() {
    for (const program of TEST_PROGRAMS) {
        const context = new VM(program)
        const result = context.run()
        logger.info(`[driver] Result: `, result)
    }
}

main()
    .catch(e => logger.error(e))

