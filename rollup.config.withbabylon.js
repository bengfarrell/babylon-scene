module.exports = {
    input: 'src/babylonscene.js',
    inlineDynamicImports: true,
    output: {
        file: 'babylonscene.full.js',
        format: 'iife',
        name: 'babylonscene',
        sourcemap: true
    }
};
