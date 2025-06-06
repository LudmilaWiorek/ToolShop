# ToolShop – Test Automation Project (Playwright + TypeScript)

This project contains automated UI and API tests for a fictional online tool store, written in Playwright using TypeScript.

## What does it test?

- Adding a product to favourites
- Navigating through categories
- Validating UI messages and page titles
- Sending API requests using Playwright's request context
- Verifying login module and session status
- Verifying payment module
- Verifying recovery password functionality

## Key Features

- Page Object Model for better structure
- Fixtures for reusable test logic

## Installation and setup

### Prerequisites

- Node.js installed (v16+)
- Git
- Recommended: Visual Studio Code with the following extensions:
  - Playwright Test for VS Code
  - ESLint
  - Prettier

### Setup steps

```bash
# Clone the repository
git clone https://github.com/LudmilaWiorek/ToolShop
cd ToolShop

# Install project dependencies
npm install

# Install Playwright browsers
npx playwright install

# Install Faker.js library
npm install --save-dev @faker-js/faker

## Technologies Used

- Playwright (TypeScript)
- Swagger (API exploration)
- VS Code



```
