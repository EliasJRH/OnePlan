export default function () {
  return (
    <>
      <div className="app-link">
        <span>You are now signed out of {process.env.GADGET_APP} &nbsp;</span>
      </div>
      <div>
        <p className="description">
          Start joining events with friends by signing in
        </p>
      </div>
    </>
  );
}
