import { AsmValue, createAddInstr, createDivInstr, createMulInstr, createPushInstr, createSubInstr, EAsmValueType, Program } from "../common/asm"
import { Ast } from "./ast"

enum ESymbolKind {
    LITERAL,
    ALIAS,
    UNINITIALIZED,
}

type LiteralSymbolInfo = {
    kind: ESymbolKind.LITERAL
    isConstant: boolean
    isLiteral: true
    value: AsmValue
}

type AliasSymbolInfo = {
    kind: ESymbolKind.ALIAS
    isConstant: boolean
    isLiteral: false
    name: string
}

type UninitializedSymbolInfo = {
    kind: ESymbolKind.UNINITIALIZED
}

type SymbolInfo = AliasSymbolInfo | LiteralSymbolInfo | UninitializedSymbolInfo

type SymbolTable = Record<string, SymbolInfo>

class AsmGenVisitor {
    private _symbolTable: SymbolTable
    private _context: Program

    constructor() {
        this._symbolTable = {}
        this._context = {
            instrs: [],
            labels: {}
        }
    }

    visitMain(node: Ast.MainNode): Program {
        for (const statement of node.body) {
            // TODO: Don't mutate context (?)
            this._visitStatement(statement)
        }

        return this._context
    }

    private _visitStatement(node: Ast.StatementNode) {
        switch (node.type) {
            case "ExpressionStatement":
                this._visitExpressionStatement(node)
                break
            case 'VariableDeclaration':
                this._visitVariableDeclaration(node)
                break
            default:
                // @ts-ignore
                throw Error(`[compiler] unsupported statement type ${node.type}`)
        }
    }

    private _visitExpressionStatement(node: Ast.ExpressionNode) {
        this._visitExpression(node.expression)
    }

    private _visitExpression(expr: Ast.Expression) {
        switch (expr.type) {
            case "BinaryExpression":
                this._visitBinaryExpression(expr)
                break
            case 'NumericLiteral':
                this._visitNumericLiteralExpression(expr)
                break
            case 'StringLiteral':
                this._visitStringLiteralExpression(expr)
                break
            case 'Identifier':
                this._visitIdentifierExpression(expr)
                break
            default:
                // @ts-ignore
                throw Error(`[compiler] unsupported expression type ${expr.type}`)
        }
    }

    private _visitIdentifierExpression(expr: Ast.IdentifierExpression) {
        // TODO: How is this even going to work? Push the contained value to the stack? Just handle literals for now
        if (expr.id in this._symbolTable) {
            const info = this._symbolTable[expr.id]
            switch (info.kind) {
                case ESymbolKind.LITERAL:
                    this._context.instrs.push(createPushInstr(info.value))
                    break
                case ESymbolKind.ALIAS:
                    this._visitIdentifierExpression({
                        type: 'Identifier',
                        id: expr.id,
                    })
                    break
                default:
                    throw Error(`[compiler] unsupported symbol kind ${info.kind}`)
            }
        } else {
            throw Error(`[compiler] Undefined reference to "${expr.id}"`)
        }
    }

    private _visitNumericLiteralExpression(expr: Ast.NumericLiteralExpression) {
        this._context.instrs.push(createPushInstr({
            kind: EAsmValueType.NUMBER,
            data: expr.value
        }))
    }

    private _visitStringLiteralExpression(expr: Ast.StringLiteralExpression) {

        this._context.instrs.push(createPushInstr({
            kind: EAsmValueType.STRING,
            data: expr.value
        }))
    }

    private _visitBinaryExpression(expr: Ast.BinaryExpression) {
        // Emit right instruction first for SUB and DIV
        this._visitExpression(expr.right)

        // Emit left instruction next
        this._visitExpression(expr.left)

        // Emit operator
        switch (expr.operator) {
            case "+":
                this._context.instrs.push(createAddInstr())
                break
            case "-":
                this._context.instrs.push(createSubInstr())
                break
            case "*":
                this._context.instrs.push(createMulInstr())
                break
            case "/":
                this._context.instrs.push(createDivInstr())
                break
            default:
                throw Error(`[compiler] unsupported operator ${expr.operator}`)
        }
    }

    private _visitVariableDeclaration(node: Ast.VariableDeclarationNode) {
        if (node.id in this._symbolTable) {
            throw Error(`[compiler] SyntaxError: Redeclaration of variable ${node.id}`)
        }

        if (node.init) {
            switch (node.init.type) {
                case "Identifier":
                    this._symbolTable[node.id] = {
                        kind: ESymbolKind.ALIAS,
                        isConstant: node.isConst,
                        isLiteral: false,
                        name: node.init.id
                    }
                    break
                case 'StringLiteral':
                    this._symbolTable[node.id] = {
                        kind: ESymbolKind.LITERAL,
                        isConstant: node.isConst,
                        isLiteral: true,
                        value: {
                            kind: EAsmValueType.STRING,
                            data: node.init.value
                        }
                    }
                    break
                case 'NumericLiteral':
                    this._symbolTable[node.id] = {
                        kind: ESymbolKind.LITERAL,
                        isConstant: node.isConst,
                        isLiteral: true,
                        value: {
                            kind: EAsmValueType.NUMBER,
                            data: node.init.value
                        }
                    }
                    break
            }
        } else {
            if (node.isConst) {
                throw Error(`[compiler] SyntaxError: const variables must be initialized`)
            } else {
                this._symbolTable[node.id] = {
                    kind: ESymbolKind.UNINITIALIZED,
                }
            }
        }
    }
}

export const toAsmProgram = (ast: Ast.MainNode): Program => {
    const generator = new AsmGenVisitor()
    return generator.visitMain(ast)
}

