import { useAction, useUser } from "@gadgetinc/react";
import { useState } from "react";
import { api } from "../api";

export const MessageInput = ({ eventId }) => {
  const user = useUser(api);
  const [message, setMessage] = useState("");
  const [{ error, running }, createMessage] = useAction(api.message.create);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || running) return;

    try {
      await createMessage({
        event: { _link: eventId },
        user: { _link: user.id },
        content: message.trim()
      });
      setMessage("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="message-input-form mt-3">
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          disabled={running}
        />
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={running || !message.trim()}
        >
          Send
        </button>
      </div>
      {error && <div className="text-danger mt-2">{error.message}</div>}
    </form>
  );
};
