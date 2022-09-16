import fs from 'fs/promises'
import { Program } from '../common/asm'
import { logger } from '../common/logger'
import { VM } from './vm'

async function main() {
    const inputPath = process.argv[2]
    if (!inputPath) {
        throw Error("No input file provided")
    }

    const inputFile = await fs.readFile(inputPath, {
        encoding: 'utf8'
    })
    const program: Program = JSON.parse(inputFile)

    const context = new VM(program)
    const result = context.run()
    logger.info(`[driver] Result: `, result)
}

main()
    .catch(e => logger.error(e))

