import Head from "next/head";
import Link from "next/link";

export default function Header() {
  return (
    <>
      <Head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title="RSS Feed for Jacob Ebey's blog"
          href="https://www.ebey.me/api/blog/rss"
        />
      </Head>
      <header className="flex flex-wrap max-w-2xl px-4 py-4 mx-auto mb-4">
        <Link href="/">
          <a className="inline-flex items-center p-2 hover:bg-yellow-100">
            <svg className="inline-block w-5 h-5 mr-3 bg-black">
              <path d="M0 0h19v19H0z" />
            </svg>
            <span className="text-lg font-semibold">ebey.me</span>
          </a>
        </Link>

        <nav className="inline-flex items-center justify-end flex-grow">
          <a
            className="p-2 mr-2 text-xs font-semibold text-gray-700"
            href="https://github.com/jacob-ebey/ebey-me"
          >
            Source
          </a>
          <a
            href="https://twitter.com/ebey_jacob"
            className="p-2 text-xs font-semibold text-white bg-black"
          >
            Follow Me
          </a>
        </nav>
      </header>
    </>
  );
}
