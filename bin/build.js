const concat = require('concat-files');
const copy = require('copy');

concat([
    'babylonscene.nobabylon.js',
    'node_modules/babylonjs/babylon.js'
], 'babylonscene.full.js', function(err) {
    if (err) throw err;
    console.log('done');
});


function copyIndividualFiles() {
    copy.each(['babylonscene.nobabylon.js', 'babylonscene.full.js', 'babylonscene.js'], 'docs/build', function(err, files) {
        if (err) throw err;
        next(currentStep++);
    });
}

function copyDirectories() {
    copy(['./src/**'], 'docs/build', function(err, files) {
        if (err) throw err;
        next(currentStep++);
    });
}
