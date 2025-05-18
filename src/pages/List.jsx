import { Fragment, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { db } from "../../firebaseConfig";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { PencilSquareIcon } from "@heroicons/react/20/solid";
import { TrashIcon } from "@heroicons/react/24/outline";
import SaquePreciso from "../components/SaquePreciso/SaquePreciso";
import FogoCentral from "../components/FogoCentral/FogoCentral";
import SmallPistol from "../components/SmallPistol/SmallPistol";
import TrapAmericano from "../components/TrapAmericano/TrapAmericano";
import Carabina22MiraAberta from "../components/Carabina22MiraAberta/Carabina22MiraAberta";
import SM22Precisao from "../components/SM22Precisao/SM22Precisao";
import SM22Apoiado from "../components/SM22Apoiado/SM22Apoiado";
import PercursoCaca from "../components/PercursoCaca/PercursoCaca";
import Trap10 from "../components/Trap10/Trap10";
import PercursoCaca20 from "../components/PercursoCaca20/PercursoCaca";
import { Dialog, Transition } from "@headlessui/react";

const List = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { eventId, examId, user, gun, date } = location.state || {};
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedExam, setSelectedExam] = useState("");
  const [result, setResult] = useState({});
  const [editResultId, setEditResultId] = useState();
  const [open, setOpen] = useState(false);

  const [results, setResults] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState("");

  const cancelButtonRef = useRef(null);

  useEffect(() => {
    if (eventId && examId && user) {
      fetchExamResults();
    }
  }, [eventId, examId, user, gun]);

  const fetchExamResults = async () => {
    try {
      const resultsRef = collection(db, "exam-results");

      const constraints = [
        where("eventId", "==", eventId),
        where("examId", "==", examId),
        where("name", "==", user),
      ];

      // Se `gun` for informado, adiciona o filtro
      if (gun !== null && gun !== undefined && gun !== "") {
        constraints.push(where("results.gun", "!=", null));
      }

      const q = query(resultsRef, ...constraints);
      const querySnapshot = await getDocs(q);

      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setResults(data);
      console.log(data);
    } catch (error) {
      console.error("Erro ao buscar resultados:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Tem certeza que deseja excluir?");
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, "exam-results", id));
      alert("Registro excluído com sucesso.");
      fetchExamResults(); // Recarrega os dados
    } catch (error) {
      console.error("Erro ao excluir:", error);
      alert("Erro ao excluir registro.");
    }
  };

  const handleEdit = async (result) => {
    try {
      const docRef = doc(db, "exam-results", result.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        // Define os estados necessários
        setSelectedUser(data.userId);
        setSelectedExam(data.examId);
        setResult(data); // você pode ajustar conforme o que espera em `onSubmitExam`
        setEditResultId(result.id); // usado para saber que estamos editando
      } else {
        alert("Resultado não encontrado.");
      }
    } catch (error) {
      console.error("Erro ao buscar resultado para edição:", error);
    }
  };

  const getExamSelected = () => {
    switch (examId) {
      case "KkAF46R6WrwZWq1FNhvX":
        return 0;
      case "YchOCURkmZCTsymgHwG0":
        return 1;
      case "cpxPRShLAuDSmBwFKHXw":
        return 2;
      case "hej6E1jjnq81xZMGiqEi":
        return 3;
      case "EfvFedkhOSML884He43N":
        return 4;
      case "PCb1rh0OrOzxAmCTghGB":
        return 5;
      case "q00RXisO4sQqOZ8JfqvW":
        return 6;
      case "qnpGZ7u0IW01TZQ4olPn":
        return 7;
      case "3ZHw4gpIuBq477OGGrur":
        return 8;
      case "hzTpNUmS4eKFuDHzWQcs":
        return 9;
    }
  };

  const changeLevel = () => {
    setOpen(true);
    const currentLevel = results[0].results.level;
    setSelectedLevel(currentLevel);
  };

  const confirmChangeLevel = async () => {
    if (!selectedLevel) {
      alert("Selecione um nível.");
      return;
    }

    try {
      console.log("Iniciando atualização de níveis para:", selectedLevel);

      for (const result of results) {
        const docRef = doc(db, "exam-results", result.id);

        // Atualiza o nível no exam-results
        console.log(`Atualizando exam-result ID: ${result.id}`);
        await updateDoc(docRef, {
          "results.level": selectedLevel,
        });
        console.log(`Exam-result ${result.id} atualizado com sucesso.`);

        const { examId, name, results } = result;
        const gun = results.gun || null;

        console.log(`Buscando nível em levels-25 para:`, {
          examId,
          name,
          gun,
        });

        // Query para verificar se já existe em levels-25
        const levelsQuery = query(
          collection(db, "levels-25"),
          where("examId", "==", examId),
          where("name", "==", name),
          ...(gun ? [where("gun", "==", gun)] : [])
        );

        const snapshot = await getDocs(levelsQuery);

        if (!snapshot.empty) {
          // Atualiza o level existente
          const levelDoc = snapshot.docs[0];
          console.log(
            `Documento encontrado em levels-25: ${levelDoc.id}, atualizando...`
          );
          await updateDoc(levelDoc.ref, {
            level: selectedLevel,
          });
          console.log(
            `Nível do documento ${levelDoc.id} atualizado com sucesso.`
          );
        } else {
          // Cria um novo doc com a estrutura padrão
          const newDoc = {
            examId,
            name,
            gun: gun || null,
            level: selectedLevel,
            rankings: [],
          };
          await addDoc(collection(db, "levels-25"), newDoc);
          console.log(`Documento criado em levels-25 com dados:`, newDoc);
        }
      }

      console.log("Todas atualizações concluídas com sucesso.");
      alert("Nível alterado com sucesso.");
      setOpen(false);
      fetchExamResults(); // recarrega a lista atualizada
    } catch (error) {
      console.error("Erro ao atualizar níveis:", error);
      alert("Erro ao atualizar níveis.");
    }
  };

  return (
    <Layout>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          initialFocus={cancelButtonRef}
          onClose={setOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <Dialog.Title className="text-xl font-semibold leading-6 text-black">
                      Mudar rank
                    </Dialog.Title>
                    <div className="mt-9 flex w-full justify-around gap-2">
                      <button
                        onClick={() => setSelectedLevel("beginner")}
                        className={`px-4 py-2 rounded-md text-sm font-medium ${
                          selectedLevel === "beginner"
                            ? "bg-blue-600 text-white"
                            : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        Iniciante
                      </button>
                      <button
                        onClick={() => setSelectedLevel("master")}
                        className={`px-4 py-2 rounded-md text-sm font-medium ${
                          selectedLevel === "master"
                            ? "bg-blue-600 text-white"
                            : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        Master
                      </button>
                      <button
                        disabled={getExamSelected() !== 5}
                        onClick={() => setSelectedLevel("super-master")}
                        className={`px-4 py-2 rounded-md text-sm font-medium
                                ${
                                  getExamSelected() !== 5
                                    ? "bg-gray-300 text-gray-100 cursor-not-allowed"
                                    : selectedLevel === "super-master"
                                    ? "bg-blue-600 text-white"
                                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                                }`}
                      >
                        Super master
                      </button>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto"
                      onClick={() => confirmChangeLevel()}
                    >
                      Confirmar
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => setOpen(false)}
                      ref={cancelButtonRef}
                    >
                      Cancelar
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button onClick={() => navigate(-1)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <path d="M10.05 16.94V12.94H18.97L19 10.93H10.05V6.94L5.05 11.94Z" />
              </svg>
            </button>
            <h2 className="text-xl font-bold">Resultados</h2>
          </div>
          <div className="flex gap-3 justify-between items-center mb-4">
            <button
              onClick={changeLevel}
              className="bg-transparent text-blue-500 border-[1px] border-blue-500 px-4 h-8 rounded hover:bg-blue-300 hover:text-white"
            >
              Mudar rank
            </button>
            <button
              onClick={fetchExamResults}
              className="bg-blue-500 text-white px-4 h-8 rounded hover:bg-blue-600"
            >
              Atualizar
            </button>
          </div>
        </div>

        {results.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 ">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr className="bg-gray-100 text-left">
                  <th className="pl-3 py-2">Nome</th>
                  <th className="py-2">Arma</th>
                  <th className="py-2">Pontuação</th>
                  <th className="py-2">Nível</th>
                  <th className="py-2 pr-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {results.map((res) => (
                  <tr
                    key={res.id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  >
                    <td className="pl-3 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {res.name}
                    </td>
                    <td className="text-gray-900 py-4">
                      {res.results?.gun === "pistol"
                        ? "Pistola"
                        : res.results?.gun === "revolver"
                        ? "Revólver"
                        : res.results?.gun || "-"}
                    </td>
                    <td className="text-gray-900 py-4">
                      {res.results?.total || 0}
                    </td>
                    <td className="text-gray-900 py-4 capitalize">
                      {res.results?.level === "beginner"
                        ? "Iniciante"
                        : res.results?.level === "master"
                        ? "Master"
                        : res.results?.level === "super-master"
                        ? "Super Master"
                        : "-"}
                    </td>
                    <td className="pr-3 text-gray-900  py-4 text-right">
                      <button
                        onClick={() => handleEdit(res)}
                        className="text-blue-500 hover:underline mr-4"
                      >
                        <PencilSquareIcon className="w-5 h-5 text-green-400" />
                      </button>
                      <button
                        onClick={() => handleDelete(res.id)}
                        className="text-red-500 hover:underline"
                      >
                        <TrashIcon className="w-5 h-5 text-red-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">Nenhum resultado encontrado.</p>
        )}
      </div>
      <>
        {editResultId ? (
          <div>
            {getExamSelected() === 0 && (
              <SaquePreciso
                examId={examId}
                shooter={user}
                dateEvent={date}
                data={result}
                onSubmitExam={async (e) => {
                  try {
                    const data = {
                      eventId: eventId,
                      name: e.name.trim(),
                      examId: e.examId,
                      results: {
                        points: e.points,
                        pointsCounter: e.pointsCounter,
                        total: e.total,
                        ...(e.level && { level: e.level }),
                        ...(e.gun && { gun: e.gun }),
                      },
                      userId: selectedUser,
                    };

                    if (editResultId) {
                      await updateDoc(
                        doc(db, "exam-results", editResultId),
                        data
                      );

                      // Limpa os estados
                      setResult(null);
                      setEditResultId(null);

                      // Recarrega os dados
                      fetchExamResults();
                    }
                  } catch (error) {
                    console.error("Erro ao atualizar resultado:", error);
                  }
                }}
              />
            )}
            {getExamSelected() === 1 && (
              <FogoCentral
                examId={examId}
                shooter={user}
                dateEvent={date}
                data={result}
                onSubmitExam={async (e) => {
                  try {
                    const data = {
                      eventId: eventId,
                      name: e.name.trim(),
                      examId: e.examId,
                      results: {
                        points: e.points,
                        pointsCounter: e.pointsCounter,
                        total: e.total,
                        ...(e.level && { level: e.level }),
                        ...(e.gun && { gun: e.gun }),
                      },
                      userId: selectedUser,
                    };

                    if (editResultId) {
                      await updateDoc(
                        doc(db, "exam-results", editResultId),
                        data
                      );

                      // Limpa os estados
                      setResult(null);
                      setEditResultId(null);

                      // Recarrega os dados
                      fetchExamResults();
                    }
                  } catch (error) {
                    console.error("Erro ao atualizar resultado:", error);
                  }
                }}
              />
            )}
            {getExamSelected() === 2 && (
              <SmallPistol
                examId={examId}
                shooter={user}
                dateEvent={date}
                data={result}
                onSubmitExam={async (e) => {
                  try {
                    const data = {
                      eventId: eventId,
                      name: e.name.trim(),
                      examId: e.examId,
                      results: {
                        points: e.points,
                        pointsCounter: e.pointsCounter,
                        total: e.total,
                        ...(e.level && { level: e.level }),
                        ...(e.gun && { gun: e.gun }),
                      },
                      userId: selectedUser,
                    };

                    if (editResultId) {
                      await updateDoc(
                        doc(db, "exam-results", editResultId),
                        data
                      );

                      // Limpa os estados
                      setResult(null);
                      setEditResultId(null);

                      // Recarrega os dados
                      fetchExamResults();
                    }
                  } catch (error) {
                    console.error("Erro ao atualizar resultado:", error);
                  }
                }}
              />
            )}
            {getExamSelected() === 3 && (
              <TrapAmericano
                examId={examId}
                shooter={user}
                dateEvent={date}
                data={result}
                onSubmitExam={async (e) => {
                  try {
                    const data = {
                      eventId: eventId,
                      name: e.name.trim(),
                      examId: e.examId,
                      results: {
                        points: e.points,
                        pointsCounter: e.pointsCounter,
                        total: e.total,
                        ...(e.level && { level: e.level }),
                        ...(e.gun && { gun: e.gun }),
                      },
                      userId: selectedUser,
                    };

                    if (editResultId) {
                      await updateDoc(
                        doc(db, "exam-results", editResultId),
                        data
                      );

                      // Limpa os estados
                      setResult(null);
                      setEditResultId(null);

                      // Recarrega os dados
                      fetchExamResults();
                    }
                  } catch (error) {
                    console.error("Erro ao atualizar resultado:", error);
                  }
                }}
              />
            )}
            {getExamSelected() === 4 && (
              <Carabina22MiraAberta
                examId={examId}
                shooter={user}
                dateEvent={date}
                data={result}
                onSubmitExam={async (e) => {
                  try {
                    const data = {
                      eventId: eventId,
                      name: e.name.trim(),
                      examId: e.examId,
                      results: {
                        points: e.points,
                        pointsCounter: e.pointsCounter,
                        total: e.total,
                        ...(e.level && { level: e.level }),
                        ...(e.gun && { gun: e.gun }),
                      },
                      userId: selectedUser,
                    };

                    if (editResultId) {
                      await updateDoc(
                        doc(db, "exam-results", editResultId),
                        data
                      );

                      // Limpa os estados
                      setResult(null);
                      setEditResultId(null);

                      // Recarrega os dados
                      fetchExamResults();
                    }
                  } catch (error) {
                    console.error("Erro ao atualizar resultado:", error);
                  }
                }}
              />
            )}
            {getExamSelected() === 5 && (
              <SM22Precisao
                examId={examId}
                shooter={user}
                dateEvent={date}
                data={result}
                onSubmitExam={async (e) => {
                  try {
                    const data = {
                      eventId: eventId,
                      name: e.name.trim(),
                      examId: e.examId,
                      results: {
                        points: e.points,
                        pointsCounter: e.pointsCounter,
                        total: e.total,
                        ...(e.level && { level: e.level }),
                        ...(e.gun && { gun: e.gun }),
                      },
                      userId: selectedUser,
                    };

                    if (editResultId) {
                      await updateDoc(
                        doc(db, "exam-results", editResultId),
                        data
                      );

                      // Limpa os estados
                      setResult(null);
                      setEditResultId(null);

                      // Recarrega os dados
                      fetchExamResults();
                    }
                  } catch (error) {
                    console.error("Erro ao atualizar resultado:", error);
                  }
                }}
              />
            )}
            {getExamSelected() === 6 && (
              <SM22Apoiado
                examId={examId}
                shooter={user}
                dateEvent={date}
                data={result}
                onSubmitExam={async (e) => {
                  try {
                    const data = {
                      eventId: eventId,
                      name: e.name.trim(),
                      examId: e.examId,
                      results: {
                        points: e.points,
                        pointsCounter: e.pointsCounter,
                        total: e.total,
                        ...(e.level && { level: e.level }),
                        ...(e.gun && { gun: e.gun }),
                      },
                      userId: selectedUser,
                    };

                    if (editResultId) {
                      await updateDoc(
                        doc(db, "exam-results", editResultId),
                        data
                      );

                      // Limpa os estados
                      setResult(null);
                      setEditResultId(null);

                      // Recarrega os dados
                      fetchExamResults();
                    }
                  } catch (error) {
                    console.error("Erro ao atualizar resultado:", error);
                  }
                }}
              />
            )}
            {getExamSelected() === 7 && (
              <PercursoCaca
                examId={examId}
                shooter={user}
                dateEvent={date}
                data={result}
                onSubmitExam={async (e) => {
                  try {
                    const data = {
                      eventId: eventId,
                      name: e.name.trim(),
                      examId: e.examId,
                      results: {
                        points: e.points,
                        pointsCounter: e.pointsCounter,
                        total: e.total,
                        ...(e.level && { level: e.level }),
                        ...(e.gun && { gun: e.gun }),
                      },
                      userId: selectedUser,
                    };

                    if (editResultId) {
                      await updateDoc(
                        doc(db, "exam-results", editResultId),
                        data
                      );

                      // Limpa os estados
                      setResult(null);
                      setEditResultId(null);

                      // Recarrega os dados
                      fetchExamResults();
                    }
                  } catch (error) {
                    console.error("Erro ao atualizar resultado:", error);
                  }
                }}
              />
            )}
            {getExamSelected() === 8 && (
              <Trap10
                examId={examId}
                shooter={user}
                dateEvent={date}
                data={result}
                onSubmitExam={async (e) => {
                  try {
                    const data = {
                      eventId: eventId,
                      name: e.name.trim(),
                      examId: e.examId,
                      results: {
                        points: e.points,
                        pointsCounter: e.pointsCounter,
                        total: e.total,
                        ...(e.level && { level: e.level }),
                        ...(e.gun && { gun: e.gun }),
                      },
                      userId: selectedUser,
                    };

                    if (editResultId) {
                      await updateDoc(
                        doc(db, "exam-results", editResultId),
                        data
                      );

                      // Limpa os estados
                      setResult(null);
                      setEditResultId(null);

                      // Recarrega os dados
                      fetchExamResults();
                    }
                  } catch (error) {
                    console.error("Erro ao atualizar resultado:", error);
                  }
                }}
              />
            )}

            {getExamSelected() === 9 && (
              <PercursoCaca20
                examId={examId}
                shooter={user}
                dateEvent={date}
                data={result}
                onSubmitExam={async (e) => {
                  try {
                    const data = {
                      eventId: eventId,
                      name: e.name.trim(),
                      examId: e.examId,
                      results: {
                        points: e.points,
                        pointsCounter: e.pointsCounter,
                        total: e.total,
                        ...(e.level && { level: e.level }),
                        ...(e.gun && { gun: e.gun }),
                      },
                      userId: selectedUser,
                    };

                    if (editResultId) {
                      await updateDoc(
                        doc(db, "exam-results", editResultId),
                        data
                      );

                      // Limpa os estados
                      setResult(null);
                      setEditResultId(null);

                      // Recarrega os dados
                      fetchExamResults();
                    }
                  } catch (error) {
                    console.error("Erro ao atualizar resultado:", error);
                  }
                }}
              />
            )}
          </div>
        ) : null}
      </>
    </Layout>
  );
};
export default List;
