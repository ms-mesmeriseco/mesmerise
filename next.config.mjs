/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.ctfassets.net",
        pathname: "**",
      },
    ],
  },

  async redirects() {
    return [
      {
        source: "/web-design-packages",
        destination: "/services/website",
        permanent: true,
      },
      {
        source: "/contact",
        destination: "/connect",
        permanent: true,
      },
      {
        source: "/insights",
        destination: "/blog", // update when blog is ready
        permanent: true,
      },
      {
        source: "/google-ads",
        destination: "/google-ads-management-melbourne",
        permanent: true,
      },
      {
        source: "/blog/digital-marketing-benefits",
        destination:
          "/digital-marketing-101-a-beginners-everything-you-need-to-know-guide",
        permanent: true,
      },
      {
        source: "/copy-of-home",
        destination: "/",
        permanent: true,
      },
      {
        source: "/ppc-agency-melbourne",
        destination: "/google-ads-management-melbourne",
        permanent: true,
      },
      {
        source: "/creative-agency",
        destination: "/",
        permanent: true,
      },
      {
        source: "/basic-web-design-principles-and-elements",
        destination: "/blog/basic-web-design-principles-and-elements",
        permanent: true,
      },
      {
        source:
          "/3-reasons-why-small-business-owners-need-to-allocate-a-marketing-budget",
        destination:
          "/blog/3-reasons-why-small-business-owners-need-to-allocate-a-marketing-budget",
        permanent: true,
      },
      {
        source: "/local-seo-basics",
        destination: "/blog/local-seo-basics",
        permanent: true,
      },
      {
        source: "/web-design-agency",
        destination: "/services/website",
        permanent: true,
      },
      {
        source:
          "/googles-restructure-pivot-into-ai-what-does-the-future-hold-for-your-business",
        destination:
          "/blog/googles-restructure-pivot-into-ai-what-does-the-future-hold-for-your-business",
        permanent: true,
      },
      {
        source: "/full-funnel-marketing",
        destination: "/blog/full-funnel-marketing",
        permanent: true,
      },
      {
        source: "/insights/retargeting-marketing",
        destination: "/blog/retargeting-marketing",
        permanent: true,
      },
      {
        source: "/google-seo-ranking-factors",
        destination: "/blog/google-seo-ranking-factors",
        permanent: true,
      },
      {
        source: "/5-fundamental-mistakes-destroying-your-google-ads-campaigns",
        destination:
          "/blog/5-fundamental-mistakes-destroying-your-google-ads-campaigns",
        permanent: true,
      },
      {
        source: "/home-old",
        destination: "/",
        permanent: true,
      },
      {
        source: "/small-business-seo-marketing",
        destination: "/blog/small-business-seo-marketing",
        permanent: true,
      },
      {
        source: "/web-design/projects/wbc",
        destination: "/work/wilderness-building-co",
        permanent: true,
      },
      {
        source: "/free-marketing-audit",
        destination: "/connect",
        permanent: true,
      },
      {
        source: "/web-design/projects/reigner",
        destination: "/work/reigner",
        permanent: true,
      },
      {
        source: "/web-design/projects/cygnet",
        destination: "/work/cygnet-perfumery",
        permanent: true,
      },
      {
        source: "/ebook",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
