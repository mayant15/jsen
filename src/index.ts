import fs from 'fs/promises'
import { logger } from './logger'

async function main() {
    const inputPath = process.argv[2]
    if (!inputPath) {
        throw Error("No input file provided")
    }

    const code = await fs.readFile(inputPath, {
        encoding: 'utf8'
    })
    logger.info(code)
}

main()
    .catch(e => logger.error(e))

