import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useFindOne, useAction } from "@gadgetinc/react";
import { api } from "../api";

export default function EventEdit() {
  const navigate = useNavigate();
  const { eventId } = useParams(); // Get the event ID from the URL
  const [{ fetching: sharing }, shareEvent] = useAction(api.event.share);
  const [eventData, setEventData] = useState({});
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [formValidated, setFormValidated] = useState(false);  // Declare formValidated state
  const [minDateTime, setMinDateTime] = useState(""); // To hold the minimum date-time for input
  const [timeStartValue, setTimeStartValue] = useState(""); // To hold the start time value
  const [validationErrors, setValidationErrors] = useState({});
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState(["Tag1", "Tag2", "Tag3"]);
  const [headerImagePreview, setHeaderImagePreview] = useState(null);
  const [emailList, setEmailList] = useState([]);
  const [currentEmail, setCurrentEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({});
  
  // Fetch event data
  const [result] = useFindOne(api.event, eventId);

  // Update event mutation
  // const [updateEvent] = useUpdate(api.event);

  useEffect(() => {
    const currentDate = new Date().toISOString().slice(0, 16); // Get current date-time in proper format
    setMinDateTime(currentDate); // Set minDateTime to current date and time

    if (result?.data) {
      setEventData(result.data);
      setFormData({
        name: result.data.name || "",
        description: result.data.description || "",
        timeStart: result.data.timeStart || "",
        timeEnd: result.data.timeEnd || "",
        location: result.data.location || "",
        tags: result.data.tags?.join(", ") || "",
        isPublic: result.data.isPublic || false,
      });
      setLoading(false);
    }
  }, [result]);

  if (result.loading || loading) {
    return <div>Loading event data...</div>;
  }

  if (result.error) {
    return <div>Error loading event: {result.error.message}</div>;
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        ...formData,
        tags: formData.tags.split(",").map((tag) => tag.trim()), // Convert tags to array
      };
      await api.event.update({
        id: eventId,
        ...updatedData,
      });
      alert("Event updated successfully!");
      navigate("/");
    } catch (error) {
      alert("Error updating event: " + error.message);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  const handleIsPublicChanged = () => {
    setIsPublic(!isPublic);
  };

  const handleEmailAdd = () => {
    if (currentEmail && !emailList.includes(currentEmail)) {
      setEmailList([...emailList, currentEmail]);
      setCurrentEmail("");
    } else {
      setEmailError("Invalid or duplicate email");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setHeaderImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEmailKeyPress = (e) => {
    if (e.key === "Enter") {
      handleEmailAdd();
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="card mx-auto" style={{ width: "45vw" }}>
        <div className="card-body overflow-auto" style={{ maxHeight: "70vh", textAlign: "left"}}>
          <form onSubmit={handleSubmit} className={`needs-validation ${formValidated ? 'was-validated' : ''}`} noValidate>
            <div className="form-group mb-4">
              <label htmlFor="name" className="form-label">Event Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={formData.name || ""}
                required
                placeholder="Enter event name"
                onChange={handleChange}
              />
              <div className="invalid-feedback">
                Please provide an event name
              </div>
            </div>

            <div className="form-group mb-4">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea
                className="form-control"
                id="description"
                name="description"
                rows="3"
                placeholder="Enter event description"
                value={formData.description || ""}
                onChange={handleChange}
              />
            </div>

            <div className="form-group mb-4">  
              <label htmlFor="location" className="form-label">Location</label>
              <input
                type="text"
                className="form-control"
                id="location"
                name="location"
                value={formData.location || ""}
                placeholder="Enter event location"
                onChange={handleChange}
              />
            </div>

            <div className="form-group mb-4">
              <label htmlFor="timeStart" className="form-label">Start Time</label>
              <input
                type="datetime-local"
                className="form-control"
                step="900"
                id="timeStart"
                name="timeStart"
                min={minDateTime}
                onChange={(e) => setTimeStartValue(e.target.value)}
                required
              />
              <div className="invalid-feedback">
                {validationErrors.timeStart || "Invalid start time"}
              </div>
            </div>

            <div className="form-group mb-4">
              <label htmlFor="timeEnd" className="form-label">End Time</label>
              <input
                type="datetime-local"
                className="form-control"
                step="900"
                id="timeEnd"
                min={timeStartValue || minDateTime}
                name="timeEnd"
              />
              <div className="invalid-feedback">
                {validationErrors.timeEnd}
              </div>
            </div>


            <div className="form-group mb-4">
              <label htmlFor="headerImage" className="form-label">Header Image</label>
              <input
                type="file"
                className="form-control"
                id="headerImage"
                name="headerImage"
                accept="image/*"
                onChange={handleImageChange}
              />
              {headerImagePreview && (
                <div className="mt-2">
                  <img
                    src={headerImagePreview}
                    alt="Header preview"
                    className="img-fluid"
                    style={{ maxHeight: "200px", objectFit: "contain" }}
                  />
                </div>
              )}
            </div>

            <div className="form-group mb-4">
              <label htmlFor="tags" className="form-label d-block">Tags</label>
              <div className="mb-2">
                {selectedTags.map((tag, index) => (
                  <span
                    key={index}
                    className="badge bg-primary me-2 mb-2"
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      setSelectedTags(selectedTags.filter(t => t !== tag));
                      setAvailableTags([...availableTags, tag]);
                    }}
                  >
                    {tag} ×
                  </span>
                ))}
              </div>
              <div className="d-flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className={`btn ${
                      selectedTags.includes(tag) ? 'btn-primary' : 'btn-outline-primary'
                    } me-2 mb-2`}
                    onClick={() => {
                      setAvailableTags(availableTags.filter(t => t !== tag));
                      setSelectedTags([...selectedTags, tag]);
                    }}
                    aria-pressed={selectedTags.includes(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <small className="text-muted">Click tags to select or deselect them. Selected tags appear above.</small>
            </div>

            <div className="form-check mb-4">
              <input
                type="checkbox"
                className="form-check-input"
                id="isPublic"
                name="isPublic"
                checked={isPublic}
                onChange={handleIsPublicChanged}
              />
              <label className="form-check-label" htmlFor="isPublic">
                Public Event
              </label>
            </div>

            {!isPublic && (
              <div className="form-group mb-4">
                <label htmlFor="shareEmails" className="form-label">Share with (by email)</label>
                <div className="d-flex gap-2">
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={currentEmail}
                    onChange={(e) => setCurrentEmail(e.target.value)}
                    onKeyDown={handleEmailKeyPress}
                  />
                  <button type="button" className="btn btn-outline-primary" onClick={handleEmailAdd}>
                    Add
                  </button>
                </div>
                {emailError && <div className="text-danger">{emailError}</div>}
                {emailList.length > 0 && (
                  <div className="mt-2">
                    <strong>Emails:</strong>
                    <ul>
                      {emailList.map((email, index) => (
                        <li key={index}>{email}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <div className="d-flex justify-content-end gap-2">
              <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
              <button type="submit" className="btn btn-primary">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
