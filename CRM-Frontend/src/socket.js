// // src\socket.js
// import { io } from "socket.io-client";

// export const socket = io("http://localhost:5000", {
//   withCredentials: true,
// });

// src/socket.js
import { io } from "socket.io-client";

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const SOCKET_URL = API_BASE.replace("/api", "");

export const socket = io(SOCKET_URL, {
  withCredentials: true,
});
