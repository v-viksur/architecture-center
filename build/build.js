const path = require('path');
const loadYamlFrom = require('./yaml').load;

const series = require('./series');
const landingPages = require('./landingPages');
const patternCategories = require('./patterns/categories');

const docsetPath = path.resolve(__dirname, '../docs');

// // render landing pages
// landingPages(docsetPath, 'index');

landingPages(path.resolve(docsetPath, 'blueprints'), 'index', model => {
    model.series.forEach(x => {
        x.articles = [];
        model.articles.forEach(article => {
            if (article['pnp.series.title'] === x.title &&
                article.level == 2) {
                article.cardTitle = article['pnp.cardTitle'];
                x.articles.push(article);
            }
        });
    });
}).then(model => {
    model.series.forEach(x => series(model.__path, x));
});

// landingPages(path.resolve(docsetPath, 'patterns'), 'index')
//     .then(patternCategories);

// // load the series metadata
// // and apply navigation and titles
// loadYamlFrom(path.resolve(docsetPath, 'series.yml'))
//     .forEach(x => series(docsetPath, x));
