import {
  SignedInOrRedirect,
  SignedOut,
  SignedOutOrRedirect,
  Provider,
  SignedIn,
  useSignOut,
} from "@gadgetinc/react";
import { Suspense, useEffect } from "react";
import {
  Outlet,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  useNavigate,
  Link,
} from "react-router";
import { api } from "../api";
import Index from "../routes/index";
import SignedInPage from "../routes/signed-in";
import SignInPage from "../routes/sign-in";
import SignUpPage from "../routes/sign-up";
import ResetPasswordPage from "../routes/reset-password";
import VerifyEmailPage from "../routes/verify-email";
import ChangePassword from "../routes/change-password";
import ForgotPassword from "../routes/forgot-password";
import EventsPage from "../routes/events-page";
import EventsDetails from "../routes/event-details";
import EventCreate from "../routes/event-create";
import EventEdit from "../routes/event-edit"
import "./App.css";

const App = () => {
  useEffect(() => {
    document.title = `${process.env.GADGET_APP}`;
  }, []);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={
            <SignedOutOrRedirect>
              <Index />
            </SignedOutOrRedirect>
          }
        />
        <Route
          path="index"
          element={
            <SignedOutOrRedirect redirect="/">
              <Index />
            </SignedOutOrRedirect>
          }
        />
        <Route
          path="events"
          element={
            <SignedInOrRedirect>
              <EventsPage />
            </SignedInOrRedirect>
          }
        />
        <Route
          path="events/create"
          element={
            <SignedInOrRedirect>
              <EventCreate />
            </SignedInOrRedirect>
          }
        />
        <Route
          path="signed-in"
          element={
            <SignedInOrRedirect>
              <SignedInPage />
            </SignedInOrRedirect>
          }
        />
        <Route
          path="events/:eventId"
          element={
            <SignedInOrRedirect>
              <EventsDetails />
            </SignedInOrRedirect>
          }
        />
        <Route
          path="events/edit/:eventId"
          element={
            <SignedInOrRedirect>
              <EventEdit />
            </SignedInOrRedirect>
          }
        />
        <Route
          path="change-password"
          element={
            <SignedInOrRedirect>
              <ChangePassword />
            </SignedInOrRedirect>
          }
        />
        <Route
          path="forgot-password"
          element={
            <SignedOutOrRedirect>
              <ForgotPassword />
            </SignedOutOrRedirect>
          }
        />
        <Route
          path="sign-in"
          element={
            <SignedOutOrRedirect>
              <SignInPage />
            </SignedOutOrRedirect>
          }
        />
        <Route
          path="sign-up"
          element={
            <SignedOutOrRedirect>
              <SignUpPage />
            </SignedOutOrRedirect>
          }
        />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        <Route path="verify-email" element={<VerifyEmailPage />} />
      </Route>
    )
  );

  return (
    <Suspense fallback={<></>}>
      <RouterProvider router={router} />
    </Suspense>
  );
};

const Layout = () => {
  const navigate = useNavigate();

  return (
    <Provider
      api={api}
      navigate={navigate}
      auth={window.gadgetConfig.authentication}
    >
      <Header />
      <div className="app">
        <div className="app-content">
          <div className="main">
            <Outlet />
          </div>
        </div>
      </div>
    </Provider>
  );
};

const Header = () => {
  const signOut = useSignOut();
  return (
    <div className="header">
      <a
        href="/"
        target="_self"
        rel="noreferrer"
        style={{ textDecoration: "none" }}
      >
        {/* <div className="logo">{process.env.GADGET_APP}</div>
         */}
        <div>
          <h4>One Plan</h4>
        </div>
      </a>
      <div className="header-content">
        <SignedOut>
          <Link to="/sign-in" style={{ color: "black" }}>
            Sign in
          </Link>
          <Link to="/sign-up" style={{ color: "black" }}>
            Sign up
          </Link>
        </SignedOut>
        <SignedIn>
          <Link onClick={signOut}>Sign Out</Link>
          <Link to="/change-password">Change password</Link>{" "}
        </SignedIn>
      </div>
    </div>
  );
};

export default App;
