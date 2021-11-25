/** @type {import('next-seo').DefaultSeoProps} */
const defaultSEOConfig = {
  title: "dCompass",
  titleTemplate: "%s | dCompass",
  defaultTitle: "dCompass",
  description: "A gamified and community driven Web3 learning platform.",
  canonical: "https://www.dcompass.discovery-dao.xyz/",
  openGraph: {
    url: "https://www.dcompass.discovery-dao.xyz/",
    title: "dCompass",
    description: "A gamified and community driven Web3 learning platform.",
    images: [
      {
        url: "https://www.dcompass.discovery-dao.xyz/",
        alt: "dCompass.dao og-image",
      },
    ],
    site_name: "dCompass",
  },
  twitter: {
    handle: "@dCompass_",
    cardType: "summary_large_image",
  },
};

export default defaultSEOConfig;
