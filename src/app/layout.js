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
