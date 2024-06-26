# AcmeEval: TypeScript RAG Evaluation Framework

[![CI Tests](https://github.com/lsidore/AcmeEval/actions/workflows/ci-tests.js.yml/badge.svg)](https://github.com/lsidore/AcmeEval/actions/workflows/ci-tests.js.yml)
[![codecov](https://codecov.io/github/lsidore/AcmeEval/graph/badge.svg?token=MA3OZV7CPS)](https://codecov.io/github/lsidore/AcmeEval)

AcmeEval is a TypeScript library that simplifies and expedites the evaluation of Retrieval-Augmented Generation (RAG) systems. This framework provides an efficient solution for assessing the performance of your RAG systems, both locally and via APIs.

## Installation

To install AcmeEval, you can use npm or yarn:

```bash
npm install @acme-eval/core
# or
yarn add @acme-eval/core
```

## Quick Start Guide

Get started with AcmeEval in just a few steps:

1. Prepare your documentation: Ensure your documentation is in a folder containing markdown files.
2. Generate test questions: Use the `generateTestSet` function to generate a set of questions based on your documentation.
3. Evaluate your RAG system: Use the generated questions to evaluate the performance of your RAG system.

## Using the `generateTestSet` Function

The `generateTestSet` function is used to generate a test set of questions from a folder containing markdown files. It takes the following parameters:

- `pathToDoc`: Path to the folder containing the markdown files. This is a required field.
- `nbOfQuestions`: Number of questions to generate. Defaults to 10 if not provided.
- `withLogs`: Display logs during the generation process. Defaults to `false`.
- `saveOnDisk`: Save the generated questions to a JSON file. Defaults to `true`.
- `finalPath`: Path to save the generated questions. Defaults to `'./generatedQuestions.json'`.

The function returns the generated questions.

Here's an example of how to use the function:

```javascript
const questions = await generateTestSet('./docs', 20, true, true, './testQuestions.json');
console.log(questions);
```

In this example, the function will generate 20 questions from the markdown files in the `./docs` folder, display logs during the process, save the generated questions to `./testQuestions.json`, and then log the generated questions to the console.

## Documentation

For more information about AcmeEval, please visit our [documentation](https://lsidore.github.io/AcmeEval/docs/intro).

## Troubleshooting

If you encounter any problems or errors, please check the following:

Ensure that the path to your documentation folder is correct.
Make sure that the markdown files in your documentation folder are well-formatted.
Check that you have the necessary permissions to read and write files in the specified paths.
If you've checked these and are still experiencing issues, please open an issue with as much detail as possible.

## License

This project is licensed under the Apache License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please see our [contributing guidelines](CONTRIBUTING.md) for more information.

## Issues

If you encounter any problems or have suggestions, please [open an issue](https://github.com/lsidore/AcmeEval/issues).

---
