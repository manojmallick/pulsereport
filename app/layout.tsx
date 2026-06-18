import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "PulseReport — Your weekly product update in 60 seconds",
  description:
    "Paste your metrics, what shipped, and user feedback. Get your weekly product update in four formats: Slack, CEO email, board slide, and engineering standup — instantly.",
  metadataBase: new URL("https://pulsereport-tan.vercel.app"),
  openGraph: {
    title: "PulseReport — Your weekly product update in 60 seconds",
    description: "Four audiences. One paste. Sixty seconds. Built for Mind the Product 2026.",
    type: "website",
  },
};

const NOVUS_KEY = process.env.NEXT_PUBLIC_NOVUS_API_KEY;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface text-on-surface min-h-screen">
        {/* Novus.ai (Pendo) — only initialised when a key is present. */}
        {NOVUS_KEY ? (
          <Script id="novus-init" strategy="afterInteractive">
            {`
              (function(apiKey){
                (function(p,e,n,d,o){var v,w,x,y,z;o=p[d]=p[d]||{};
                o._q=o._q||[];v=['initialize','identify','updateOptions','pageLoad','track'];
                for(w=0,x=v.length;w<x;++w)(function(m){o[m]=o[m]||function(){
                o._q[m===v[0]?'unshift':'push']([m].concat([].slice.call(arguments,0)));
                };})(v[w]);y=e.createElement(n);y.async=!0;
                y.src='https://cdn.pendo.io/agent/static/'+apiKey+'/pendo.js';
                z=e.getElementsByTagName(n)[0];z.parentNode.insertBefore(y,z);}
                )(window,document,'script','pendo');
                pendo.initialize({
                  visitor: { id: 'anonymous-' + Math.random().toString(36).substr(2,9) },
                  account: { id: 'pulsereport-hackathon' }
                });
              })('${NOVUS_KEY}');
            `}
          </Script>
        ) : null}
        {children}
      </body>
    </html>
  );
}
