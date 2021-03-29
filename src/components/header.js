import { useContext } from "react";
import FirebaseContext from "../context/firebase";
import UserContext from "../context/user";
import * as ROUTES from "../constants/routes";
import { Link, useHistory } from "react-router-dom";

export default function Header() {
  const { user } = useContext(UserContext);
  const { firebase } = useContext(FirebaseContext);
  const history = useHistory();

  return (
    <header className="h-16 bg-white border-b border-gray-primary mb-8">
      <div className="container mx-auto max-w-screen-lg h-full">
        <div className="flex justify-between h-full">
          <div className="text-gray-700 text-center flex items-center align-items cursor-pointer">
            <h1 className="flex justify-center w-full">
              <Link to={ROUTES.DASHBOARD} aria-label="Instagram logo">
                <img
                  src="/images/logo.png"
                  alt="Instagram"
                  className="mt-2 w-6/12"
                />
              </Link>
            </h1>
          </div>
          <div className="text-gray-700 text-center flex items-center align-items justify-between">
            {user ? (
              <>
                <Link to={ROUTES.DASHBOARD} aria-label="Dashboard">
                  <i className="fa fa-home fa-2x mr-4"></i>
                </Link>

                <button
                  type="button"
                  title="Sign Out"
                  onClick={() => {
                    firebase.auth().signOut();
                    history.push(ROUTES.LOGIN);
                  }}
                >
                  <i className="fa fa-bolt fa-2x mr-4"></i>
                </button>
                <div className="flex items-center cursor-pointer">
                  <Link to={`/p/${user.displayName}`}>
                    <img
                      className="rounded-full h-8 w-8 flex"
                      src={`/images/avatars/${user.displayName}.jpg`}
                      alt={`${user.displayName} profile`}
                    />
                  </Link>
                </div>
              </>
            ) : (
              <>
                <Link to={ROUTES.LOGIN}>
                  <button
                    type="button"
                    className="bg-blue-medium font-bold text-sm rounded text-white w-20 h-8"
                  >
                    Log In
                  </button>
                </Link>
                <Link to={ROUTES.SIGN_UP}>
                  <button
                    type="button"
                    className="font-bold text-sm rounded text-blue-medium w-20 h-8"
                  >
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
