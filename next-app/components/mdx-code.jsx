import { Children } from "react";
import Highlight, { defaultProps } from "prism-react-renderer";
import prismTheme from "prism-react-renderer/themes/vsLight";

import cn from "../utils/classnames";

export default function MdxCode(props) {
  const { className, children } = props;
  const code = Children.toArray(children)
    .map((c) => (typeof c === "string" ? c : ""))
    .join("\n");

  const language =
    typeof className === "string"
      ? className
          .split(" ")
          .find((c) => c.startsWith("language-"))
          ?.split("language-")[1]
      : false;

  if (!language) {
    return (
      <div className="overflow-x-auto mb-4">
        <code {...props} />
      </div>
    );
  }

  return (
    <Highlight {...defaultProps} theme={prismTheme} code={code} language="jsx">
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <div className={cn(className, "overflow-x-auto mb-4")} style={style}>
          <code>
            {tokens.map((line, i) => (
              <div {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </code>
        </div>
      )}
    </Highlight>
  );
}
