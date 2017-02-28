const path = require('path');
const fs = require('fs');

module.exports = folder => {
    const articleRE = /^(#+) \[([a-zA-Z'-\s\(\)]*)\]\(([\.\/a-zA-Z-]*)\)/igm;

    const tocPath = path.resolve(folder, `toc.md`);
    const content = fs.readFileSync(tocPath, 'utf8');

    var output = [];

    // extract the main articles from the TOC
    var result;

    while ((result = articleRE.exec(content)) !== null) {
        output.push({
            title: result[2].trim(),
            filePath: result[3],
            level: result[1].length
        });
    }

    return output;
}