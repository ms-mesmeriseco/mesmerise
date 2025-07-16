"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function BodyThemeWrapper() {
  const pathname = usePathname();

  useEffect(() => {
    const body = document.body;

    body.classList.remove(
      "page-home",
      "page-blog",
      "page-landing",
      "page-connect",
      "page-about"
    );

    if (pathname === "/") {
      body.classList.add("page-home");
    } else if (pathname.startsWith("/blog")) {
      body.classList.add("page-blog");
    } else if (pathname === "/connect") {
      body.classList.add("page-connect");
    } else if (pathname === "/about") {
      body.classList.add("page-about");
    }
  }, [pathname]);

  return null; // no UI output
}
