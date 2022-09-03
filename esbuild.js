const esbuild = require('esbuild');

esbuild.build({
    entryPoints: ['src/compiler/main.ts', 'src/vm/main.ts'],
    bundle: true,
    outdir: './dist',
    format: 'cjs',
    platform: 'node',
})

