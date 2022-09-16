import { ParseResult } from "@babel/parser";
import type * as Babel from "@babel/types"
import { logger } from "../common/logger";

export namespace Ast {
    export type MainNode = {
        body: StatementNode[]
    }

    export type BinaryExpression = {
        type: 'BinaryExpression'
        left: Expression
        right: Expression
        operator: '+' | '-' | '*' | '/'
    }

    export type NumericLiteralExpression = {
        type: 'NumericLiteral'
        value: number
    }

    export type StringLiteralExpression = {
        type: 'StringLiteral'
        value: string
    }

    export type Expression = BinaryExpression | NumericLiteralExpression | StringLiteralExpression

    export type ExpressionNode = {
        type: 'ExpressionStatement'
        expression: Expression
    }

    export type StatementNode = ExpressionNode
}

function visitMain(node: Babel.Program): Ast.MainNode {
    return {
        body: node.body.map(visitStatement)
    }
}

function visitStatement(node: Babel.Statement): Ast.StatementNode {
    if (node.type === 'ExpressionStatement') {
        return visitExpressionStatement(node)
    } else {
        throw Error(`[compiler] ParserError: Unsupported statement type ${node.type}`)
    }
}

function visitExpressionStatement(node: Babel.ExpressionStatement): Ast.ExpressionNode {
    return {
        type: 'ExpressionStatement',
        expression: visitExpression(node.expression)
    }
}

function visitExpression(node: Babel.Expression): Ast.Expression {
    switch (node.type) {
        case 'NumericLiteral':
            return {
                type: 'NumericLiteral',
                value: node.value
            }
        case 'StringLiteral':
            return {
                type: 'StringLiteral',
                value: node.value
            }
        case 'BinaryExpression':
            if (node.left.type === 'PrivateName') {
                throw Error('[compiler] ParserError: Unsupported LHS `PrivateName`')
            }
            return {
                type: 'BinaryExpression',
                left: visitExpression(node.left),
                right: visitExpression(node.right),
                operator: node.operator as any // TODO: I don't want to support all operators right now
            }
        default:
            throw Error(`[compiler] ParserError: Unsupported expression type ${node.type}`)
    }
}

export const toAst = (parsed: ParseResult<Babel.File>): Ast.MainNode => {
    // logger.info(JSON.stringify(parsed.program, null, 2))
    const ast = visitMain(parsed.program)
    logger.info(JSON.stringify(ast, null, 2))
    return ast
}

