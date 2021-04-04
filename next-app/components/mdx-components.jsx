import dynamic from "next/dynamic";

const Code = dynamic(() => import("./mdx-code"));

const mdxComponents = {
  p: (props) => <p className="mb-4 text-lg font-light" {...props} />,
  ul: (props) => (
    <ul className="mb-4 text-lg font-light list-disc list-inside" {...props} />
  ),
  ol: (props) => (
    <ul
      className="mb-4 text-lg font-light list-decimal list-inside"
      {...props}
    />
  ),
  code: Code,
};

export default mdxComponents;
