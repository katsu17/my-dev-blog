import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { GoogleTagManager } from "@next/third-parties/google"
import Header from "./components/Header"
import ArticleList from "./components/ArticleList"
import Head from "next/head"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AK-DEV-BLOG",
  description: "開発証跡ブログ",
}

const GTM_TAG = process.env.GTM_TAG
const GOOGLE_AD_PUBLISH_ID = process.env.GOOGLE_AD_PUBLISH_ID

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <GoogleTagManager gtmId={`${GTM_TAG}`} />
      <Head>
        <meta
          name="google-adsense-account"
          content={`${GOOGLE_AD_PUBLISH_ID}`}
        />
      </Head>
      <body className={inter.className}>
        <main className="flex min-h-screen flex-col items-center justify-between p-24 text-white w-full">
          <Header />
          {children}
          <ArticleList />
        </main>
      </body>
    </html>
  )
}
