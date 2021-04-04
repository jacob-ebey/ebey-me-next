import dynamic from "next/dynamic";

const Code = dynamic(() => import("./mdx-code"));

const mdxComponents = {
  p: (props) => <p className="mb-4 text-lg font-light" {...props} />,
  code: Code,
};

export default mdxComponents;
