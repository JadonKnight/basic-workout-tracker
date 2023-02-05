import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider, useSession } from "next-auth/react";
import { NextComponentType } from "next";
import Layout from "../components/layout";

interface AuthComponent {
  Component: NextComponentType & { auth?: boolean };
}

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps & AuthComponent) {
  return (
    <SessionProvider session={session}>
      <Layout>
        {Component.auth ? (
          <Auth>
            <Component {...pageProps} />
          </Auth>
        ) : (
          <Component {...pageProps} />
        )}
      </Layout>
    </SessionProvider>
  );
}

function Auth({ children }: { children: JSX.Element }): JSX.Element {
  // if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
  const { status } = useSession({ required: true });

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return children;
}
