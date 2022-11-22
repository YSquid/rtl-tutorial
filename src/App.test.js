import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

// test('renders learn react link', () => {
//   //1) Rendering the component that we want to test
//   render(<App />);

//   //2)Finding a specific element within the component
//   //Using the screen.getByText method with a Regular Expression
//   const linkElement = screen.getByText(/learn react/i);

//   //3) Assertion - expect(ourElement).toBeSomething
//   expect(linkElement).toBeInTheDocument();
// });

test("inputs should be initially empty", () => {
  render(<App />);
  const emailInputElement = screen.getByRole("textbox", { name: /email/i });
  const passwordInputElement = screen.getByLabelText("Password");
  const passwordConfirmInputElement =
    screen.getByLabelText(/confirm password/i);
  expect(emailInputElement.value).toBe("");
  expect(passwordInputElement.value).toBe("");
  expect(passwordConfirmInputElement.value).toBe("");
});

test("should be able to type an email", () => {
  render(<App />);
  const emailInputElement = screen.getByRole("textbox", { name: /email/i });
  userEvent.type(emailInputElement, "selena@gmail.com");
  expect(emailInputElement.value).toBe("selena@gmail.com");
});

test("should be able to type a password", () => {
  render(<App />);
  const passwordInputElement = screen.getByLabelText("Password");
  userEvent.type(passwordInputElement, "swordfish");
  expect(passwordInputElement.value).toBe("swordfish");
});

test("should be able to type a confirmation password", () => {
  render(<App />);
  const passwordConfirmInputElement =
    screen.getByLabelText(/confirm password/i);
  userEvent.type(passwordConfirmInputElement, "swordfish");
  expect(passwordConfirmInputElement.value).toBe("swordfish");
});

test("should show email error message on invalid email", () => {
  render(<App />);
  const emailInputElement = screen.getByRole("textbox", { name: /email/i });
  const submitButtonElement = screen.getByRole("button", { name: /submit/i });
  //first time we call this element, its null as we haven't submitted invalid yet
  const emailErrorElement = screen.queryByText(/the email you input is invalid/i);
  expect(emailErrorElement).not.toBeInTheDocument

  userEvent.type(emailInputElement, "selenagmail.com");
  userEvent.click(submitButtonElement)
  //now we call it again in a new variable, after we have performed the submit action
  const emailErrorElementAgain = screen.queryByText(/the email you input is invalid/i);
  expect(emailErrorElementAgain).toBeInTheDocument()
});
