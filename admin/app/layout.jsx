import { Inter, Source_Serif_4 } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const serif = Source_Serif_4({ subsets: ['latin'], variable: '--font-serif', display: 'swap' });

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || '54 Law Partners';

export const metadata = {
  title: { default: `${APP_NAME} — Dashboard`, template: `%s · ${APP_NAME}` },
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${serif.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
