import { format, parse } from "fecha";
import RSS from "rss";
import { loadBlogPosts } from "../../../utils/blog";

const feedOptions = {
  title: "Jacob Ebey's blog",
  description: "Welcome to my blog",
  feed_url: "https://www.ebey.me/api/blog/rss",
  site_url: "https://www.ebey.me",
  managingEditor: "Jacob Ebey",
  webMaster: "Jacob Ebey",
  copyright: "2021 Jacob Ebey",
  language: "en",
  categories: ["Technology", "Web Development"],
};

export default async function handler(req, res) {
  try {
    const blogPosts = await loadBlogPosts();
    const feed = new RSS(feedOptions);

    blogPosts.forEach((post) => {
      const date = format(parse(post.data.date, "YY-MM-DD"), "MMMM D, YYYY");
      feed.item({
        title: post.data.title,
        description: post.data.description,
        url: `https://www.ebey.me/blog/${post.data.slug}`,
        categories: ["Technology", "Web Development"],
        date,
      });
    });
    const xml = feed.xml();
    res.setHeader("content-type", "application/rss+xml");
    res.status(200).send(xml);
  } catch (err) {
    res.status(500).send("Internal server error");
    console.error(err);
  }
}
