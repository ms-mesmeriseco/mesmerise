import Link from "next/link";
import Image from "next/image";

export default function SimpleFooter() {
  return (
    <footer className="relative z-[200] bg-[var(--background)] border-t-1 border-[var(--mesm-grey-dk)] m-[var(--global-margin-sm)] pb-18 md:pb-0">
      <div className="mx-auto flex w-full flex-col items-center justify-center gap-6 py-12 md:py-16">
        <Link href="/" aria-label="Mesmerise Digital Home">
          <Image
            src="/wordmark.svg"
            alt="Mesmerise Digital"
            width={1080}
            height={60}
            priority
          />
        </Link>

        <ul className="flex items-center gap-5 text-sm opacity-80">
          <li>
            <a
              href="https://www.linkedin.com/company/mesmeriseco/"
              className="footer-link"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
          </li>
          <li>
            <a
              href="https://www.instagram.com/mesmerise.digital/"
              className="footer-link"
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>
          </li>
          <li>
            <a href="mailto:hello@mesmeriseco.com" className="footer-link">
              Email
            </a>
          </li>
        </ul>
      </div>

      <style jsx global>{`
        .footer-link {
          position: relative;
          transition: opacity 160ms ease;
          opacity: 0.9;
          padding-bottom: 3px;
          margin-bottom: 3px;
        }
        .footer-link:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 2px;
          border-radius: 6px;
        }
        .footer-link:hover {
          opacity: 1;
        }

        .footer-link::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 1px;
          background-color: var(--foreground);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.25s ease;
        }
        .footer-link:hover::after {
          transform: scaleX(1);
        }
      `}</style>
    </footer>
  );
}
