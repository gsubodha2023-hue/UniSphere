import { useEffect } from "react";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { addNotification } from "../redux/slices/notificationSlice";

let socket;

const useSocket = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) return undefined;

    socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", {
      transports: ["websocket"],
    });

    socket.emit("join", user._id);

    socket.on("notification", (data) => {
      dispatch(addNotification(data));
    });

    return () => {
      socket.disconnect();
    };
  }, [user, dispatch]);

  return socket;
};

export default useSocket;
