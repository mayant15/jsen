import fs from 'fs/promises'
import { logger } from '../common/logger'
import { compile } from './compiler'

async function main() {
    const inputPath = process.argv[2]
    if (!inputPath) {
        throw Error("No input file provided")
    }

    const code = await fs.readFile(inputPath, {
        encoding: 'utf8'
    })
    logger.info(`[driver] Read code: ${code}`)

    const program = compile(code)
    logger.info(JSON.stringify(program, null, 2))
}

main()
    .catch(e => logger.error(e))

