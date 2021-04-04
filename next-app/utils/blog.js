import fs from "fs";
import path from "path";

import matter from "gray-matter";
import yaml from "js-yaml";

const devMode = process.env.NODE_ENV !== "production";

const matterConfig = {
  engines: {
    yaml: (s) => yaml.load(s, { schema: yaml.JSON_SCHEMA }),
  },
};

const blogDir = path.resolve(process.cwd(), "blog");

let blogPostsMapPromise;
export async function loadBlogPost(slug) {
  if (devMode || !blogPostsMapPromise) {
    blogPostsMapPromise = (async () => {
      const blogPosts = await (blogPostsPromise || loadBlogPosts());

      return Object.fromEntries(
        blogPosts.map((blogPost) => [blogPost.data.slug, blogPost])
      );
    })();
  }

  const blogPostsMap = await blogPostsMapPromise;

  return blogPostsMap[slug];
}

let blogPostsPromise;
export function loadBlogPosts() {
  if (devMode || !blogPostsPromise) {
    blogPostsPromise = (async () => {
      const fileNames = await fs.promises.readdir(blogDir);

      const promises = [];
      for (const fileName of fileNames) {
        if (!fileName.endsWith(".mdx")) {
          continue;
        }

        const filePath = path.join(blogDir, fileName);

        promises.push(
          (async () => {
            const fileContents = await fs.promises.readFile(filePath, "utf8");
            const matterResult = matter(fileContents, matterConfig);
            return matterResult;
          })()
        );
      }

      const posts = await Promise.all(promises);

      return posts.sort((a, b) => {
        if (a.date < b.date) {
          return 1;
        } else {
          return -1;
        }
      });
    })();
  }

  return blogPostsPromise;
}
