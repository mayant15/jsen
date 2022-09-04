import { ParseResult } from "@babel/parser";
import type { File } from "@babel/types"
import { logger } from "../common/logger";

export const toAst = (parsed: ParseResult<File>) => {
    logger.warn('TODO: Implement parsed to ast')
    logger.info(parsed)
    return parsed
}

