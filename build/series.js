const path = require('path');
const fs = require('fs');
const loadYamlFrom = require('./yaml').load;
const dumpYamlTo = require('./yaml').dump;
const buildModelFromToc = require('./buildModelFromToc');

module.exports = (docsetPath, series) => {
    console.log(`series: ${series.path}`);

    var seriesPath = path.resolve(docsetPath, series.path);

    var series = buildModelFromToc(series, seriesPath);

    fs.readdirSync(seriesPath)
        .filter(file => file.substr(-3) === '.md')
        .filter(file => file !== 'toc.md')
        .filter(file => file.indexOf('liquid.') < 0)
        .forEach(file => {
            var filePath = path.resolve(seriesPath, file);
            var yml = loadYamlFrom(filePath);

            var original = yml.__content;
            delete yml.__content;

            var article = series.getArticleByFile(file);
            if (!article) {
                console.warn(`WARN: ${file} not found in ${seriesPath}\\toc.md; possibly the regex?`);
                return;
            }

            if (article.prev) {
                yml['pnp.series.prev'] = article.prev;
            }
            if (article.next) {
                yml['pnp.series.next'] = article.next;
            }
            yml['pnp.series.title'] = series.title;

            dumpYamlTo(yml, original, filePath);
        });

    return series;
}