import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

//a function that is invoked before each test
beforeEach(() => {
  render(<App />);
});

//after each - good for cleanup
afterEach(() => {});

//define helper function with destructuring params
//within helper, define our element selectors
//if we provide as argument a certain param, type that into the element using its selector
//retur the selectors at the end so we can access them in the tests
const typeIntoForm = ({ email, password, confirmPassword }) => {
  const emailInputElement = screen.getByRole("textbox", { name: /email/i });
  const passwordInputElement = screen.getByLabelText("Password");
  const confirmPasswordInputElement =
    screen.getByLabelText(/confirm password/i);

  if (email) {
    userEvent.type(emailInputElement, email);
  }

  if (password) {
    userEvent.type(passwordInputElement, password);
  }

  if (confirmPassword) {
    userEvent.type(confirmPasswordInputElement, confirmPassword);
  }

  return {
    emailInputElement,
    passwordInputElement,
    confirmPasswordInputElement,
  };
};

const submitForm = () => {
  const submitButtonElement = screen.getByRole("button", { name: /submit/i });
  userEvent.click(submitButtonElement);
};

test("1) inputs should be initially empty", () => {
  const emailInputElement = screen.getByRole("textbox", { name: /email/i });
  const passwordInputElement = screen.getByLabelText("Password");
  const confirmPasswordInputElement =
    screen.getByLabelText(/confirm password/i);
  expect(emailInputElement.value).toBe("");
  expect(passwordInputElement.value).toBe("");
  expect(confirmPasswordInputElement.value).toBe("");
});

test("2) should be able to type an email", () => {
  //this call does 2 things
  //creates the const emailInputElement which equals the returned object.emailInputElement value
  //calls the function with argument {email: "selena@gmail.com"} passed in
  //result is we clal the function, the if passes for email so types that in, and returns emailInputElement to our local variable from the returned value of the function
  const { emailInputElement } = typeIntoForm({
    email: "selena@gmail.com",
  });
  expect(emailInputElement.value).toBe("selena@gmail.com");
});

test("3) should be able to type a password", () => {
  //comments left for illustration
  // const passwordInputElement = screen.getByLabelText("Password");
  // userEvent.type(passwordInputElement, "swordfish");
  const { passwordInputElement } = typeIntoForm({ password: "swordfish" });
  expect(passwordInputElement.value).toBe("swordfish");
});

test("4) should be able to type a confirmation password", () => {
  const { confirmPasswordInputElement } = typeIntoForm({
    confirmPassword: "swordfish",
  });
  expect(confirmPasswordInputElement.value).toBe("swordfish");
});

test("5) should show email error message on invalid email", () => {
  //first time we call this element, its null as we haven't submitted invalid yet
  const emailErrorElement = screen.queryByText(
    /the email you input is invalid/i
  );
  expect(emailErrorElement).not.toBeInTheDocument;
  typeIntoForm({ email: "selenagmail.com" });
  submitForm();
  //now we call it again in a new variable, after we have performed the submit action
  const emailErrorElementAgain = screen.queryByText(
    /the email you input is invalid/i
  );
  expect(emailErrorElementAgain).toBeInTheDocument();
});

test("6) should show password error if password is less than 5 characters", () => {
  typeIntoForm({ email: "selena@gmail.com", password: "word" });
  submitForm();

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
  //actions - make PW not match
  // userEvent.type(emailInputElement, "selena@gmail.com");
  // userEvent.type(passwordInputElement, "swordfish");
  // userEvent.type(confirmPasswordInputElement, "sword");
  const { passwordInputElement, confirmPasswordInputElement } = typeIntoForm({
    email: "selena@gmail.com",
    password: "swordfish",
    confirmPassword: "sword",
  });
  submitForm();
  const passwordsMatchError = screen.queryByText(
    /the passwords don\'t match - try again/i
  );

  //assertions - PW not matching
  expect(passwordsMatchError).toBeInTheDocument;
  expect(confirmPasswordInputElement.value).not.toEqual(
    passwordInputElement.value
  );

  //actions - make PW match
  userEvent.clear(confirmPasswordInputElement);
  typeIntoForm({ confirmPassword: "swordfish" });
  submitForm();

  //assertions - PW matching
  expect(passwordsMatchError).not.toBeInTheDocument;
  expect(confirmPasswordInputElement.value).toEqual(passwordInputElement.value);
});

test("8) no error messages on all valid inputs", () => {
  //this is the "happy path" test - asserting no errors when everything done right

  // userEvent.type(emailInputElement, "selena@gmail.com");
  // userEvent.type(passwordInputElement, "swordfish");
  // userEvent.type(confirmPasswordInputElement, "swordfish");
  typeIntoForm({
    email: "selena@gmail.com",
    password: "swordfish",
    confirmPassword: "swordfish",
  });
  submitForm();

  const emailErrorElement = screen.queryByText(
    /the email you input is invalid/i
  );

  const passwordErrorElement = screen.queryByText(
    /the password you entered should contain 5 or more characters/i
  );

  const passwordsMatchError = screen.queryByText(
    /the passwords don\'t match - try again/i
  );

  expect(emailErrorElement).not.toBeInTheDocument();
  expect(passwordErrorElement).not.toBeInTheDocument();
  expect(passwordsMatchError).not.toBeInTheDocument();
});
