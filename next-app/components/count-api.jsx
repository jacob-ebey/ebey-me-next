import Head from "next/head";

const env = process.env.NODE_ENV || "development";

function dCountCallback() {}

/**
 * Track an identifier via countapi.xyz
 * @param {{
 *  identifier?: string;
 *  countCallback?: (result: {status: number; value?: string}) => void
 * }} param0
 */
export default function CountAPI({
  identifier = "",
  countCallback = dCountCallback,
}) {
  return (
    <Head>
      <script
        dangerouslySetInnerHTML={{
          __html: countCallback.toString(),
        }}
      />

      <script
        async
        src={`https://api.countapi.xyz/hit/ebey-me${
          env === "production" ? "" : `-${env}`
        }/${identifier}${
          countCallback ? `?callback=${countCallback.name}` : ""
        }`}
      />
    </Head>
  );
}
