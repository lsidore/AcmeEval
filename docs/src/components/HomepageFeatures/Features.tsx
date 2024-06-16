const features: { title: string; description: string }[] = [
	{
		description:
			'Define and execute a wide range of test scenarios to ensure your models perform as expected.',
		title: 'Scenario Testing',
	},
	{
		description:
			'Validate your input data and ensure it meets the requirements of your AI models.',
		title: 'Data Validation',
	},
	{
		description:
			'Monitor the performance of your AI models in real-time and identify areas for improvement.',
		title: 'Performance Monitoring',
	},
	{
		description:
			'Generate comprehensive reports to track the progress and effectiveness of your AI testing.',
		title: 'Reporting',
	},
	{
		description:
			'Seamlessly integrate our library with your existing AI development workflow.',
		title: 'Integrations',
	},
	{
		description:
			'Tailor our library to fit your specific testing needs and requirements.',
		title: 'Customization',
	},
];

const Feature = ({
	title,
	description,
}: {
	title: string;
	description: string;
}) => {
	return (
		<div className="grid gap-2">
			<h3 className="text-lg font-bold">{title}</h3>
			<p className="text-sm text-gray-500 dark:text-gray-400">
				{description}
			</p>
		</div>
	);
};

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
							Our TypeScript library provides a comprehensive set
							of tools to help you test your AI models with ease.
						</p>
					</div>
					<div className="mx-auto grid items-start gap-12 sm:max-w-4xl sm:grid-cols-2 md:gap-16 lg:max-w-5xl lg:grid-cols-3">
						{features.map((feature, idx) => (
							<Feature key={feature.title} {...feature} />
						))}
					</div>
				</div>
			</div>
		</section>
	);
};
