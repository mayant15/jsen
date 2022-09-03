import fs from 'fs/promises'

async function main() {
    const inputPath = process.argv[2]
    const code = await fs.readFile(inputPath, {
        encoding: 'utf8'
    })
    console.log(code)
}

main()

