# POC with Rush

## Installation

Install or update rush and its dependencies:
 
```bash
npm install -g @microsoft/rush pnpm
```

## Rush monorepo


1. To install dependencies:

```
rush update
```

2. To build packages:

```
rush build
```

### Local Development

- Re-run `rush update` after changing any `package.json` files.
- Run `rushx build` in a local package folder to get local errors.

### Adding new dependencies

```
cd package/directory
rush add [--dev] -p <package name> --make-consistent
```

### Running scripts in individual packages

```
cd package/directory
rushx <script name>
```

### What we are going to do


- How Monorepo works
- How to create node packages
- dependencies, devDependencies and peerDependencies
- plugin system for apps