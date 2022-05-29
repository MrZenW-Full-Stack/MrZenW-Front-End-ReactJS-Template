const authorInfo = `
/**
 * @author MrZenW
 * @email mrzenw@gmail.com
 * @website https://mrzenw.com
 */
`;

function WebpackAuthorPlugin(options) {
  this.options = options;
}

WebpackAuthorPlugin.prototype.apply = function apply(compiler) {
  compiler.hooks.emit.tap('author-plugin', (compilation) => {
    // const options = this.options;
    return new Promise((resolve) => {
      const assets = compilation.assets;
      Object.keys(assets).forEach((e) => {
        if (
          /\.js$/.test(e)
          || /\.jsx$/.test(e)
          || /\.ts$/.test(e)
          || /\.tsx$/.test(e)
        ) {
          let source = assets[e].source();
          source = `${authorInfo}\n\n${source}`;
          compilation.assets[e].source = () => source;
          compilation.assets[e].size = () => source.length;
        }
      });
      resolve();
    });
  });
};

exports.WebpackAuthorPlugin = WebpackAuthorPlugin;
