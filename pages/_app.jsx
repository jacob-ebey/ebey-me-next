import Head from "next/head";

import "tailwindcss/tailwind.css";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Jacob Ebey's blog</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
