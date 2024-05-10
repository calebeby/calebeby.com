import djot from "@djot/djot";
import * as lightningcss from "lightningcss";
import { browserslistToTargets } from "lightningcss";
import browserslist from "browserslist";
import { fileURLToPath, pathToFileURL } from "node:url";
import * as fs from "node:fs/promises";
import * as path from "node:path";

const config = (eleventyConfig) => {
  const config = {
    dir: {
      input: "content",
      output: "public",
      layouts: "layouts",
      includes: "includes",
    },
  };

  eleventyConfig.addTemplateFormats("djot");

  eleventyConfig.addExtension("djot", {
    compile: async (inputContent) => {
      const ast = djot.parse(inputContent);
      const output = djot.renderHTML(ast);

      return async () => {
        return output;
      };
    },
  });

  eleventyConfig.setNunjucksEnvironmentOptions({
    throwOnUndefined: true,
  });

  eleventyConfig.addTemplateFormats("css");

  eleventyConfig.addExtension("css", {
    outputFileExtension: "css",
    compile: async (inputContent, inputPath) => {
      /** @type string */
      let output;
      try {
        const bundle = await lightningcss.bundleAsync({
          filename: inputPath,
          code: Buffer.from(inputContent),
          targets: browserslistToTargets(browserslist("last 2 versions")),
          minify: true,
          resolver: {
            async resolve(specifier, originatingFile) {
              const parent = new URL(originatingFile, import.meta.url);
              return fileURLToPath(import.meta.resolve(specifier, parent));
            },
          },
          analyzeDependencies: true,
        });
        output = bundle.code.toString();
        if (bundle.dependencies) {
          const assetsDir = path.join(config.dir.output, "assets");
          await fs.mkdir(assetsDir, { recursive: true });
          for (const dependency of bundle.dependencies) {
            const name = `${dependency.placeholder}-${path.basename(dependency.url)}`;
            output = output.replaceAll(
              dependency.placeholder,
              `/assets/${name}`,
            );
            const fileSrc = new URL(
              dependency.url,
              pathToFileURL(dependency.loc.filePath),
            );
            await fs.copyFile(fileSrc, path.join(assetsDir, name));
          }
        }
      } catch (e) {
        console.dir(e);
        throw e;
      }
      return async () => {
        return output;
      };
    },
  });

  return config;
};
export default config;
