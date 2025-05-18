import React from "react";
import {
  Route,
  RouterProvider,
  createHashRouter,
  createRoutesFromElements,
} from "react-router-dom";

import Edit from "./pages/Edit";
import Events from "./pages/Events";
import EventsYear from "./pages/EventsYear";
import Geral from "./pages/Geral";
import Home from "./pages/Home";
import Live from "./pages/Live";
import Ranking from "./pages/Ranking";
import Register from "./pages/Register";
import UserNew from "./pages/UserNew";
import Users from "./pages/Users";
import Championship from "./pages/Championship";
import List from "./pages/List";

const router = createHashRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/geral" element={<Geral />} />
      <Route path="/live/:eventId" element={<Live />} />
      <Route path="events" element={<Events />} />
      <Route path="championship" element={<Championship />} />
      <Route path="events/:year" element={<EventsYear />} />
      <Route path="register/:id" element={<Register />} />
      <Route path="register/:eventId/edit/:id" element={<Edit />} />
      <Route path="ranking/:id" element={<Ranking />} />
      <Route path="/list" element={<List />} />
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
