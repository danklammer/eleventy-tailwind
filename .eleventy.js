const { DateTime } = require('luxon');
const { PurgeCSS } = require('purgecss');
const htmlmin = require('html-minifier');
const terser = require('terser');

module.exports = function (eleventyConfig) {
  
  // Get Year. Usage: {% year %}
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);
  
  // Date helpers
  eleventyConfig.addFilter('readableDate', dateObj => {
    return DateTime.fromJSDate(dateObj, {
      zone: 'utc'
    }).toFormat('LLLL d, y');
  });
  eleventyConfig.addFilter('htmlDate', dateObj => {
    return DateTime.fromJSDate(dateObj, {
      zone: 'utc'
    }).toFormat('y-MM-dd');
  });

  // Static assets to pass through
  eleventyConfig.addPassthroughCopy("./src/favicon.png");
  eleventyConfig.addPassthroughCopy("./src/img");
  eleventyConfig.addPassthroughCopy('./src/robots.txt');
  
  // When Production Inline CSS and Purge any style not used on that page
  eleventyConfig.addTransform('inline-and-purge-css', async (content, outputPath) => {
    if (process.env.ELEVENTY_ENV !== 'production' || !outputPath.endsWith('.html')) {
      return content;
    }
    let purgeCSSResults = await new PurgeCSS().purge({
      content: [{ raw: content }],
      defaultExtractor: content => content.match(/[\w-!#:(),_./\[\]]+(?<!:)/g) || [],
      css: ['./_site/styles.css'],
      keyframes: true,
    });
    return content.replace('<!-- INLINE CSS-->', '<style>' + purgeCSSResults[0].css + '</style>');
  });
  
  // Minify and Inline JS
  eleventyConfig.addNunjucksAsyncFilter("jsmin", async function (code, callback) {
    try {
      const minified = await terser.minify(code);
      return callback(null, minified.code);
    } catch (err) {
      console.error("Error during terser minify:", err);
      return callback(err, code);
    }
  });
  
  // When Production, Minify HTML
  eleventyConfig.addTransform('htmlmin', function (content, outputPath) {
    if (process.env.ELEVENTY_ENV && outputPath && outputPath.endsWith('.html')) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      })
      return minified;
    }
    return content;
  });

  return  {
    dir: {
      input: "src",
      layouts: "_layouts",
      includes: "_includes",
      output: "_site"
    },
    passthroughFileCopy: true,
    templateFormats : ["njk", "md"],
    htmlTemplateEngine : "njk",
    markdownTemplateEngine : "njk",
  };

}
