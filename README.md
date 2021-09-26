# ReactSniffer 

[![npm version](https://badge.fury.io/js/reactsniffer.svg)](https://www.npmjs.com/package/reactsniffer)
[![license](https://img.shields.io/npm/l/reactsniffer)](https://github.com/fabiosferreira/reactsniffer/blob/main/LICENSE)

[![NPM](https://nodei.co/npm/reactsniffer.png)](https://nodei.co/npm/reactsniffer/)

ReactSniffer is a tool to support practitioners and researchers in detecting code smells in React-based web systems. The tool has two key components: a parser for analyzing the React files and a Smells Detector module for identifying the smells.

<p align="center">
    <img src="https://github.com/fabiosferreira/reactsniffer/blob/main/img/ReactSniffer-Architecture.png" width= "600px" />
</p>

The Parser is a Command-Line Interface (CLI) implemented in Node, which receives as input a valid front-end file and generates an Abstract Syntax Tree (AST) in a JSON format. The principal element of this parser is [Babel](https://babeljs.io/), which has a [parser](https://babeljs.io/docs/en/babel-parser) to generate an AST for JSX code. Therefore, our Parser module generates an AST for the front-end file and exports it to a JSON format, which will be used as input to the Smells Detector module.

The Smells Detector module is also implemented in Node and relies on the AST to search and inspect React elements. It recursively traverses the AST using a preorder algorithm. 

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install locally.

```bash
npm install -g reactsniffer
```

## Usage

To use this tool you need to provide the repository directory (e.g., myproject/react/src)

```bash
reactsniffer myproject/react/src
```

## Supported Smells

ReactSniffer supports the following smells: 

| Smell      | Description                                                                             |
|------------|-----------------------------------------------------------------------------------------|
| Large Component                    | Component with too many props, attributes, and/or lines of code |
| Too Many Props                     | Passing too many properties to a single component               |
| Inheritance Instead of Composition | Using inheritance to reuse code among components                |
| Props in Initial State             | Initing state with props                                        |
| Directy DOM Manipulation           | Manipulating DOM directyly                                      |
| Force Update                       | Forcing the component or page to update                         |
| JSX outside the render method      | Implementing markup in multiple methods                         |
| Uncontrolled Components            | A component that does not use props/state tohandle form's data  |
| JSX outside the render method      | Implementing markup in multiple methods                         |
| Large File                         | A file with several components and lines of co                  |

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)