/* eslint-disable @typescript-eslint/no-var-requires */
const withPWA = require("next-pwa");
const removeImports = require("next-remove-imports")();
const { i18n } = require("./next-i18next.config");

// module.exports = removeImports({
// });
/** @type {import('next').NextConfig} */
module.exports = withPWA(
  removeImports({
    experimental: { esmExternals: true },
    i18n,
    pwa: {
      disable:
        process.env.NODE_ENV === "development" ||
        process.env.NODE_ENV === "preview" ||
        process.env.NODE_ENV === "production",
      // delete two lines above to enable PWA in production deployment
      // add your own icons to public/manifest.json
      // to re-generate manifest.json, you can visit https://tomitm.github.io/appmanifest/
      dest: "public",
      register: true,
    },
    reactStrictMode: true,
  })
);
