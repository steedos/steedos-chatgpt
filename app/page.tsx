import { Analytics } from "@vercel/analytics/react";
import { SessionProvider } from "next-auth/react"

import { Home } from "./components/home";

import { getServerSideConfig } from "./config/server";

const serverConfig = getServerSideConfig();

export default async function App() {
  return (
    <SessionProvider>
      <Home />
      {serverConfig?.isVercel && (
        <>
          <Analytics />
        </>
      )}
    </SessionProvider>
  );
}
