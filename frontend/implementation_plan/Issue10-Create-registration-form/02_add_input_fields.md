# 02_add_input_fields.md

**Objective:** Add input fields for username, email, and password to the `RegistrationForm` component.

**Details:**
- Inside `RegistrationForm.js`, add `<input>` elements for:
    - Username (type="text", name="username", placeholder="Username")
    - Email (type="email", name="email", placeholder="Email")
    - Password (type="password", name="password", placeholder="Password")
- Add corresponding `label` elements for accessibility.
- Implement state management for each input field using `useState` hook (e.g., `username`, `email`, `password`).
- Bind input values to their respective state variables and update state on `onChange` events.
- Add a submit button.