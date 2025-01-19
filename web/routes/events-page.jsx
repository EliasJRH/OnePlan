import { useUser } from "@gadgetinc/react";
import { api } from "../api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useFindMany } from "@gadgetinc/react";

export default function () {
  const user = useUser(api);
  const [sortType, setSortType] = useState("date");
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Your Events";
  }, []);

  const [result, refresh] = useFindMany(api.event, {
    filter: {
      OR: [
        { createdById: { equals: user?.id } },
        { isPublic: { equals: true } },
        { userShares: { some: { id: { equals: user?.id } } } },
      ],
    },
  });

  if (result.loading) {
    return <div>Loading...</div>;
  }

  if (result.error) {
    return <div>Error fetching events: {result.error.message}</div>;
  }

  let events = Array.isArray(result?.data) ? result.data : [];

  const handleCreateRedirect = () => {
    navigate("create");
  };

  const handleSortChange = (e) => {
    setSortType(e.target.value);
  };

  const handleEditRedirect = (eventId) => {
    navigate(`edit/${eventId}`);
  };

  const sortedEvents = [...events].sort((a, b) => {
    if (sortType === "date") {
      return new Date(a.timeStart) - new Date(b.timeStart);
    }
    return 0;
  });

  const formatDateTime = (datetime) => {
    const date = new Date(datetime);
    return `${date.toLocaleString("en-US", {
      month: "short",
    })} ${date.getDate()}, ${date.getFullYear()} 🕓 ${date.toLocaleTimeString(
      "en-US",
      { hour: "2-digit", minute: "2-digit", hour12: true }
    )}`;
  };

  const handleEventClick = (eventId) => {
    console.log(`Event clicked: ${eventId}`);
    navigate(`${eventId}`);
  };

  const formatDate = (datetime) => {
    const date = new Date(datetime);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (datetime) => {
    const date = new Date(datetime);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div
      className="container"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        paddingBottom: "100px",
        overflowY: "auto",
      }}
    >
      <div className="row">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            width: "100%",
          }}
        >
          <div className="col text-start">
            <div className="row">
              <h1>Welcome, {user.firstName}</h1>
            </div>
            <div className="row">
              <h1>Here are your events!</h1>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleCreateRedirect}
          >
            Create Event
          </button>
        </div>
      </div>
      <div
        style={{
          scrollbarWidth: "thin",
          flex: 1,
          overflowY: "auto",
        }}
      >
        {sortedEvents.length > 0 ? (
          sortedEvents.map((event, index) => (
            <div
              key={index}
              className="card mb-3 w-100 position-relative"
              onClick={() => handleEventClick(event.id)}
              style={{ cursor: "pointer" }}
            >
              <div className="row g-0">
                <div className="col-md-4">
                  {event?.headerImage?.url && (
                    <img
                      src={event.headerImage.url}
                      className="img-fluid rounded-start"
                      alt={`Event: ${event.name}`}
                      style={{
                        height: "200px",
                        width: "100%",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  )}
                </div>
                <div className="col-md-8">
                  <div className="card-body position-relative">
                    <h2 className="card-title">
                      {event.name}
                      {event.createdById === user?.id && (
                        <button
                          className="btn btn-sm btn-light"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditRedirect(event.id);
                          }}
                          title="Edit Event"
                          style={{
                            position: "absolute",
                            right: "1px",
                            top: "1px",
                            backgroundColor: "white",
                          }}
                        >
                          ⚙️
                        </button>
                      )}
                    </h2>
                    <div className="card-text">
                      <div className="row">
                        <div className="col">
                          <p>📅 {formatDate(event.timeStart)}</p>
                          <p>🕑 {formatTime(event.timeStart)}</p>
                        </div>
                        <div className="col">
                          <p>📅 {formatDate(event.timeEnd)}</p>
                          <p>🕟 {formatTime(event.timeEnd)}</p>
                        </div>
                      </div>
                      <div className="row">
                        <p>📍 {event.location}</p>
                      </div>
                    </div>
                    <p className="card-text">
                      <small className="text-body-secondary">
                        {event.description}{" "}
                      </small>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>No events available</div>
        )}
      </div>
    </div>
  );
}
