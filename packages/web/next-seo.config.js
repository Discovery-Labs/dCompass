/** @type {import('next-seo').DefaultSeoProps} */
const defaultSEOConfig = {
  title: "dCompass",
  titleTemplate: "%s | dCompass",
  defaultTitle: "dCompass",
  description: "A gamified and community driven Web3 learning platform.",
  canonical: "https://dCompass.dao",
  openGraph: {
    url: "https://dCompass.dao",
    title: "dCompass",
    description: "A gamified and community driven Web3 learning platform.",
    images: [
      {
        url: "https://og-image.dCompass.dao/**dCompass**.dCompass.dao.png?theme=dark&md=1&fontSize=125px&images=https%3A%2F%2FdCompass.dao%2Favataaars.svg&widths=250",
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
