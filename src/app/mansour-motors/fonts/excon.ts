import localFont from 'next/font/local'

/* Excon (Fontshare, free licence), self-hosted: the public site, the back office and login share it */
export const excon = localFont({
  src: [
    { path: './excon-100.woff2', weight: '100' },
    { path: './excon-300.woff2', weight: '300' },
    { path: './excon-400.woff2', weight: '400' },
    { path: './excon-500.woff2', weight: '500' },
  ],
  variable: '--font-excon',
  display: 'swap',
})
