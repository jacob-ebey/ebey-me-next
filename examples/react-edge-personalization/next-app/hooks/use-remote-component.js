import { useEffect, useState, version as reactVersion } from "react";
import { version as reactDomVersion } from "react-dom";

const remotes = {};

export default function useRemoteComponent(remote, component, onFailed) {
  const [result, setResult] = useState(undefined);

  if (remote && component && onFailed && !remotes[remote]) {
    remotes[remote] = new Promise((resolve) => {
      const link = document.querySelector(
        `link[personalizable-preload='${remote}']`
      );
      if (!link) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.addEventListener("load", () => {
        const init = window[remote]?.init;
        if (init) {
          Promise.resolve(
            init({
              react: {
                [reactVersion]: {
                  loaded: true,
                  from: "host",
                  get: () => import("react").then((m) => () => m.default),
                },
              },
              "react-dom": {
                [reactDomVersion]: {
                  loaded: true,
                  from: "host",
                  get: () => import("react-dom").then((m) => () => m.default),
                },
              },
            })
          )
            .then()
            .catch(() => onFailed())
            .then(() => resolve());
        } else {
          resolve();
        }
      });
      script.addEventListener("error", () => {
        onFailed();
        resolve();
      });
      script.src = link.href;
      document.body.appendChild(script);
    });
  }

  useEffect(() => {
    let canceled = false;
    remotes[remote] &&
      remotes[remote].then(() => {
        const get = window[remote]?.get;
        if (get) {
          get(component)
            .then((factory) => {
              const mod = factory();
              if (!canceled) {
                setResult(() => mod?.default || mod);
              }
            })
            .catch(() => onFailed());
        }
      });

    return () => {
      canceled = true;
    };
  }, [remote, component]);

  return result;
}
