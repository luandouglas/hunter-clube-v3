import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Layout from "./components/Layout";
import Events from "./pages/Events";
import Register from "./pages/Register";
import Users from "./pages/Users";
import UserNew from "./pages/UserNew";
import Ranking from "./pages/Ranking";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="events" element={<Events />} />
      <Route path="register/:id" element={<Register />} />
      <Route path="ranking/:id" element={<Ranking />} />
      <Route path="users" element={<Users />} />
      <Route path="users/new" element={<UserNew />} />
    </>
  )
);

function App({ routes }) {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
