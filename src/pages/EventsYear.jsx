import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import React, { useCallback, useEffect, useState, Fragment } from "react";
import { db } from "../../firebaseConfig";
import Layout from "../components/Layout";
import { Link, useParams } from "react-router-dom";
import { Button, Dialog, Tooltip } from "@material-tailwind/react";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [statusDialog, setStatusDialog] = useState(false);
  const [form, setForm] = useState({ name: "", date: "", status: "" });

  const { year } = useParams()
  const fetchEvents = useCallback(async () => {
    const querySnapshot = await getDocs(
      query(collection(db, "events"), orderBy("date", "desc"))
    );
    const desiredYear = Number(year);
    const aux = [];
    querySnapshot.docs.forEach((e) => {
      const data = e.data();
      const eventDate = new Date(data.date);
      if (eventDate.getFullYear() === desiredYear) {
        aux.push({ ...data, id: e.id });
      }
    });
    setEvents(aux);
  }, [year]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleCreateNewEvent = (year) => {
    setStatusDialog(!statusDialog);
    setYear(year)
  }

  const getMonthName = (dateStr, locale = 'pt-BR') => {
    const date = new Date(dateStr);
    const monthName = date.toLocaleString(locale, { month: "long" });
    return monthName.charAt(0).toUpperCase() + monthName.slice(1);

  }
  const handleSaveEvent = () => {
    console.log({ ...form, status: "Em andamento" })
  }

  return (
    <Layout>
      <Dialog open={statusDialog}>
        <div className="min-h-96 flex flex-col">
          {/* HEADER */}
          <div className="p-4 flex flex-row" >
            <p className="font-bold flex-1 text-gray-900 font-sans">Cadastro de evento</p>
            <button onClick={() => setStatusDialog(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {/* BODY */}
          <div className="p-4 flex-1 flex flex-col gap-y-2">
            <div>
              <label htmlFor="price" className="block text-sm font-semibold leading-6 text-gray-900">
                Nome do evento
              </label>
              <div className="relative mt-2 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
                    </svg>
                  </span>
                </div>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={e => setForm(value => ({ ...value, name: e.target.value }))}
                  id="name"
                  className="block outline-none w-full rounded-md border-0 py-1.5 pl-10 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Clube Hunter 2024"
                />
              </div>
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-semibold leading-6 text-gray-900">
                Data
              </label>
              <div className="relative mt-2 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                    </svg>

                  </span>
                </div>
                <input
                  type="date"
                  name="name"
                  value={form.date}
                  onChange={e => setForm(value => ({ ...value, date: e.target.value }))}
                  id="name"
                  className="block  outline-none w-full rounded-md border-0 py-1.5 pl-10 pr-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="01/01/2024"
                />
              </div>
            </div>
          </div>
          {/* FOOTER */}
          <div className="h-16 flex justify-end p-2 gap-x-2">
            <button onClick={() => setStatusDialog(false)} className="py-2 px-4 items-center rounded-xl">
              <span className="text-gray-900 ">
                Cancelar
              </span>
            </button>
            <button disabled={form.date === '' || form.name === ''} onClick={() => handleSaveEvent()} className="bg-green-900 disabled:bg-green-300 py-2 px-4 items-center rounded-xl">
              <span className="text-white ">
                Salvar
              </span>
            </button>
          </div>
        </div>
      </Dialog>
      <div className="flex flex-row items-center">
        <h1 className="flex flex-1 text-gray-700 py-4 font-bold text-xl">
          Início
        </h1>

        <button className="bg-blue-gray-500 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="32"
            viewBox="0 -960 960 960"
            width="32"
          >
            <path
              fill="white"
              d="M450-200v-250H200v-60h250v-250h60v250h250v60H510v250h-60Z"
            />
          </svg>
        </button>
      </div>

      <br></br>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 ">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Eventos
              </th>
              <th scope="col" className="px-6 py-3">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>

            {events.map(e =>
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td scope="row"
                  className="px-3 py-4 font-medium whitespace-nowrap ">
                  <span className="text-gray-900 bg-transparent p-3 rounded-lg">{e.name}</span>
                </td>
                <td scope="row"
                  className="pl-4 py-4 font-medium whitespace-nowrap ">
                  <div className="flex flex-row items-center gap-x-4">
                    <Tooltip content="Cadastrar resultado">
                      <Link to={`/register/${e.id}`}>

                        <button className="bg-green-800 p-2 rounded-md">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                          </svg>
                        </button>
                      </Link>
                    </Tooltip>
                    <td>
                      <Tooltip content="Ver resultados">
                        <Link to={`/ranking/${e.id}`}>
                          <button className="bg-gray-600 p-2 rounded-md">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                          </button>
                        </Link>
                      </Tooltip>
                    </td>
                    {e.status == 'Em andamento' &&
                      <td>
                        <Tooltip content="Ver rank em tempo real">
                          <Link to={`/live/${e.id}`}>
                            <button className="bg-red-500 p-2 rounded-md h-10 w-10">
                              <svg xmlns="http://www.w3.org/2000/svg" x="40px" y="40px" width="auto" height="auto" viewBox="0 0 48 48">
                                <circle cx="24" cy="24" r="6" fill="#FFF"></circle><path fill="#FFF" d="M17.09,16.789L14.321,13.9C11.663,16.448,10,20.027,10,24s1.663,7.552,4.321,10.1l2.769-2.889 C15.19,29.389,14,26.833,14,24C14,21.167,15.19,18.61,17.09,16.789z"></path><path fill="#FFF" d="M33.679,13.9l-2.769,2.889C32.81,18.611,34,21.167,34,24c0,2.833-1.19,5.389-3.09,7.211l2.769,2.889 C36.337,31.552,38,27.973,38,24S36.337,16.448,33.679,13.9z"></path><g><path fill="#FFF" d="M11.561,11.021l-2.779-2.9C4.605,12.125,2,17.757,2,24s2.605,11.875,6.782,15.879l2.779-2.9 C8.142,33.701,6,29.1,6,24S8.142,14.299,11.561,11.021z"></path><path fill="#FFF" d="M39.218,8.121l-2.779,2.9C39.858,14.299,42,18.9,42,24s-2.142,9.701-5.561,12.979l2.779,2.9 C43.395,35.875,46,30.243,46,24S43.395,12.125,39.218,8.121z"></path></g>
                              </svg>
                            </button>
                          </Link>
                        </Tooltip>
                      </td>
                    }

                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout >
  );
};
export default Events;
