import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import { HomepageFeatures } from "../components/HomepageFeatures";

const HomepageHeader = () => (
  <header className="w-full py-12 md:py-24 lg:py-32 bg-[#535C91] text-white">
    <div className="container px-4 md:px-6">
      <div className="grid max-w-3xl mx-auto gap-8 text-center">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
          AcmeEval: Test Your Rag Applications with Ease
        </h1>
        <p className="text-gray-200 md:text-xl">
          Streamline your RAG testing process with our open-source TypeScript
          library. Ensure your models are performing as expected across a wide
          range of scenarios.
        </p>
        <div className="flex justify-center">
          <Link
            href="#"
            className="inline-flex h-10 items-center justify-center rounded-md bg-white text-[#535C91] px-8 text-sm font-medium shadow transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  </header>
);

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <HomepageHeader />
      <HomepageFeatures />
    </Layout>
  );
}
