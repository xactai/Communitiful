# Playwright E2E Test Suite

Comprehensive end-to-end tests for the Communitiful application.

## Test Structure

The test suite is organized into multiple files covering different aspects of the application:

### Test Files

1. **`example.spec.ts`** - Basic smoke tests
   - Homepage loading
   - Basic page structure

2. **`landing.spec.ts`** - Landing page tests
   - Landing page display
   - Mode selection (Companion/Hospital)
   - Navigation to About and Privacy pages
   - Language toggle

3. **`companion-flow.spec.ts`** - Companion mode user journey
   - Full companion flow (landing → location scan → auth → disclaimer → avatar → chat)
   - Location scan handling
   - Back navigation from auth

4. **`hospital-flow.spec.ts`** - Hospital registration flow
   - Hospital form navigation
   - Form field display and filling
   - Form submission and confirmation
   - Back navigation

5. **`chat.spec.ts`** - Chat functionality
   - Chat interface display
   - Message sending
   - Navigation to settings and relaxation
   - Online users indicator
   - Message reactions

6. **`navigation.spec.ts`** - Navigation and settings
   - Settings navigation
   - Relaxation page navigation
   - Leave room functionality
   - Language changes
   - About Companions navigation

7. **`e2e-complete-flow.spec.ts`** - Complete end-to-end journey
   - Full companion journey from landing to chat interaction
   - Hospital registration flow
   - Comprehensive flow verification

## Running Tests

### Run All Tests
```bash
npx playwright test
```

### Run Tests in UI Mode (Interactive)
```bash
npx playwright test --ui
# or
npm run test:ui
```

### Run Specific Test File
```bash
npx playwright test tests/landing.spec.ts
npx playwright test tests/companion-flow.spec.ts
npx playwright test tests/e2e-complete-flow.spec.ts
```

### Run Tests in Specific Browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Run Tests in Headed Mode (See Browser)
```bash
npx playwright test --headed
```

### Run Tests with Debug Mode
```bash
npx playwright test --debug
```

### Generate Test Code (Record Tests)
```bash
npx playwright codegen http://localhost:8080
```

## Test Coverage

The test suite covers:

✅ **Landing Page**
- Page loading and structure
- Mode selection
- Navigation to information pages
- Language toggle

✅ **Companion Mode Flow**
- Location scan
- Authentication (phone/OTP)
- Disclaimer acceptance
- Avatar display
- Chat interface

✅ **Hospital Mode Flow**
- Form navigation
- Form field interaction
- Form submission
- Confirmation page

✅ **Chat Functionality**
- Message input and sending
- Settings navigation
- Relaxation page navigation
- Online users
- Message reactions

✅ **Navigation**
- Settings page
- Relaxation page
- Leave room
- Language changes
- About pages

## Test Configuration

Tests are configured in `playwright.config.ts`:
- **Base URL**: `http://localhost:8080`
- **Auto-start server**: Dev server starts automatically before tests
- **Browsers**: Chromium, Firefox, WebKit
- **Test directory**: `./tests`
- **Timeout**: 120 seconds for web server startup

## Notes

- Tests are designed to be resilient to UI changes
- Some tests use conditional checks (`.catch(() => false)`) to handle optional features
- Tests wait for appropriate timeouts to handle async operations
- The dev server is automatically started before tests run
- Tests can handle both successful flows and error states

## Troubleshooting

### Tests fail with connection refused
- Ensure the dev server can start on port 8080
- Check that no other process is using port 8080
- The webServer config should auto-start the server

### Tests fail to find elements
- Increase timeout values in test files
- Check that the UI hasn't changed significantly
- Use `--headed` mode to see what's happening

### Tests are slow
- Run specific test files instead of all tests
- Use `--project=chromium` to test only one browser
- Reduce the number of workers in `playwright.config.ts`

## Best Practices

1. **Run tests before committing**: `npx playwright test`
2. **Use UI mode for debugging**: `npx playwright test --ui`
3. **Run specific tests during development**: `npx playwright test tests/chat.spec.ts`
4. **Check test reports**: After running tests, open `playwright-report/index.html`

## Test Reports

After running tests, view the HTML report:
```bash
npx playwright show-report
```

This opens an interactive report showing:
- Test results
- Screenshots on failure
- Video recordings
- Trace files for debugging

