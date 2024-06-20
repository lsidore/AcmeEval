# AcmeEval: RAG Evaluation Framework

AcmeEval is a TypeScript library that simplifies and expedites the evaluation of Retrieval-Augmented Generation (RAG) systems. This framework provides an efficient solution for assessing the performance of your RAG systems, both locally and via APIs.

## Installation

To install AcmeEval, you can use npm or yarn:

```bash
npm install @acme-eval/core
# or
yarn add @acme-eval/core
```

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

## License

This project is licensed under the Apache License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please see our [contributing guidelines](CONTRIBUTING.md) for more information.

## Issues

If you encounter any problems or have suggestions, please [open an issue](https://github.com/lsidore/AcmeEval/issues).

---
