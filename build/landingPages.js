const path = require('path');
const fs = require('fs');

const Liquid = require('shopify-liquid');
const loadYamlFrom = require('./yaml').load;
const buildModelFromToc = require('./buildModelFromToc');

const engine = Liquid({
    root: path.resolve(__dirname, 'templates'),
    epagetname: '.liquid'
});

module.exports = (pagePath, page, modifyModel) => {

    console.log(`landing page: ${page}`);

    var model = buildModelFromToc({}, pagePath);

    var dataPath = path.resolve(pagePath, `${page}.yml`);
    var templatePath = path.resolve(pagePath, `${page}.liquid.md`);
    var outputhPath = path.resolve(pagePath, `${page}.md`);

    var yml = loadYamlFrom(dataPath);
    var template = engine.parse(fs.readFileSync(templatePath, 'utf8'));

    Object.assign(model, yml);

    if (modifyModel) modifyModel(model);

    return engine.render(template, model)
        .then(markdown => fs.writeFile(outputhPath, markdown))
        .then(() => model);
}