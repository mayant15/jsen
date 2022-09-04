import { Program } from "../common/asm"
import { logger } from "../common/logger"

export const toAsmProgram = (ast: unknown): Program => {
    logger.warn("TODO: Implement AST to AsmProgram")
    logger.info(ast)
    return {
        instrs: [],
        labels: {}
    }
}

