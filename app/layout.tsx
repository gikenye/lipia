import type React from "react"
import { Inter } from "next/font/google"
import { WalletProvider } from "@/lib/wallet-context"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Lipia - Send Money to Kenya",
  description: "Fast, secure money transfers to Kenya using PYUSD",
  generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <WalletProvider>
          <div className="min-h-screen">{children}</div>
        </WalletProvider>
      </body>
    </html>
  )
}
