import { useUser, useSignOut } from "@gadgetinc/react";
import { api } from "../api";
import { Link, useNavigate } from "react-router";

export default function () {
  const user = useUser(api);
  const signOut = useSignOut();
  const navigate = useNavigate();

  const goToEventPage = () => {
    navigate('/events');
  };

  return user ? (
    <>
      <div className="container text-center">
        <h1>
          Welcome {user.firstName} {user.lastName}!
        </h1>
        <p>Let's start off by going to the events page</p>
        <button
          style={{ marginTop: "2vh" }}
          type="button"
          className="btn btn-primary btn-lg"
          onClick={goToEventPage}
        >
          Go to Events
        </button>
      </div>
    </>
  ) : null;
}