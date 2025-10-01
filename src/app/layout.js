/** @type {import("next").Viewport} */
import Header from "@/components/layout/header";
import MenuToggle from "@/components/ui/MenuToggle";
import Footer from "@/components/layout/footer";
import Inner from "@/components/layout/Inner";
import Template from "@/components/layout/template";
import BodyThemeWrapper from "@/components/layout/BodyThemeWrapper";
import "./globals.css";
import dynamic from "next/dynamic";

const PixelTracker = dynamic(() => import("@/lib/utils/PixelTracker"), { ssr: false });
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Meta Pixel Code */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '712977556466722');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=712977556466722&amp;ev=PageView&amp;noscript=1"/>
        </noscript>
        {/* End Meta Pixel Code */}
      </head>
      <body>
        <PixelTracker />
        {children}
      </body>
    </html>
  );
}

export const metadata = {
  title: "Mesmerise Digital",
  description: "We don't just run ads.",
  icons: {
    icon: "/LogoFavicon.png", // standard 32x32
    shortcut: "/LogoFavicon.png", // legacy rel="shortcut icon"
    apple: "/LogoFavicon.png", // iOS homescreen
  },
};
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={"bg-[var(--background)] text-[var(--foreground)]"}>
        <BodyThemeWrapper />
        <Header />
        <Template>
          <Inner>{children}</Inner>
        </Template>
        <MenuToggle />
        <Footer />
      </body>
    </html>
  );
}
