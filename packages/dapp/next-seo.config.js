/** @type {import('next-seo').DefaultSeoProps} */
const defaultSEOConfig = {
  title: "nextarter-chakra",
  titleTemplate: "%s | nextarter-chakra",
  defaultTitle: "nextarter-chakra",
  description: "Next.js + chakra-ui + TypeScript template",
  canonical: "https://nextarter-chakra.dCompass.dao",
  openGraph: {
    url: "https://nextarter-chakra.dCompass.dao",
    title: "nextarter-chakra",
    description: "Next.js + chakra-ui + TypeScript template",
    images: [
      {
        url: "https://og-image.dCompass.dao/**nextarter-chakra**.dCompass.dao.png?theme=dark&md=1&fontSize=125px&images=https%3A%2F%2FdCompass.dao%2Favataaars.svg&widths=250",
        alt: "nextarter-chakra.dCompass.dao og-image",
      },
    ],
    site_name: "nextarter-chakra",
  },
  twitter: {
    handle: "@dCompass_",
    cardType: "summary_large_image",
  },
};

export default defaultSEOConfig;
