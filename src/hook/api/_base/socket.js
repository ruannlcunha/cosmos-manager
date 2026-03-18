import { io } from "socket.io-client";
import { BASE_API_URL } from "../../../constants";

export const socket = io(BASE_API_URL, {
    autoConnect: false,
});
