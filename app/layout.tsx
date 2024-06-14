/* eslint-disable @next/next/no-page-custom-font */
import "./styles/globals.scss";
import "./styles/markdown.scss";
import "./styles/highlight.scss";
import { getClientConfig } from "./config/client";
import { type Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getServerSideConfig } from "./config/server";
import { GoogleTagManager } from "@next/third-parties/google";
import Locale from "./locales";

const serverConfig = getServerSideConfig();

export const metadata: Metadata = {
  title: Locale.App.Title, //"Chatbot Builder",
  description: Locale.App.Description, //"Enterprise ChatGPT Chat Bot.",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#151515" },
  ],
  appleWebApp: {
    title: Locale.App.Title,
    statusBarStyle: "default",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="config" content={JSON.stringify(getClientConfig())} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        {/* <link rel="manifest" href="/site.webmanifest"></link> */}
        <link rel="icon" type="image/svg" href="/logo.svg"></link>
        <script src="/serviceWorkerRegister.js" defer></script>
        <meta http-equiv="Content-Security-Policy" content="frame-ancestors 'self' builder.com *.builder6.com  *.builder6.app builder6.steedos.cn *.steedos.cn *.steedos.com;"/>

      </head>
      <body>
        {children}
        {serverConfig?.isVercel && (
          <>
            <SpeedInsights />
          </>
        )}
        {serverConfig?.gtmId && (
          <>
            <GoogleTagManager gtmId={serverConfig.gtmId} />
          </>
        )}
      </body>
    </html>
  );
}
