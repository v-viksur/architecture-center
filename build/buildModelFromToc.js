const path = require('path');
const toc = require('./toc');
const loadYamlFrom = require('./yaml').load;

function adorn(model) {
    var articles = model.articles
        .filter(article => article.level === model.navigation);

    articles
        .forEach((article, i) => {
            var prevIndex = i - 1;
            var nextIndex = i + 1;
            if (prevIndex >= 0) {
                article.prev = articles[prevIndex].url;
            }
            if (nextIndex < articles.length) {
                article.next = articles[nextIndex].url;
            }
        });
}

function resolveUrl(url) {
    return url.replace('.md', '').replace('./', '');
}

function getArticleByFile(file) {
    return this.articles.find(x => (x.filePath.indexOf(file) >= 0));
}

module.exports = (model, docPath) => {

    function createArticleModel(model) {
        var yml = loadYamlFrom(path.resolve(docPath, model.filePath));
        Object.assign(model, yml);
        model.url = resolveUrl(model.filePath);
        model.filePath = model.filePath.replace('./', '');
        return model;
    }

    model.__path = docPath;
    model.getArticleByFile = getArticleByFile;

    if (!model.articles) {
        // TODO: log this
        model.articles = [];
        model.articles = toc(docPath).map(createArticleModel);
    }

    if (!!model.navigation) {
        adorn(model);
    }

    return model;
}