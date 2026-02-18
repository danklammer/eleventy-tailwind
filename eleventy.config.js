import { DateTime } from "luxon";
import { execSync } from "child_process";
import fs from "fs";
import { minify as htmlMinify } from "html-minifier-terser";
import { minify as jsMinify } from "terser";

export default function (eleventyConfig) {
  // Get Year: {% year %}
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  // Date helper: {{ page.date | readableDate }}
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("LLLL d, y");
  });

  // Date helper: {{ page.date | htmlDate }}
  eleventyConfig.addFilter("htmlDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("y-MM-dd");
  });

  // Static assets to pass through
  eleventyConfig.addPassthroughCopy("./src/favicon.png");
  eleventyConfig.addPassthroughCopy("./src/img");
  eleventyConfig.addPassthroughCopy("./src/robots.txt");

  // Inline Tailwind CSS
  eleventyConfig.addTransform("inlineCSS", function (content, outputPath) {
    if (
      process.env.ELEVENTY_ENV === "production" &&
      outputPath &&
      outputPath.endsWith(".html")
    ) {
      fs.writeFileSync("temp.html", content);
      execSync(
        "npx @tailwindcss/cli -i ./src/_includes/css/styles.css -o temp.css --minify",
      );
      const css = fs.readFileSync("temp.css", "utf8");
      fs.unlinkSync("temp.html");
      fs.unlinkSync("temp.css");
      return content.replace(`<!-- INLINE CSS -->`, `<style>${css}</style>`);
    }
    return content;
  });

  // Minify and Inline JS
  eleventyConfig.addLiquidShortcode("asyncJsMinify", async function (code) {
    try {
      const minified = await jsMinify(code);
      return minified.code;
    } catch (err) {
      console.error("JS minification error:", err);
      return code; // Return original code if there's an error
    }
  });

  // HTML Minification for production
  eleventyConfig.addTransform("htmlmin", async function (content, outputPath) {
    if (
      process.env.ELEVENTY_ENV === "production" &&
      outputPath &&
      outputPath.endsWith(".html")
    ) {
      try {
        const minified = await htmlMinify(content, {
          collapseWhitespace: true,
          removeComments: true,
          useShortDoctype: true,
          minifyJS: true,
          minifyCSS: true,
        });
        return minified;
      } catch (err) {
        console.error("HTML minification error:", err);
        return content;
      }
    }
    return content;
  });

  return {
    dir: {
      input: "src",
      layouts: "_layouts",
      includes: "_includes",
      output: "_site",
    },
    passthroughFileCopy: true,
    templateFormats: ["liquid", "md"],
    htmlTemplateEngine: "liquid",
    markdownTemplateEngine: "liquid",
  };
}
