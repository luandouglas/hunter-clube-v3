import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useCallback, useEffect, useState, Fragment, FC } from "react";
import { db } from "../../firebaseConfig";

import Layout from "../components/Layout";
import { Link } from "react-router-dom";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const [displayedPages, setDisplayedPages] = useState([]);

  const handleClick = (page) => {
    onPageChange(page);
    if (page === 1) {
      setDisplayedPages([1, 2, 3]);
    } else if (page === totalPages) {
      setDisplayedPages([totalPages - 2, totalPages - 1, totalPages]);
    } else {
      setDisplayedPages([page - 1, page, page + 1]);
    }
  };

  useEffect(() => {
    setDisplayedPages([1, 2, 3]);
  }, []);

  return (
    <nav className="flex justify-center mt-4">
      <ul className="pagination flex flex-row items-center space-x-4">
        <li
          className={`pagination-item ${currentPage === 1 ? "disabled" : ""}`}
        >
          <button
            onClick={() => handleClick(currentPage - 1)}
            disabled={currentPage < 2}
          >
            {"<<"} Anterior
          </button>
        </li>

        {displayedPages.map((page) => (
          <li
            key={page}
            className={`pagination-item bg-green-800 p-1 px-3 text-white rounded-full ${
              currentPage === page ? "active" : ""
            }`}
          >
            <button onClick={() => handleClick(page)}>{page}</button>
          </li>
        ))}
        <li
          className={`pagination-item ${
            currentPage === totalPages ? "disabled" : ""
          }`}
        >
          <button
            onClick={() => handleClick(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Próxima {">>"}
          </button>
        </li>
      </ul>
    </nav>
  );
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(1);
  const itemsPerPage = 10; // Quantidade de itens exibidos por página
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedUsers = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const fetchUsers = useCallback(async () => {
    const querySnapshot = await getDocs(
      query(collection(db, "users"), orderBy("nome", "asc"))
    );
    const data = [];
    querySnapshot.docs.forEach((el) => data.push(el.data()));
    setUsers(data);
    setTotalItems(data.length);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  return (
    <Layout>
      <div className="flex flex-row items-center">
        <h1 className="flex flex-1 text-gray-700 py-4 font-bold text-xl">
          Atiradores
        </h1>
        <Link to="new">
          <button className="bg-green-800 text-white px-4 py-2 rounded-lg">
            Adicionar
          </button>
        </Link>
      </div>

      <br></br>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        {paginatedUsers.length ? (
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 ">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Matricula
                </th>
                <th scope="col" className="px-6 py-3">
                  Nome
                </th>
                <th scope="col" className="px-6 py-3">
                  Cidade
                </th>
                <th scope="col" className="px-6 py-3">
                  CR
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((el, index) => (
                <tr
                  key={index}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <td
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {el.matricula}
                  </td>

                  <td
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {el.nome}
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    {el.cidade && el.cidade}
                  </td>

                  <td className="px-6 py-4 text-gray-900">{el.cr && el.cr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </Layout>
  );
};

export default Users;
