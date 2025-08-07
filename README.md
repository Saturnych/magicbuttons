# magicbuttons

MagicButtons App - Show a button to only 10% of users

## Key Features

- ✅ **Fingerprint** – Using fingerprint to track user's ID and calculate percentage
- ✅ **Modern Stack** – Powered by SvelteKit and Tailwind CSS, deployed on Vercel, Supabase as DB
- ✅ **End-to-End Testing** – Comprehensive browser testing using Playwright
- ✅ **CI/CD Pipeline** – GitHub workflows for testing and email notification if tests succeed

## Technical Implementation

- **Frontend**: SvelteKit, Typescript, Tailwind CSS
- **Backend**: API based on SvelteKit and Typescript, Supabase as DB, SSE for events
- **Hosting**: Automatically deployed on Vercel
- **Testing**:
  - Playwright for end-to-end testing
  - GitHub Actions for automated test execution

## Development & CI/CD

- **Vercel Hosting**: Automatic deployments from GitHub repository
- **GitHub Workflows**:
  - Automated testing via GitHub Actions
  - Email notification after tests successfully passed
- **Playwright Test Suite**:
  - Button state validation
  - Cross-browser compatibility

[**Live Demo**](https://magicbuttons.vercel.app) | [**GitHub Repository**](https://github.com/Saturnych/magicbuttons)
