'use strict';

var madge = require('madge');
var sha1 = require('sha-1');
var cherow = require('cherow');

function Dependo(targetPath, options) {
    var ast = {};
    this.config = options || {};
    this.config.onParseFile = function(file) {
        var filename = file.filename;
        var src = file.src;
        ast[filename] = src;
    }
    this.basePath = options.basePath;
    this.config.format = String(options.format || 'amd').toLowerCase();
    this.config.exclude = options.exclude || null;
    this.identification = sha1(targetPath + JSON.stringify(this.config)) || ~~(Math.random()*999999999);
    this.title = options.title || 'dependo';

    if (this.config.format==='json') {
        this.dependencies = this.config.directDeps;
    } else {
        this.dependencies = madge(targetPath, this.config).tree;
    }

    if (this.config.transform && typeof (this.config.transform) == 'function') {
        this.dependencies = this.config.transform(this.dependencies);
    }
    this.ast = ast;

}

Dependo.prototype.generateHtml = function () {
    return require('./html').output(this.basePath, this.dependencies, this.identification, this.title, this.ast);
};

module.exports = Dependo;
