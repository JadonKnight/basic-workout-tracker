import { useRouter } from "next/router";
import { useEffect } from "react";

const NavigationWarning = () => {
  const Router = useRouter();

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      // Customize the warning message based on your requirements
      event.returnValue =
        "Are you sure you want to leave? Your progress may be lost.";
    };

    const handleRouteChange = () => {
      const leave = confirm(
        "Are you sure you want to leave? Your progress may be lost."
      );

      if (!leave) {
        Router.events.emit("routeChangeError");
        throw "routeChange aborted. This error can be safely ignored - https://github.com/zeit/next.js/issues/2476.";
      }

      // Remove the event listener on route change
      Router.events.off("routeChangeStart", handleRouteChange);
    };

    // Attach the event listener to the 'beforeunload' event
    window.addEventListener("beforeunload", handleBeforeUnload);
    Router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      // Clean up the event listeners when the component is unmounted
      window.removeEventListener("beforeunload", handleBeforeUnload);
      Router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [Router]);

  return null;
};

export default NavigationWarning;
