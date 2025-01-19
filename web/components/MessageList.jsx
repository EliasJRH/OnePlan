import { useFindMany, useUser } from "@gadgetinc/react";
import { api } from "../api";
import { useEffect, useRef } from "react";

export const MessageList = ({ eventId }) => {
  const user = useUser(api);
  const messagesEndRef = useRef(null);
  const [{ data: messages, fetching, error }] = useFindMany(api.message, {
    filter: {
      event: {
        id: { equals: eventId }
      }
    },
    sort: { createdAt: "Ascending" },
    select: {
      id: true,
      content: true,  // Add this line
      createdAt: true,
      user: {
        id: true,
        firstName: true,
        lastName: true
      }
    },
    live: true
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (fetching && !messages) {
    return <div className="text-center p-4">Loading messages...</div>;
  }

  if (error) {
    return <div className="text-danger p-4">Error loading messages: {error.message}</div>;
  }

  return (
    <div className="message-container" style={{ height: '400px', overflowY: 'auto', padding: '1rem' }}>
      {messages?.length === 0 ? (
        <div className="text-center text-muted">No messages yet. Start the conversation!</div>
      ) : (
        messages?.map((message) => (
          <div 
            key={message.id}
            className={`message mb-2 p-2 rounded ${message.user?.id === user?.id ? 'bg-primary text-white ms-auto' : 'bg-light'}`}
            style={{ maxWidth: '75%', width: 'fit-content' }}
          >
            {message.user?.id !== user?.id && (
              <small className="sender-name d-block mb-1">
                {message.user?.firstName} {message.user?.lastName}
              </small>
            )}
            <div className="message-content">{message.content}</div>
            <small className={`message-time d-block text-end ${message.user?.id === user?.id ? 'text-light' : 'text-muted'}`}>
              {new Date(message.createdAt).toLocaleTimeString()}
            </small>
          </div>
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};
