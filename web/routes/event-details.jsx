import { useUser, useFindOne } from "@gadgetinc/react";
import { MessageList } from "../components/MessageList";
import { MessageInput } from "../components/MessageInput";
import { useNavigate, useParams } from "react-router";
import { api } from "../api";

export default function () {
  const user = useUser(api);
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [{ data: event, error, fetching }] = useFindOne(api.event, eventId);

  if (fetching) {
    return (
      <div className="container-md py-4 px-3">
        <div className="d-flex justify-content-center align-items-center min-vh-50">
          <div className="text-center p-4">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-secondary mb-0">Loading event details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-md py-4 px-3">
        <div
          className="alert alert-danger d-flex align-items-center"
          role="alert"
        >
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          <div>Error loading event: {error.message}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-3">
      <button
        className="btn btn-outline-secondary mb-3 d-inline-flex align-items-center px-3 py-2 position-sticky top-0 start-0 z-1 bg-white"
        onClick={() => navigate("/events")}
      >
        <span className="me-2">←</span>Back to Events
      </button>
      <div
        className="overflow-y-auto"
        style={{ maxHeight: "calc(100vh - 100px)" }}
      >
        <div
          className={`card border ${!event?.headerImage?.url ? "h-100" : ""}`}
        >
          {event?.headerImage?.url && (
            <div className="card-img-wrapper p-3">
              <img
                src={event.headerImage.url}
                className="card-img-top img-fluid rounded"
                style={{
                  maxHeight: "500px",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
                alt={`Header image for ${event?.name ?? "Event"}`}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
          )}
          <div
            className={`card-body ${event?.headerImage?.url ? "p-3" : "p-4"}`}
          >
            <h1 className="card-title h3 mb-4 fs-2">{event?.name}</h1>
            <p className="mb-4 fs-5 d-flex align-items-center">
              <span className="me-2">🕒</span>
              <span>
                <strong>Starts at:</strong>{" "}
                {new Date(event?.timeStart).toLocaleDateString()}{" "}
                {new Date(event?.timeStart).toLocaleTimeString()}
              </span>
            </p>
            <p className="mb-4 fs-5 d-flex align-items-center">
              <span className="me-2">🕒</span>
              <span>
                <strong>Ends at:</strong>{" "}
                {new Date(event?.timeEnd).toLocaleDateString()}{" "}
                {new Date(event?.timeEnd).toLocaleTimeString()}
              </span>
            </p>
            <p className="mb-4 fs-5">📍 {event?.location}</p>
            <p className="mb-4 fs-6 text-secondary">{event?.description}</p>
            {event?.tags && event.tags.length > 0 && (
              <div className="mb-3">
                <span className="me-2">🏷️</span>
                {event.tags.map((tag) => (
                  <span key={tag} className="badge bg-secondary me-2">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="card-footer bg-light p-3">
            <div className="card mt-0">
              <div className="card-header">
                <h5 className="mb-0">Event Chat</h5>
              </div>
              <div className="card-body">
                <MessageList eventId={eventId} />
                <MessageInput eventId={eventId} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
