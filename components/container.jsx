import cn from "../utils/classnames";

const defaultTag = "div";

export default function Container({ tag = defaultTag, className, ...props }) {
  const Tag = tag;

  return <Tag className={cn("max-w-2xl mx-auto px-6 mb-16", className)} {...props} />;
}
