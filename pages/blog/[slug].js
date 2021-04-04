import Head from "next/head";
import hydrate from "next-mdx-remote/hydrate";
import renderToString from "next-mdx-remote/render-to-string";
import { format, parse } from "fecha";

import { loadBlogPost, loadBlogPosts } from "../../utils/blog";

import Container from "../../components/container";
import Header from "../../components/header";
import components from "../../components/mdx-components";

export const config = {
  unstable_runtimeJS: false,
};

function countCallback(r) {
  var e = document.getElementById("view-count");
  if (r && r.value && e) {
    e.innerText = String(r.value) + " views";
  }
}

export default function Blog({ post, mdxSource }) {
  const content = hydrate(mdxSource, { components });

  return (
    <>
      <Head>
        <title>{post.title}</title>
        <meta name="description" content={post.title} />

        <script
          dangerouslySetInnerHTML={{
            __html: countCallback.toString(),
          }}
        />

        <script
          async
          src={`https://api.countapi.xyz/hit/ebey-me/${post.slug}?callback=${countCallback.name}`}
        />
      </Head>

      <Header />

      <Container tag="article">
        <main>
          <h1 className="font-semibold text-3xl mb-1">{post.title}</h1>
          <nav className="flex flex-wrap items-center text-sm text-gray-700 mb-6">
            <a
              className="inline-flex items-center"
              href="https://twitter.com/ebey_jacob"
              aria-label="Check me out on twitter"
            >
              <img
                className="mr-2 w-6 h-6 rounded-full"
                src="https://pbs.twimg.com/profile_images/1253463555388530689/TWhkn5IZ_x96.jpg"
              />
              <span>ebey_jacob</span>
            </a>
            <span className="text-lg mx-4 text-gray-400 font-thin">/</span>
            <span className="mr-2 flex-grow hidden md:inline">{post.date}</span>
            <span id="view-count"></span>
          </nav>
        </main>

        {content}
      </Container>
    </>
  );
}

export async function getStaticPaths() {
  const posts = await loadBlogPosts();

  return {
    fallback: false,
    paths: posts.map((post) => ({
      params: {
        slug: post.data.slug,
      },
    })),
  };
}

export async function getStaticProps({ params }) {
  const blogPost = await loadBlogPost(params.slug);

  const mdxSource = await renderToString(blogPost.content, { components });

  const date = format(parse(blogPost.data.date, "YY-MM-DD"), "MMMM D, YYYY");

  return {
    props: {
      mdxSource,
      post: {
        date,
        title: blogPost.data.title,
        slug: blogPost.data.slug,
      },
    },
  };
}
