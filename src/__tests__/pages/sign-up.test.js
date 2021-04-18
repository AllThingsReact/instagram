import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import FirebaseContext from "../../context/firebase";
import { BrowserRouter as Router } from "react-router-dom";
import { DASHBOARD } from "../../constants/routes";
import SignUp from "../../pages/sign-up";
import { doesUsernameExist } from "../../services/firebase";

const mockHistoryPush = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

jest.mock("../../services/firebase");

describe("<SignUp />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the SignUp page with a form submission and signs up the user", async () => {
    const firebase = {
      auth: jest.fn(() => {
        return {
          createUserWithEmailAndPassword: jest.fn(() => {
            return {
              user: {
                updateProfile: jest.fn(() => {
                  return Promise.resolve("created");
                }),
              },
            };
          }),
        };
      }),
      firestore: jest.fn(() => {
        return {
          collection: jest.fn(() => {
            return {
              add: jest.fn(() => {
                return Promise.resolve("added");
              }),
            };
          }),
        };
      }),
    };

    const { getByTestId, getByPlaceholderText, queryByTestId } = render(
      <Router>
        <FirebaseContext.Provider value={{ firebase }}>
          <SignUp />
        </FirebaseContext.Provider>
      </Router>
    );

    await act(async () => {
      doesUsernameExist.mockImplementation(() => Promise.resolve([]));

      await fireEvent.change(getByPlaceholderText("Username"), {
        target: { value: "testUser" },
      });
      await fireEvent.change(getByPlaceholderText("Full name"), {
        target: { value: "Test User" },
      });
      await fireEvent.change(getByPlaceholderText("Email Address"), {
        target: { value: "test@email.com" },
      });
      await fireEvent.change(getByPlaceholderText("Password"), {
        target: { value: "password" },
      });
      fireEvent.submit(getByTestId("signup"));

      expect(document.title).toEqual("Sign Up - Instagram");
      await expect(doesUsernameExist).toHaveBeenCalled();

      await waitFor(() => {
        expect(mockHistoryPush).toHaveBeenCalledWith(DASHBOARD);
        expect(getByPlaceholderText("Username").value).toBe("testUser");
        expect(getByPlaceholderText("Full name").value).toBe("Test User");
        expect(getByPlaceholderText("Email Address").value).toBe(
          "test@email.com"
        );
        expect(getByPlaceholderText("Password").value).toBe("password");
        expect(queryByTestId("error")).toBeFalsy();
      });
    });
  });

  it("renders the SignUp page with a form submission and fails to sign up the user", async () => {
    const firebase = {
      auth: jest.fn(() => {
        return {
          createUserWithEmailAndPassword: jest.fn(() => {
            return {
              user: {
                updateProfile: jest.fn(() => {
                  return Promise.resolve("created");
                }),
              },
            };
          }),
        };
      }),
      firestore: jest.fn(() => {
        return {
          collection: jest.fn(() => {
            return {
              add: jest.fn(() => {
                return Promise.reject({
                  message: "error",
                });
              }),
            };
          }),
        };
      }),
    };

    const { getByTestId, getByPlaceholderText, queryByTestId } = render(
      <Router>
        <FirebaseContext.Provider value={{ firebase }}>
          <SignUp />
        </FirebaseContext.Provider>
      </Router>
    );

    await act(async () => {
      doesUsernameExist.mockImplementation(() => Promise.resolve([]));

      await fireEvent.change(getByPlaceholderText("Username"), {
        target: { value: "testUser" },
      });
      await fireEvent.change(getByPlaceholderText("Full name"), {
        target: { value: "Test User" },
      });
      await fireEvent.change(getByPlaceholderText("Email Address"), {
        target: { value: "test@email.com" },
      });
      await fireEvent.change(getByPlaceholderText("Password"), {
        target: { value: "password" },
      });
      fireEvent.submit(getByTestId("signup"));

      expect(document.title).toEqual("Sign Up - Instagram");
      await expect(doesUsernameExist).toHaveBeenCalled();

      await waitFor(() => {
        expect(mockHistoryPush).not.toHaveBeenCalled();
        expect(getByPlaceholderText("Full name").value).toBe("");
        expect(getByPlaceholderText("Email Address").value).toBe("");
        expect(getByPlaceholderText("Password").value).toBe("");
        expect(queryByTestId("error")).toBeTruthy();
      });
    });
  });

  it("renders the SignUp page with a form submission and fails to sign up when username already exists", async () => {
    const firebase = {
      auth: jest.fn(() => {
        return {
          createUserWithEmailAndPassword: jest.fn(() => {
            return {
              user: {
                updateProfile: jest.fn(() => {
                  return Promise.resolve("created");
                }),
              },
            };
          }),
        };
      }),
      firestore: jest.fn(() => {
        return {
          collection: jest.fn(() => {
            return {
              add: jest.fn(() => {
                return Promise.reject({
                  message: "error",
                });
              }),
            };
          }),
        };
      }),
    };

    const { getByTestId, getByPlaceholderText, queryByTestId } = render(
      <Router>
        <FirebaseContext.Provider value={{ firebase }}>
          <SignUp />
        </FirebaseContext.Provider>
      </Router>
    );

    await act(async () => {
      doesUsernameExist.mockImplementation(() => Promise.resolve([true]));

      await fireEvent.change(getByPlaceholderText("Username"), {
        target: { value: "testUser" },
      });
      await fireEvent.change(getByPlaceholderText("Full name"), {
        target: { value: "Test User" },
      });
      await fireEvent.change(getByPlaceholderText("Email Address"), {
        target: { value: "test@email.com" },
      });
      await fireEvent.change(getByPlaceholderText("Password"), {
        target: { value: "password" },
      });
      fireEvent.submit(getByTestId("signup"));

      expect(document.title).toEqual("Sign Up - Instagram");
      await expect(doesUsernameExist).toHaveBeenCalled();

      await waitFor(() => {
        expect(mockHistoryPush).not.toHaveBeenCalled();
        expect(getByPlaceholderText("Username").value).toBe("");
        expect(queryByTestId("error")).toBeTruthy();
      });
    });
  });
});
