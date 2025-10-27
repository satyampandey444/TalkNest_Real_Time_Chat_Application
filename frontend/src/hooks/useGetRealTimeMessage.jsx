// src/hooks/useGetRealTimeMessage.js
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setMessages } from "../../redux/messageSlice";

const useGetRealTimeMessage = () => {
  const dispatch = useDispatch();
  const { socket } = useSelector((store) => store.socket);
  const { messages } = useSelector((store) => store.message);

  useEffect(() => {
    if (!socket) return;

    // ✅ Properly handle new messages as plain arrays (no function payloads)
    const handleNewMessage = (newMessage) => {
      dispatch(setMessages([...messages, newMessage]));
    };

    socket.on("newMessage", handleNewMessage);

    // ✅ Cleanup listener on unmount or socket change
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, messages, dispatch]);
};

export default useGetRealTimeMessage;
