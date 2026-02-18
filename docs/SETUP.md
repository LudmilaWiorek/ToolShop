# Setup Guide

## Prerequisites

- Node.js (v16+)
- Git
- Recommended: Visual Studio Code with the following extensions:
  - Playwright Test for VS Code
  - ESLint
  - Prettier

## Installation Steps

### 1. Clone the repository

```bash
git clone https://github.com/LudmilaWiorek/ToolShop
cd ToolShop
```

### 2. Install project dependencies

```bash
npm install
```

### 3. Install Playwright browsers

```bash
npx playwright install
```

## Running Tests

### Run all tests

```bash
npm run test
```

### Run tests in headed mode (with browser UI)

```bash
npm run test:headed
```

### Run tests with Playwright UI

```bash
npm run test:ui
```

### View test report

```bash
npm run show-report
```

### Repeat tests

```bash
npm run repeat-tests
```

## Code Quality

### Format code with Prettier

```bash
npm run format
```

### Run linter (ESLint)

```bash
npm run lint
```

## Project Configuration

### TypeScript Configuration

- **File**: `tsconfig.json`
- **Path Aliases**:
  - `@pages/*` - Page objects in src/pages/
  - `@api/*` - API clients in src/api/
  - `@fixtures/*` - Fixtures in src/fixtures/
  - `@models/*` - Data models in src/models/
  - `@enums/*` - Enumerations in src/enums/
  - `@factories/*` - Data factories in src/factories/
  - `@data/*` - Test data in src/data/
  - `@config/*` - Configuration in src/config/
  - `@utils/*` - Utilities in src/utils/

### Playwright Configuration

- **File**: `playwright.config.ts`
- **Base URL**: https://practicesoftwaretesting.com/
- **Test Directory**: ./tests
- **Browsers**: Chromium (default)

## Environment Variables

Environment variables can be configured in `src/config/env.config`.

## Session Management

Authentication sessions are stored in `auth/session.json` for reuse across test runs.
