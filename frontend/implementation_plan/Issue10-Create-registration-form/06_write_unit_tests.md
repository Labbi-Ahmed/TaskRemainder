# 06_write_unit_tests.md

**Objective:** Write unit tests for the `RegistrationForm` component.

**Details:**
- Create a test file `RegistrationForm.test.js` (or `.tsx`) alongside the component.
- Use a testing library like React Testing Library or Enzyme (check `package.json` for existing setup).
- Test the rendering of the form and its input fields.
- Test input field changes and state updates.
- Test validation logic:
    - Ensure error messages appear for invalid inputs.
    - Ensure form submission is prevented for invalid inputs.
- Test form submission:
    - Simulate user input and form submission.
    - Mock the API call to verify that the correct data is sent.
    - Verify success/error messages are displayed correctly after submission.