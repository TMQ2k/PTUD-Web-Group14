import { useState, useEffect } from "react";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import MainLayouts from "./components/layouts/MainLayouts";
import Home from "./pages/Home";
import LoadingScreen from "./components/layouts/LoadingScreen";

const App = () => {
  // Mặc định hiển thị overlay nhưng vẫn render Router phía sau
  const [showLoading, setShowLoading] = useState(true);
  const [exiting, setExiting] = useState(false);

  const loadDuration = 1600;
  const exitDuration = 7000;

  useEffect(() => {
    const t1 = setTimeout(() => setExiting(true), loadDuration);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (!exiting) return;
    const t2 = setTimeout(() => setShowLoading(false), exitDuration);
    return () => clearTimeout(t2);
  }, [exiting]);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayouts />}>
        <Route index element={<Home />} />
      </Route>
    )
  );

  return (
    <>
      {/* Render nội dung chính NGAY LẬP TỨC để khi overlay fade thì UI đã sẵn sàng */}
      <RouterProvider router={router} />

      {/* Overlay loading nằm trên cùng, mờ dần khi exit */}
      {showLoading && (
        <LoadingScreen exiting={exiting} duration={exitDuration} />
      )}
    </>
  );
};

export default App;
