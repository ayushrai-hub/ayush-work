# Contributing to Ayush Rai Portfolio

We welcome contributions to this portfolio project! This document outlines our guidelines for contributing, with special attention to AI-assisted development since Windsurf/AI helps maintain this repository.

## 💡 AI-Assisted Development Guidelines

Since Windsurf/AI will help maintain this repo, please adhere to these practices:

- [ ] **Verify actual code paths before editing (no hallucinations)**: Always confirm file paths and code structures exist by checking the repository before making changes. Use tools to explore the codebase structure.

- [ ] **Only tick checkboxes when evidence exists in repo**: When completing tasks, only mark items as done when there is clear evidence (tests passing, code committed, etc.) rather than speculation.

- [ ] **Never overwrite large files unnecessarily — prefer minimal diffs**: Use targeted edits instead of replacing entire files. Prefer `replace_in_file` over `write_to_file` for existing large files.

- [ ] **Always add/update tests for new code**: Every code change should include appropriate test coverage. Update existing tests when modifying functionality.

- [ ] **Keep docs and code synchronized at every commit**: Documentation must reflect current code state. Update README, API docs, and inline comments when code changes.

## 🛠️ How to Contribute

### Code Contributions

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes following the guidelines above
4. Ensure tests pass: `npm run test`
5. Commit your changes: `git commit -m "Add: your feature description"`
6. Push to your branch: `git push origin feature/your-feature`
7. Create a Pull Request

### Development Setup

See [README.md](README.md) for detailed installation and setup instructions.

### Code Standards

- Follow existing code style and conventions
- Use TypeScript for type safety
- Ensure accessibility compliance
- Write comprehensive tests
- Update documentation for any API changes

## 📋 Pull Request Process

1. Update the README.md with details of changes if needed
2. Update tests to reflect your changes
3. Ensure all checks pass
4. Request review from maintainers

## 🔍 Review Process

Pull requests will be reviewed for:
- Code quality and standards
- Test coverage
- Documentation updates
- Adherence to AI maintenance guidelines

## 🐛 Reporting Issues

Use the GitHub Issues tab to report bugs or suggest features. Please include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Browser/OS information

## 📝 Documentation

Keep documentation current and accurate. All new features should include appropriate documentation updates.

Thank you for contributing! 🎉
