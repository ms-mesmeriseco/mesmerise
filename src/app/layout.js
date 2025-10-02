/** @type {import("next").Viewport} */
import Header from "@/components/layout/header";
import MenuToggle from "@/components/ui/MenuToggle";
import Footer from "@/components/layout/footer";
import Inner from "@/components/layout/Inner";
import Template from "@/components/layout/template";
import BodyThemeWrapper from "@/components/layout/BodyThemeWrapper";
import "./globals.css";

export const metadata = {
  title: "Mesmerise Digital",
  description: "We don't just run ads.",
  icons: {
    // Browser tab favicons
    icon: [
      { url: "favicon.ico", sizes: "any" }, // multi-size .ico (16/32)
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    // (Optional) Safari pinned tab (monochrome SVG) — looks great in macOS
    other: [
      { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#111111" },
    ],
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
              fbq('init', '1448494526204583');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            className="hidden"
            src="https://www.facebook.com/tr?id=712977556466722&amp;ev=PageView&amp;noscript=1"
          />
        </noscript>
        {/* End Meta Pixel Code */}
      </head>
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
