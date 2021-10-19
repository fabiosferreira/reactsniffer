# ReactSniffer 

[![npm version](https://badge.fury.io/js/reactsniffer.svg)](https://www.npmjs.com/package/reactsniffer)
[![license](https://img.shields.io/npm/l/reactsniffer)](https://github.com/fabiosferreira/reactsniffer/blob/main/LICENSE)

[![NPM](https://nodei.co/npm/reactsniffer.png)](https://nodei.co/npm/reactsniffer/)

ReactSniffer is a tool to support practitioners and researchers in detecting code smells in React-based web systems. The tool has two key components: a parser for analyzing the React files and a Smells Detector module for identifying the smells.

<p align="center">
    <img src="https://github.com/fabiosferreira/reactsniffer/blob/main/img/ReactSniffer-Architecture.png" width= "600px" />
</p>

The Parser is a Command-Line Interface (CLI) implemented in Node, which receives as input a valid front-end file and generates an Abstract Syntax Tree (AST) in a JSON format. The Smells Detector module is also implemented in Node and relies on the AST to search and inspect React elements. 

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

### Output

The output will show the smells into two summarized tables.

Two CSV files (one per file and another by component) with more details about each smell will be generated.

## Supported Smells

ReactSniffer supports the following smells: 

| Smell      | Description                                                                             |
|------------|-----------------------------------------------------------------------------------------|
| Large Component                    | Component with too many props, attributes, and/or lines of code |
| Too Many Props                     | Passing too many properties to a single component               |
| Inheritance Instead of Composition | Using inheritance to reuse code among components                |
| Props in Initial State             | Initializing state with props                                   |
| Direct DOM Manipulation            | Manipulating DOM directly                                       |
| Force Update                       | Forcing the component or page to update                         |
| JSX outside the render method      | Implementing markup in multiple methods                         |
| Uncontrolled Components            | A component that does not use props/state to handle form's data |
| Large File                         | A file with several components and lines of code                |


## License

[MIT](https://choosealicense.com/licenses/mit/)