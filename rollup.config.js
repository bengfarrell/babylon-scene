module.exports = {
    input: 'src/babylonscene.js',
    inlineDynamicImports: true,
    output: {
        file: 'babylonscene.nobabylon.js',
        format: 'iife',
        name: 'babylonscene',
        sourcemap: true
    }
};
