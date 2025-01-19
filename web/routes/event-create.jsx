import { useUser, useAction, useFindFirst, useFindOne } from "@gadgetinc/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { api } from "../api";

const ALL_TAGS = ["Science/Technology", "Music", "Art", "19+", "Family Friendly", "Sports"];

export default function () {
  const user = useUser(api);
  const navigate = useNavigate();
  const [{ fetching }, createEvent] = useAction(api.event.create);
  const [{ fetching: sharing }, shareEvent] = useAction(api.event.share);
  const [showToast, setShowToast] = useState(false);
  const [formValidated, setFormValidated] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [currentEmail, setCurrentEmail] = useState("");

  const [availableTags, setAvailableTags] = useState(
    ALL_TAGS
  );
  const [selectedTags, setSelectedTags] = useState([]);
  const [toastMessage, setToastMessage] = useState({ title: "", message: "", type: "" });
  const [emailList, setEmailList] = useState([]);
  const [emailError, setEmailError] = useState("");
  const [minDateTime, setMinDateTime] = useState("");
  const [timeStartValue, setTimeStartValue] = useState("");
  const [headerImagePreview, setHeaderImagePreview] = useState(null);
  const [isPublic, setIsPublic] = useState(false);

  const formatDateForInput = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };  

  useEffect(() => {
    const updateMinTime = () => setMinDateTime(formatDateForInput(new Date()));
    updateMinTime(); // Set initial value
    const interval = setInterval(updateMinTime, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    return () => {
      // Cleanup preview URL when component unmounts
      if (headerImagePreview) URL.revokeObjectURL(headerImagePreview);
    };
  }, [headerImagePreview]);

  const showNotification = (title, message, type) => {
    setToastMessage({ title, message, type });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return re.test(String(email).toLowerCase());
  };

  const handleEmailAdd = () => {
    if (!validateEmail(currentEmail)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    if (!emailList.includes(currentEmail)) {
      setEmailList([...emailList, currentEmail]);
      setCurrentEmail("");
      setEmailError("");
      return true;
    }
    return false;
  };
 
  const handleEmailKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleEmailAdd();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormValidated(true);
    const formData = new FormData(event.target);
    const form = event.currentTarget;
    
    // Reset validation errors
    setValidationErrors({});
    
    // Check form validity
    if (!form.checkValidity()) {
      event.stopPropagation();
      return;
    }
    
    // Custom validations
    const startTime = new Date(formData.get("timeStart"));
    const endTime = formData.get("timeEnd") ? new Date(formData.get("timeEnd")) : null;
    const now = new Date();
    
    const headerImageFile = formData.get("headerImage");
    if (headerImageFile && headerImageFile.size > 0) {
      if (!headerImageFile.type.startsWith('image/')) {
        setValidationErrors(prev => ({ ...prev, headerImage: "File must be an image" }));
        showNotification("Error", "Please select an image file", "danger");
        return;
      }
    }

    // Create base event object without headerImage
    const eventData = {
      name: formData.get("name"),
      description: formData.get("description"), 
      location: formData.get("location"),
      timeStart: startTime.toISOString(),
      timeEnd: endTime ? endTime.toISOString() : null,
      isPublic: formData.get("isPublic") === "on",
      tags: selectedTags,
      createdBy: { _link: user.id },
    };
    
    // Only add headerImage if file exists and has size
    if (headerImageFile && headerImageFile.size > 0) {
      eventData.headerImage = { file: headerImageFile };
    }
    
    try {
      const eventResult = await createEvent(eventData);

 
      let eventShareErrors = [];

      if (emailList.length > 0) {
        // Process emails sequentially 
        for (const emailStr of emailList) {
          try {
          const shareResult = await shareEvent({
            id: eventResult.data.id,
            emails: emailList
          });
          console.log(shareResult);
          
          if (shareResult.data.errors?.length > 0) {
            showNotification("Warning", "Event created but some shares failed", "warning");
          } else {
            showNotification("Success", "Event created and shared successfully", "success");
          }
        } catch (error) {
          showNotification("Warning", `Event created but sharing failed: ${error.message}`, "warning");
        }
      }
      }
      navigate("/events");
    } catch (error) {
      showNotification("Error", error.message, "danger");
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Cleanup previous preview URL if exists
      if (headerImagePreview) {
        URL.revokeObjectURL(headerImagePreview);
      }
      
      // Create new preview URL
      const previewUrl = URL.createObjectURL(file);
      setHeaderImagePreview(previewUrl);
    }
  };

  const handleIsPublicChanged = (event) => {
      setIsPublic(event.target.checked);
  };

  return (
    <div className="container-fluid">
      <div className="card mx-auto" >
        <div className="card-body overflow-auto" style={{ maxHeight: "70vh", textAlign: "left"}}>
          <form onSubmit={handleSubmit} className={`needs-validation ${formValidated ? 'was-validated' : ''}`} noValidate>
            <div className="form-group mb-4">
              <label htmlFor="name" className="form-label">Event Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                required
                placeholder="Enter event name"
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
              />
            </div>

            <div className="form-group mb-4">  
              <label htmlFor="location" className="form-label">Location</label>
              <input
                type="text"
                className="form-control"
                id="location"
                name="location"
                placeholder="Enter event location"
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
              <div className="invalid-feedback">
                {validationErrors.headerImage}
              </div>
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
                      // Remove from available, add to selected
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
                onChange={handleIsPublicChanged}
              />
              <label className="form-check-label" htmlFor="isPublic">
                Public Event
              </label>
            </div>

            {!isPublic && (<div className="form-group mb-4">
              <label htmlFor="shareEmails" className="form-label">Share with (by email)</label>
              <div className="mb-2">
                {emailList.map((email, index) => (
                  <span
                    key={index}
                    className="badge bg-primary me-2 mb-2"
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      setEmailList(emailList.filter(e => e !== email));
                    }}
                  >
                    {email} ×
                  </span>
                ))}
              </div>
              <div className="input-group">
                <input
                  type="email"
                  className={`form-control ${emailError ? 'is-invalid' : ''}`}
                  id="shareEmails"
                  value={currentEmail}
                  onChange={(e) => {
                    setCurrentEmail(e.target.value);
                    setEmailError("");
                  }}
                  onKeyDown={handleEmailKeyPress}
                  placeholder="Enter email address"
                />
                <button 
                  className="btn btn-outline-primary" 
                  onClick={() => handleEmailAdd()}
                  type="button"
                >Add</button>
              </div>
              {emailError && <div className="invalid-feedback d-block">{emailError}</div>}
              <small className="text-muted">Enter email addresses to share this event with other users.</small>
            </div>)}

            <div className="d-flex justify-content-end">
              <button type="submit" className="btn btn-primary" disabled={fetching}>
                {fetching ? 'Creating...' : 'Create Event'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {showToast && (
        <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 11 }}>
          <div className={`toast show bg-${toastMessage.type}`} role="alert">
            <div className="toast-header">
              <strong className="me-auto">{toastMessage.title}</strong>
              <button type="button" className="btn-close" onClick={() => setShowToast(false)}></button>
            </div>
            <div className="toast-body text-white">
              {toastMessage.message}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
