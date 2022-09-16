import { ParseResult } from "@babel/parser";
import type * as Babel from "@babel/types"

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

    export type IdentifierExpression = {
        type: 'Identifier'
        id: string
    }

    export type Expression = BinaryExpression | NumericLiteralExpression | StringLiteralExpression | IdentifierExpression

    export type ExpressionNode = {
        type: 'ExpressionStatement'
        expression: Expression
    }

    export type VariableDeclarationNode = {
        type: 'VariableDeclaration'
        id: string
        isConst: boolean
        init: Expression | null
    }

    export type StatementNode = ExpressionNode | VariableDeclarationNode
}

function visitMain(node: Babel.Program): Ast.MainNode {
    return {
        body: node.body.flatMap(visitStatement)
    }
}

function visitStatement(node: Babel.Statement): Ast.StatementNode[] {
    switch (node.type) {
        case 'ExpressionStatement':
            return [visitExpressionStatement(node)]
        case 'VariableDeclaration':
            return visitVariableDeclaration(node)
        default:
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
        case 'Identifier':
            return {
                type: 'Identifier',
                id: node.name
            }
        default:
            throw Error(`[compiler] ParserError: Unsupported expression type ${node.type}`)
    }
}

function visitVariableDeclaration(node: Babel.VariableDeclaration): Ast.VariableDeclarationNode[] {
    const isConst = node.kind === 'const'
    return node.declarations.map((decl): Ast.VariableDeclarationNode => {
        if (decl.id.type !== 'Identifier') {
            throw Error(`[compiler] ParserError: Unsupported assignment, only Identifiers allowed on LHS. Found ${decl.id.type}`)
        }
        return {
            type: 'VariableDeclaration',
            init: decl.init ? visitExpression(decl.init) : null,
            id: decl.id.name,
            isConst,
        }
    })
}

export const toAst = (parsed: ParseResult<Babel.File>): Ast.MainNode => {
    const ast = visitMain(parsed.program)
    return ast
}

