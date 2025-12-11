import PropTypes from "prop-types";
import Image from "next/image";

export default function Card({ icon, children }) {
  const src = icon;
  const alt = icon?.alt || icon?.title || "";

  return (
    <div
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="flex flex-col items-start bg-[var(--mesm-grey-xd)] border-1 border-[var(--mesm-grey-dk)] hover:border-[var(--mesm-grey)] opacity-95 hover:opacity-100 rounded-xl duration-200 text-left gap-8 min-h-full p-[2rem] justify-between [&>p+p]:mt-4"
    >
      {src && (
        <Image
          src={src}
          alt={alt}
          width={96}
          height={48}
          className="h-12 w-auto object-contain self-start"
          style={{ maxWidth: "96px" }}
        />
      )}
      {children}
    </div>
  );
}

Card.propTypes = {
  icon: PropTypes.shape({
    // legacy / manual
    url: PropTypes.string,
    src: PropTypes.string,
    title: PropTypes.string,
    alt: PropTypes.string,
    // Sanity-style
    asset: PropTypes.shape({
      url: PropTypes.string,
      _ref: PropTypes.string,
      _id: PropTypes.string,
    }),
  }),
  children: PropTypes.node,
};
