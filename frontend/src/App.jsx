import { useState } from "react";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import MainLayouts from "./components/layouts/MainLayouts";
import Home from "./pages/Home";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayouts />}>
        {/* Define your routes here */}
        <Route index element={<Home />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;
