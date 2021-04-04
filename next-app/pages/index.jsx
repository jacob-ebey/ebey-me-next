import Head from "next/head";
import Link from "next/link";
import { format, parse } from "fecha";

import { loadBlogPosts } from "../utils/blog";

import Container from "../components/container";
import CountAPI from "../components/count-api";
import Header from "../components/header";

export const config = {
  unstable_runtimeJS: false,
};

export default function Home({ posts }) {
  return (
    <>
      <Head>
        <title>Jacob Ebey's blog</title>
        <meta name="description" content="Welcome to my blog" />
      </Head>

      <CountAPI />

      <Header />

      <Container tag="main">
        <ul>
          {posts.map((post) => (
            <li key={post.slug} className="mb-4 md:mb-2">
              <span className="block text-sm font-light text-gray-500 md:inline-block md:text-base md:text-right md:pr-3 md:w-40">
                {post.date}
              </span>
              <Link href={`/blog/${post.slug}`}>
                <a className="inline-block font-semibold text-indigo-600 transition-colors duration-200 ease-in-out md:p-2 hover:bg-gray-200">
                  {post.title}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}

export async function getStaticProps() {
  const blogPosts = await loadBlogPosts();

  const posts = blogPosts.map((post) => {
    const date = format(parse(post.data.date, "YY-MM-DD"), "MMMM D, YYYY");
    return {
      date,
      title: post.data.title,
      slug: post.data.slug,
    };
  });

  const props = {
    posts,
  };

  return {
    props,
  };
}
