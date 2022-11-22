import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

test("1) inputs should be initially empty", () => {
  render(<App />);
  const emailInputElement = screen.getByRole("textbox", { name: /email/i });
  const passwordInputElement = screen.getByLabelText("Password");
  const confirmPasswordInputElement =
    screen.getByLabelText(/confirm password/i);
  expect(emailInputElement.value).toBe("");
  expect(passwordInputElement.value).toBe("");
  expect(confirmPasswordInputElement.value).toBe("");
});

test("2) should be able to type an email", () => {
  render(<App />);
  const emailInputElement = screen.getByRole("textbox", { name: /email/i });
  userEvent.type(emailInputElement, "selena@gmail.com");
  expect(emailInputElement.value).toBe("selena@gmail.com");
});

test("3) should be able to type a password", () => {
  render(<App />);
  const passwordInputElement = screen.getByLabelText("Password");
  userEvent.type(passwordInputElement, "swordfish");
  expect(passwordInputElement.value).toBe("swordfish");
});

test("4) should be able to type a confirmation password", () => {
  render(<App />);
  const confirmPasswordInputElement =
    screen.getByLabelText(/confirm password/i);
  userEvent.type(confirmPasswordInputElement, "swordfish");
  expect(confirmPasswordInputElement.value).toBe("swordfish");
});

test("5) should show email error message on invalid email", () => {
  render(<App />);
  const emailInputElement = screen.getByRole("textbox", { name: /email/i });
  const submitButtonElement = screen.getByRole("button", { name: /submit/i });
  //first time we call this element, its null as we haven't submitted invalid yet
  const emailErrorElement = screen.queryByText(
    /the email you input is invalid/i
  );
  expect(emailErrorElement).not.toBeInTheDocument;

  userEvent.type(emailInputElement, "selenagmail.com");
  userEvent.click(submitButtonElement);
  //now we call it again in a new variable, after we have performed the submit action
  const emailErrorElementAgain = screen.queryByText(
    /the email you input is invalid/i
  );
  expect(emailErrorElementAgain).toBeInTheDocument();
});

test("6) should show password error if password is less than 5 characters", () => {
  //setup - render App, get value of elements 'appear' before inputs
  render(<App />);
  const emailInputElement = screen.getByRole("textbox", { name: /email/i });
  const passwordInputElement = screen.getByLabelText("Password");
  const submitButtonElement = screen.getByRole("button", { name: /submit/i });

  //userEvents to input valid email, and invalid password, and submit
  userEvent.type(emailInputElement, "selena@gmail.com");
  userEvent.type(passwordInputElement, "word");
  userEvent.click(submitButtonElement);

  //get value of error elements that render after submit (or not render in case of emailErrorElement)
  const emailErrorElement = screen.queryByText(
    /the email you input is invalid/i
  );
  const passwordErrorElement = screen.queryByText(
    /the password you entered should contain 5 or more characters/i
  );

  //assertions - no emailErrorElement in doc, passwordErrorElement in doc
  expect(emailErrorElement).not.toBeInTheDocument();
  expect(passwordErrorElement).toBeInTheDocument();
});

test("7) confirm password should match password", () => {
  //setup
  render(<App />);
  const emailInputElement = screen.getByRole("textbox", { name: /email/i });
  const passwordInputElement = screen.getByLabelText("Password");
  const confirmPasswordInputElement =
    screen.getByLabelText(/confirm password/i);
  const submitButtonElement = screen.getByRole("button", { name: /submit/i });

  //actions - make PW not match
  userEvent.type(emailInputElement, "selena@gmail.com");
  userEvent.type(passwordInputElement, "swordfish");
  userEvent.type(confirmPasswordInputElement, "sword");
  userEvent.click(submitButtonElement);

  const passwordsMatchError = screen.queryByText(/the passwords don\'t match - try again/i)

  //assertions - PW not matching
  expect(passwordsMatchError).toBeInTheDocument
  expect(confirmPasswordInputElement.value).not.toEqual(passwordInputElement.value);

  //actions - make PW match
  userEvent.clear(confirmPasswordInputElement)
  userEvent.type(confirmPasswordInputElement, "swordfish")

  //assertions - PW matching
  expect(passwordsMatchError).not.toBeInTheDocument
  expect(confirmPasswordInputElement.value).toEqual(passwordInputElement.value);

});
