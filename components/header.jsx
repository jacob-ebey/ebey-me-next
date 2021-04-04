import Link from "next/link";

export default function Header() {
  return (
    <header className="max-w-2xl mx-auto py-4 px-4 mb-4 flex flex-wrap">
      <Link href="/">
        <a className="inline-flex items-center p-2 hover:bg-yellow-100">
          <svg className="inline-block h-5 w-5 bg-black mr-3">
            <path d="M0 0h19v19H0z" />
          </svg>
          <span className="text-lg font-semibold">jacob.me</span>
        </a>
      </Link>

      <nav className="inline-flex items-center flex-grow justify-end">
        <a
          className="mr-2 p-2 text-xs font-semibold text-gray-700"
          href="https://github.com/jacob-ebey/jacob-me"
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
  );
}
