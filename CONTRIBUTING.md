# Contributing to Movie Recommendation System

Thank you for your interest in contributing to the Movie Recommendation System! This document provides guidelines and instructions for contributing.

## Getting Started

### Prerequisites

- Python 3.12 or higher
- Node.js 18 or higher
- Git
- Git LFS (for large model files)

### Setting Up Development Environment

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Movie-Recommendation-System.git
   cd NLP-Movie-Recommendation-Webiste-ML-Project
   ```

3. Set up Git LFS:
   ```bash
   git lfs install
   git lfs pull
   ```

4. Set up backend:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

5. Set up frontend:
   ```bash
   cd frontend
   npm install
   ```

## Development Workflow

### Branch Naming

Use descriptive branch names:
- `feature/feature-name`
- `fix/bug-description`
- `docs/documentation-update`
- `refactor/code-improvement`

### Making Changes

1. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following the code style guidelines

3. Test your changes locally

4. Commit your changes:
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

6. Create a pull request

## Code Style Guidelines

### Python (Backend)

- Follow PEP 8 style guide
- Use type hints where appropriate
- Write docstrings for functions and classes
- Keep functions focused and single-purpose
- Use meaningful variable names

### TypeScript (Frontend)

- Follow ESLint rules
- Use TypeScript for type safety
- Use functional components with hooks
- Keep components small and focused
- Use meaningful prop and variable names

### Git Commit Messages

Use conventional commits format:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Examples:
- `feat: add movie search functionality`
- `fix: resolve poster loading issue`
- `docs: update deployment guide`

## Testing

### Backend Testing

```bash
cd backend
pytest tests/
```

### Frontend Testing

```bash
cd frontend
npm test
```

### Manual Testing

1. Start backend: `cd backend && uvicorn app.main:app --reload`
2. Start frontend: `cd frontend && npm run dev`
3. Test all features manually
4. Check browser console for errors

## Pull Request Guidelines

### Before Submitting

- [ ] Code follows style guidelines
- [ ] Changes are tested locally
- [ ] Documentation is updated if needed
- [ ] Commit messages are clear
- [ ] No console errors or warnings
- [ ] Responsive design works on different screen sizes

### Pull Request Description

Include in your PR:
- Description of changes
- Screenshots for UI changes
- Testing performed
- Related issues (if any)

## Project Structure

```
backend/
├── app/
│   ├── api/          # API endpoints
│   ├── core/         # Configuration
│   ├── models/       # Data models
│   └── services/     # Business logic
frontend/
├── src/
│   ├── components/   # React components
│   ├── hooks/        # Custom hooks
│   ├── services/     # API services
│   └── utils/        # Utility functions
```

## Common Tasks

### Adding a New API Endpoint

1. Create endpoint in `backend/app/api/`
2. Add request/response models in `backend/app/models/`
3. Add business logic in `backend/app/services/`
4. Update API documentation
5. Add tests

### Adding a New Frontend Component

1. Create component in `frontend/src/components/`
2. Add TypeScript interfaces for props
3. Style with TailwindCSS
4. Add to parent component
5. Test responsiveness

### Updating Model Files

1. Retrain or update models
2. Save to `model/` directory
3. Track with Git LFS:
   ```bash
   git lfs track "model/*.pkl"
   ```
4. Commit and push changes

## Issues and Bug Reports

When reporting issues, include:
- Description of the problem
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Environment details (OS, browser, etc.)

## Questions and Support

- Open an issue for bugs or feature requests
- Check existing issues before creating new ones
- Be respectful and constructive in discussions

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

## Recognition

Contributors will be acknowledged in the project documentation.

Thank you for contributing!
