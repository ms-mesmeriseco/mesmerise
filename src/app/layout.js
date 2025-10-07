/** @type {import("next").Viewport} */
import Header from "@/components/layout/header";
import MenuToggle from "@/components/ui/MenuToggle";
import Footer from "@/components/layout/footer";
import Inner from "@/components/layout/Inner";
import Template from "@/components/layout/template";
import BodyThemeWrapper from "@/components/layout/BodyThemeWrapper";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";

export const metadata = {
  title: "Mesmerise Digital",
  description: "We don't just run ads.",
  icons: {
    // Browser tab favicons
    icon: [
      { url: "favicon-32x32.png", sizes: "any" }, // multi-size .ico (16/32)
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
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-TCGXS36');
            `,
          }}
        />
        {/* End Google Tag Manager
Google Tag Manager (noscript) */}
        {/* Clarity */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "tjlyzh45or");
            `,
          }}
        />
        {/* End Clarity */}

        {/* <!-- Reddit Pixel --> */}
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(w,d){if(!w.rdt){var p=w.rdt=function(){p.sendEvent?p.sendEvent.apply(p,arguments):p.callQueue.push(arguments)};p.callQueue=[];var t=d.createElement("script");t.src="https://www.redditstatic.com/ads/pixel.js",t.async=!0;var s=d.getElementsByTagName("script")[0];s.parentNode.insertBefore(t,s)}}(window,document);rdt('init','a2_hspbdqsjyll0');rdt('track', 'PageVisit');`,
          }}
        />
        {/* <!-- DO NOT MODIFY UNLESS TO REPLACE A USER IDENTIFIER -->
<!-- End Reddit Pixel --> */}
      </head>
      <body className={"bg-[var(--background)] text-[var(--foreground)]"}>
        <BodyThemeWrapper />
        <Header />
        <Template>
          <Inner>{children}</Inner>
        </Template>
        <MenuToggle />
        <Footer />
        {/* LinkedIn */}
        <div
          dangerouslySetInnerHTML={{
            __html: `<script type="text/javascript">
_linkedin_partner_id = "8129948";
window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
window._linkedin_data_partner_ids.push(_linkedin_partner_id);
</script><script type="text/javascript">
(function(l) {
if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
window.lintrk.q=[]}
var s = document.getElementsByTagName("script")[0];
var b = document.createElement("script");
b.type = "text/javascript";b.async = true;
b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
s.parentNode.insertBefore(b, s);})(window.lintrk);
</script>
<noscript>
<img height="1" width="1" style="display:none;" alt="" src="https://px.ads.linkedin.com/collect/?pid=8129948&fmt=gif" />
</noscript>
`,
          }}
        />

        {/* ENd linkedin */}
      </body>
      <GoogleAnalytics gaId="G-S8FYLFZ1PN" />
      <Analytics />
    </html>
  );
}
