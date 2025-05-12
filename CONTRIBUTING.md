# Contributing to MockTestBuddy

## Version Control Guidelines

### Branch Strategy
1. `main` branch: Always represents the latest stable release
2. `develop` branch: Integration branch for ongoing development
3. Feature branches: Created from `develop` for new features

### Branch Naming Conventions
- Feature branches: `feature/short-description`
- Bugfix branches: `bugfix/issue-description`
- Hotfix branches: `hotfix/urgent-fix`
- Documentation branches: `docs/update-description`

### Commit Message Guidelines
- Use conventional commits format:
  ```
  <type>(optional scope): <description>
  
  Optional body
  
  Optional footer
  ```
- Types: 
  * `feat`: New feature
  * `fix`: Bug fix
  * `docs`: Documentation changes
  * `style`: Code formatting
  * `refactor`: Code refactoring
  * `test`: Adding or modifying tests
  * `chore`: Maintenance tasks

### Pull Request Process
1. Ensure code passes all tests
2. Update documentation if needed
3. Get at least one code review approval
4. Squash and merge into `develop`

### Code Review Checklist
- [ ] Code follows project style guidelines
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No unnecessary changes
- [ ] Performance considerations

## Development Setup
1. Fork the repository
2. Clone your fork
3. Create a new branch from `develop`
4. Make changes
5. Push to your fork
6. Create a pull request to `develop`

## Reporting Issues
- Use GitHub Issues
- Provide detailed description
- Include reproduction steps
- Specify environment details

## Code of Conduct
- Be respectful
- Collaborate constructively
- Prioritize project goals

## Questions?
Reach out to project maintainers.
