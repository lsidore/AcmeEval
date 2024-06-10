import Link from "@docusaurus/Link";

export const Installation = () => {
  return (
    <section
      id="install"
      className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800"
    >
      <div className="container px-4 md:px-6">
        <div className="grid max-w-3xl mx-auto gap-12 text-center">
          <div className="space-y-4">
            <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800 text-[#535C91]">
              Installation
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Get Started in Minutes
            </h2>
            <p className="text-gray-500 md:text-xl dark:text-gray-400">
              Our TypeScript library is easy to set up and integrate into your
              existing AI development workflow.
            </p>
          </div>
          <div className="mx-auto w-full max-w-sm space-y-4">
            <pre className="bg-white dark:bg-gray-950 rounded-lg p-4 text-left">
              <code className="text-[#535C91] font-mono">
                npm install @acmeeval/core
              </code>
            </pre>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Get started by installing the core package.{" "}
              <Link href="#" className="underline underline-offset-2">
                Read the documentation
              </Link>{" "}
              to learn more.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
