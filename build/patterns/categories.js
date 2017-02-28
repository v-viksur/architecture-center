const path = require('path');
const fs = require('fs');
const Liquid = require('shopify-liquid');

const engine = Liquid({
    root: path.resolve(__dirname, 'templates'),
    extname: '.liquid'
});

var template = engine.parse("{%- include 'category-index' -%}");

module.exports = model => {

    var categories = model.categories;
    var patterns = model.articles.filter(x => !!x['pnp.pattern.categories']);

    // associate individual patterns with categories using their metadata
    categories.forEach(c => {
        c.patterns = patterns.filter(p => p['pnp.pattern.categories'].includes(c.url));
    });

    categories.forEach(c => {
        var outputhPath = path.resolve(model.__path, 'category', `${c.url}.md`);
        engine.render(template, c)
            .then(markdown => { fs.writeFile(outputhPath, markdown); });
    });
};