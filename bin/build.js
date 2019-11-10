const concat = require('concat-files');
const copy = require('copy');

concat([
    'babylonscene.nobabylon.js',
    'node_modules/babylonjs/babylon.js'
], 'babylonscene.full.js', function(err) {
    if (err) throw err;

    copyIndividualFiles();
    copyDirectories();
    console.log('done');
});


function copyIndividualFiles() {
    copy.each(['babylonscene.nobabylon.js', 'babylonscene.full.js', 'babylonscene.js'], 'docs/babylon-scene', function(err, files) {
        if (err) throw err;
    });
}

function copyDirectories() {
    copy(['./src/**'], 'docs/babylon-scene/src', function(err, files) {
        if (err) throw err;
    });
}
