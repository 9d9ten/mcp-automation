# Contributing to @9d9 Packages

Thank you for your interest in contributing! This guide covers all 9d9 open-source packages.

## Code of Conduct

Be respectful. Be constructive. No harassment, discrimination, or toxic behavior.

## How to Contribute

### Bug Reports

1. Check existing issues first
2. Open a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Node.js version and OS

### Feature Requests

1. Open an issue with the `enhancement` label
2. Describe the use case, not just the solution
3. Explain why it benefits the community

### Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass: `npm test`
6. Ensure build succeeds: `npm run build`
7. Commit with conventional format:

```
feat: add new utility function
fix: resolve timeout edge case
docs: update API reference
chore: upgrade dependencies
```

8. Open a PR against `main`

### Development Setup

```bash
# Clone
git clone https://github.com/9d9ten/<package>.git
cd <package>

# Install dependencies
npm install

# Build
npm run build

# Test
npm test

# Test in watch mode
npm test -- --watch
```

### Code Style

- TypeScript strict mode
- ESM by default (CJS compatibility via tsup)
- No `any` types without justification
- Export everything consumers need from `src/index.ts`
- JSDoc comments on public APIs

### Testing

- Use [Vitest](https://vitest.dev/)
- One test file per source file: `src/foo.ts` → `src/foo.test.ts`
- Test edge cases, not just happy paths
- Mock external dependencies

### Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: new feature
fix: bug fix
docs: documentation changes
style: formatting (no code change)
refactor: code restructuring
test: adding/updating tests
chore: build/tooling changes
```

For 9d9 internal commits:
```
MAESTRO: [waveX/category] description
```

## Release Process

1. Maintainers create releases via git tags
2. GitHub Actions automatically:
   - Runs tests on Node 18/20/22
   - Builds the package
   - Publishes to npm
3. Versions follow [SemVer](https://semver.org/)

## License

By contributing, you agree that your code will be licensed under the MIT License.

## Questions?

- Open an issue: https://github.com/9d9ten/<package>/issues
- GitHub Sponsors: https://github.com/sponsors/9d9ten

---

Thank you for helping build the future of AI agent tooling 🦞
