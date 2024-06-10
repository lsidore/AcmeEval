export const Features = () => {
  return (
    <section id="features" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="grid max-w-3xl mx-auto gap-12 text-center">
          <div className="space-y-4">
            <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800 text-[#535C91]">
              Key Features
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Streamline Your AI Testing
            </h2>
            <p className="text-gray-500 md:text-xl dark:text-gray-400">
              Our TypeScript library provides a comprehensive set of tools to
              help you test your AI models with ease.
            </p>
          </div>
          <div className="mx-auto grid items-start gap-12 sm:max-w-4xl sm:grid-cols-2 md:gap-16 lg:max-w-5xl lg:grid-cols-3">
            <div className="grid gap-2">
              <h3 className="text-lg font-bold">Scenario Testing</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Define and execute a wide range of test scenarios to ensure your
                models perform as expected.
              </p>
            </div>
            <div className="grid gap-2">
              <h3 className="text-lg font-bold">Data Validation</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Validate your input data and ensure it meets the requirements of
                your AI models.
              </p>
            </div>
            <div className="grid gap-2">
              <h3 className="text-lg font-bold">Performance Monitoring</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Monitor the performance of your AI models in real-time and
                identify areas for improvement.
              </p>
            </div>
            <div className="grid gap-2">
              <h3 className="text-lg font-bold">Reporting</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Generate comprehensive reports to track the progress and
                effectiveness of your AI testing.
              </p>
            </div>
            <div className="grid gap-2">
              <h3 className="text-lg font-bold">Integrations</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Seamlessly integrate our library with your existing AI
                development workflow.
              </p>
            </div>
            <div className="grid gap-2">
              <h3 className="text-lg font-bold">Customization</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Tailor our library to fit your specific testing needs and
                requirements.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
