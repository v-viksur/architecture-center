const os = require('os');
const path = require('path');
const fs = require('fs');
const yamlFront = require('yaml-front-matter');
const lec = require('line-ending-corrector').LineEndingCorrector.correctSync;

module.exports.load = ymlFilePath => {
    var dataPath = path.resolve(__dirname, ymlFilePath);
    try {
        var content = fs.readFileSync(dataPath, 'utf8');
        return yamlFront.loadFront(content);
    }
    catch (e) {
        console.dir(e);
        return {};
    }
}

module.exports.dump = (yml, original, filePath) => {
    var updated = lec('---' + os.EOL + yamlFront.dump(yml) + '---' + original, { eolc: 'CRLF' });
    fs.writeFileSync(filePath, updated[1]);
}