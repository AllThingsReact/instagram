import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import Login from "../../pages/login";
import FirebaseContext from "../../context/firebase";
import { BrowserRouter as Router } from "react-router-dom";
import { DASHBOARD, LOGIN } from "../../constants/routes";

const mockHistoryPush = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

describe("<Login />", () => {
  it("renders the login page with a form submission and logs the user in", async () => {
    const successFullLogin = jest.fn(() => Promise.resolve("Signed In"));
    const firebase = {
      auth: jest.fn(() => ({
        signInWithEmailAndPassword: successFullLogin,
      })),
    };

    const { getByTestId, getByPlaceholderText, queryByTestId } = render(
      <Router>
        <FirebaseContext.Provider value={{ firebase }}>
          <Login />
        </FirebaseContext.Provider>
      </Router>
    );

    await act(async () => {
      expect(document.title).toEqual("Login - Instagram");

      await fireEvent.change(getByPlaceholderText("Email Address"), {
        target: { value: "test@email.com" },
      });
      await fireEvent.change(getByPlaceholderText("Password"), {
        target: { value: "password" },
      });
      fireEvent.submit(getByTestId("login"));

      expect(successFullLogin).toHaveBeenCalled();
      expect(successFullLogin).toHaveBeenLastCalledWith(
        "test@email.com",
        "password"
      );

      await waitFor(() => {
        expect(mockHistoryPush).toHaveBeenCalledWith(DASHBOARD);
        expect(getByPlaceholderText("Email Address").value).toBe(
          "test@email.com"
        );
        expect(getByPlaceholderText("Password").value).toBe("password");
        expect(queryByTestId("error")).toBeFalsy();
      });
    });
  });
});
