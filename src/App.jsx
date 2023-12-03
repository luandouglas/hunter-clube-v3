import React from "react";
import {
  Route,
  RouterProvider,
  createHashRouter,
  createRoutesFromElements,
} from "react-router-dom";

import Edit from "./pages/Edit";
import Events from "./pages/Events";
import Geral from "./pages/Geral";
import Home from "./pages/Home";
import Live from "./pages/Live";
import Ranking from "./pages/Ranking";
import Register from "./pages/Register";
import UserNew from "./pages/UserNew";
import Users from "./pages/Users";

const router = createHashRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/geral" element={<Geral />} />
      <Route path="/live" element={<Live />} />
      <Route path="events" element={<Events />} />
      <Route path="register/:id" element={<Register />} />
      <Route path="register/:eventId/edit/:id" element={<Edit />} />
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
