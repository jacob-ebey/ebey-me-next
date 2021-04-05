import { useEffect, useLayoutEffect, useRef, useState } from "react";

import useRemoteComponent from "../hooks/use-remote-component";

// This makes preact happy at runtime and react happy at dev time
const useIsmorphicEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Mark content as personalizable at the edge.
 *
 * @param {{
 *  name: string;
 * }} param0
 */
export default function PersonalizableContent({ name, children }) {
  const personalizableRef = useRef();
  const personalizableHtmlRef = useRef({ __html: "" });
  const [payload, setPayload] = useState(undefined);

  // If our remote component fails to load we should eject them from the personalization
  const onRemoteComponentFailed = () => setPayload(false);

  // This loads the remote component
  const RemoteComponent = useRemoteComponent(
    payload?.remoteComponent?.remote?.name,
    payload?.remoteComponent?.module,
    onRemoteComponentFailed
  );

  // On hydration
  useIsmorphicEffect(() => {
    // Get the HTML from SSR / SSG / edge worker to show when personalizing
    personalizableHtmlRef.current = {
      __html:
        personalizableRef.current?.innerHTML ||
        personalizableRef.current.__html,
    };
    // Get the payload from the edge worker
    const payloadString = personalizableRef.current?.getAttribute(
      "personalizable-payload"
    );

    // If we can't parse the payload or there isn't one, we eject from the personalization
    let parsedPayload = false;

    try {
      parsedPayload = JSON.parse(payloadString);
    } catch (err) {
      console.error("Error hydrating personalizable content", name, err);
    }

    // Store the payload
    setPayload(parsedPayload);
  }, []);

  // SSR / SSG just needs to tag the content
  if (typeof window === "undefined") {
    return (
      <div className="contents" personalizable-name={name}>
        {children}
      </div>
    );
  }

  // If we have not yet hydrated and resolved our personalization payload
  if (typeof payload === "undefined") {
    return (
      <div
        className="contents"
        ref={personalizableRef}
        suppressHydrationWarning
        dangerouslySetInnerHTML={personalizableHtmlRef.current}
      />
    );
  }

  // If out payload contains a remote component
  if (payload?.remoteComponent) {
    // If the remote component hasn't resolved yet render the fallback
    if (!RemoteComponent) {
      return (
        <div
          className="contents"
          dangerouslySetInnerHTML={personalizableHtmlRef.current}
        />
      );
    }

    // Render the remote component with the props from the payload
    return <RemoteComponent {...(payload?.props || {})} />;
  }

  // If we get here, we are either ejected from personalization
  // or there wasn't any to begin with so render the children
  return children;
}
