import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

const Message = ({ message }) => {
  const scroll = useRef();
  const { authUser, selectedUser } = useSelector((store) => store.user);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isSender = message?.senderId === authUser?._id;
  const profilePhoto = isSender
    ? authUser?.profilePhoto
    : selectedUser?.profilePhoto || "/default-avatar.png";

  const time = message?.createdAt
    ? new Date(message.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  // 🔥 Scroll to latest message
  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <>
      <div ref={scroll} className={`chat ${isSender ? "chat-end" : "chat-start"}`}>
        {/* Avatar */}
        <div className="chat-image avatar">
          <div
            className="w-10 h-10 rounded-full cursor-pointer overflow-hidden ring-1 ring-zinc-600"
            onClick={() => setIsModalOpen(true)}
          >
            <img src={profilePhoto} alt="user avatar" className="object-cover w-full h-full" />
          </div>
        </div>

        {/* Timestamp */}
        <div className="chat-header">
          <time className="text-xs opacity-50 text-white">{time}</time>
        </div>

        {/* Chat Bubble */}
        <div className={`chat-bubble ${isSender ? "bg-blue-600 text-white" : "bg-gray-200 text-black"} flex flex-col gap-2`}>
          {/* Text */}
          {message?.message && <span>{message.message}</span>}

          {/* Media */}
          {message?.media?.length > 0 &&
            message.media.map((m, idx) => {
              switch (m.type) {
                case "image":
                  return (
                    <img
                      key={idx}
                      src={m.url}
                      alt="sent media"
                      className="rounded max-w-xs max-h-60 object-cover cursor-pointer hover:opacity-80 transition"
                      onClick={() => window.open(m.url, "_blank")}
                    />
                  );
                case "video":
                  return (
                    <video
                      key={idx}
                      src={m.url}
                      controls
                      className="rounded max-w-xs max-h-60"
                    />
                  );
                case "audio":
                  return <audio key={idx} src={m.url} controls className="w-full mt-1" />;
                case "document":
                  return (
                    <a
                      key={idx}
                      href={m.url}
                      target="_blank"
                      rel="noreferrer"
                      className="underline text-blue-400 mt-1"
                    >
                      Open Document
                    </a>
                  );
                default:
                  return null;
              }
            })}
        </div>
      </div>

      {/* Profile Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/70 z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <img
            src={profilePhoto}
            alt="Profile Full"
            className="max-w-[90%] max-h-[90%] rounded-lg shadow-lg"
          />
        </div>
      )}
    </>
  );
};

export default Message;
