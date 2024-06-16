import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import tailwindPlugin from "./plugins/tailwind-plugin.cjs";

const config: Config = {
  title: "AcmeEval",
  tagline: "Simplify RAG App Testing",
  favicon: "img/favicon.ico",
  url: "https://lsidore.github.io/",
  baseUrl: "/AcmeEval/",
  organizationName: "lsidore",
  projectName: "AcmeEval",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },
  plugins: [tailwindPlugin],
  presets: [
    [
      "classic",
      {
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    navbar: {
      title: "AcmeEval",
      logo: {
        alt: "Acme logo",
        src: "img/logo.png",
      },
      items: [
        {
          href: "https://github.com/lsidore/AcmeEval",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      copyright: `© ${new Date().getFullYear()} AcmeEval.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
