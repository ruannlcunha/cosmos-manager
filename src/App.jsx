import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { useSocket } from "./hook";
import { GlobalDataOfflineProvider } from "./context/data-offline/global-data-offline.context";
import { GlobalUserProvider } from "./context/user/global-user.context";

function App() {
  const { socket } = useSocket();
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);

  useEffect(() => {
    socket.connect();
  }, []);

  return (
    <GlobalDataOfflineProvider>
      <GlobalUserProvider>
        <ToastContainer className={"toaster"} />
        <RouterProvider router={router} />
      </GlobalUserProvider>
    </GlobalDataOfflineProvider>
  );
}

export default App;
