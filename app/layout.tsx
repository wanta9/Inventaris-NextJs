import './globals.css';
import 'antd/dist/reset.css';
import { Provider } from './provider';
import Script from 'next/script';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        
      </head>
      <body>
        <Script src="/api/env" strategy={'beforeInteractive'}></Script>
        <Provider>{children}</Provider>
      </body>
    </html> 
  );
}
