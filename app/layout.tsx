import './globals.css';
import 'antd/dist/reset.css';
import {Provider} from "./provider";
import Script from 'next/script';

export default function RootLayout({children,}: {children: React.ReactNode}) 
{
  return (
    <html lang="en">
      <>
      <title>Dashboard</title>
      </>
      <body>
        <Script src="/api/env" strategy={"beforeInteractive"}></Script>
        <Provider>{children}</Provider>
      </body>
    </html>
  )
}
