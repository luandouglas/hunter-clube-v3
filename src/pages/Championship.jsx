import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { exams } from "../utils";

const Championship = () => {
  const [ranking, setRanking] = useState([]);
  const [label, setLabel] = useState("");
  const [isDouble, setIsDouble] = useState(false);
  const [examList, setExamList] = useState(exams);
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedGun, setSelectedGun] = useState(null);

  const fetchEvent = async () => {
    const eventDocRef = doc(db, "events", eventId);
    const eventDocSnapshot = await getDoc(eventDocRef);

    if (eventDocSnapshot.exists()) {
      const eventData = eventDocSnapshot.data();
      if (eventData.isDouble) {
        setIsDouble(true);
      } else {
        setIsDouble(false);
      }
    }
  };

  //   useEffect(() => {
  //     const fetchFunctions = [
  //       {
  //         label: "Small Pistol - Iniciante",
  //         fetchFunc: fetchSmallPistol,
  //         level: "beginner",
  //         gun: null,
  //         id: "cpxPRShLAuDSmBwFKHXw",
  //       },
  //       {
  //         label: "Small Pistol - Master",
  //         fetchFunc: fetchSmallPistol,
  //         level: "master",
  //         gun: null,
  //         id: "cpxPRShLAuDSmBwFKHXw",
  //       },
  //       {
  //         label: "Trap Americano",
  //         fetchFunc: fetchTrapAmericano,
  //         level: null,
  //         gun: null,
  //         id: "hej6E1jjnq81xZMGiqEi",
  //       },
  //       {
  //         label: "Carabina 22 Mira Aberta",
  //         fetchFunc: fetchCarabina22MiraAberta,
  //         level: null,
  //         gun: null,
  //         id: "EfvFedkhOSML884He43N",
  //       },
  //       {
  //         label: "Fogo Central - Iniciante (Pistola)",
  //         fetchFunc: fetchFogoCentral,
  //         level: "beginner",
  //         gun: "pistol",
  //         id: "YchOCURkmZCTsymgHwG0",
  //       },
  //       {
  //         label: "Fogo Central - Master (Pistola)",
  //         fetchFunc: fetchFogoCentral,
  //         level: "master",
  //         gun: "pistol",
  //         id: "YchOCURkmZCTsymgHwG0",
  //       },
  //       {
  //         label: "Fogo Central - Iniciante (Revolver)",
  //         fetchFunc: fetchFogoCentral,
  //         level: "beginner",
  //         gun: "revolver",
  //         id: "YchOCURkmZCTsymgHwG0",
  //       },
  //       {
  //         label: "Fogo Central - Master (Revolver)",
  //         fetchFunc: fetchFogoCentral,
  //         level: "master",
  //         gun: "revolver",
  //         id: "YchOCURkmZCTsymgHwG0",
  //       },
  //       {
  //         label: "Percurso de Caça",
  //         fetchFunc: fetchPercursoCaca,
  //         level: null,
  //         gun: null,
  //         id: "qnpGZ7u0IW01TZQ4olPn",
  //       },
  //       {
  //         label: "Percurso de Caça 20",
  //         fetchFunc: fetchPercursoCaca20,
  //         level: null,
  //         gun: null,
  //         id: "hzTpNUmS4eKFuDHzWQcs",
  //       },
  //       {
  //         label: "Trap 10 - Iniciante",
  //         fetchFunc: fetchTrap10,
  //         level: "beginner",
  //         gun: null,
  //         id: "3ZHw4gpIuBq477OGGrur",
  //       },
  //       {
  //         label: "Trap 10 - Master",
  //         fetchFunc: fetchTrap10,
  //         level: "master",
  //         gun: null,
  //         id: "3ZHw4gpIuBq477OGGrur",
  //       },
  //       {
  //         label: "Saque Preciso - Iniciante (Pistola)",
  //         fetchFunc: fetchSaquePreciso,
  //         level: "beginner",
  //         gun: "pistol",
  //         id: "KkAF46R6WrwZWq1FNhvX",
  //       },
  //       {
  //         label: "Saque Preciso - Master (Pistola)",
  //         fetchFunc: fetchSaquePreciso,
  //         level: "master",
  //         gun: "pistol",
  //         id: "KkAF46R6WrwZWq1FNhvX",
  //       },
  //       {
  //         label: "Saque Preciso - Iniciante (Revolver)",
  //         fetchFunc: fetchSaquePreciso,
  //         level: "beginner",
  //         gun: "revolver",
  //         id: "KkAF46R6WrwZWq1FNhvX",
  //       },
  //       {
  //         label: "Saque Preciso - Master (Revolver)",
  //         fetchFunc: fetchSaquePreciso,
  //         level: "master",
  //         gun: "revolver",
  //         id: "KkAF46R6WrwZWq1FNhvX",
  //       },
  //       {
  //         label: "SM22 Apoiado - Master",
  //         fetchFunc: fetchSM22Apoiado,
  //         level: "master",
  //         gun: null,
  //         id: "q00RXisO4sQqOZ8JfqvW",
  //       },
  //       {
  //         label: "SM22 Apoiado - Super Master",
  //         fetchFunc: fetchSM22Apoiado,
  //         level: "super-master",
  //         gun: null,
  //         id: "q00RXisO4sQqOZ8JfqvW",
  //       },
  //       {
  //         label: "SM22 Precisao - Iniciante",
  //         fetchFunc: fetchSM22Precisao,
  //         level: "beginner",
  //         gun: null,
  //         id: "PCb1rh0OrOzxAmCTghGB",
  //       },
  //       {
  //         label: "SM22 Precisao - Master",
  //         fetchFunc: fetchSM22Precisao,
  //         level: "master",
  //         gun: null,
  //         id: "PCb1rh0OrOzxAmCTghGB",
  //       },
  //     ];

  //     let current = 0;
  //     const interval = setInterval(() => {
  //       const { id, label, fetchFunc, level, gun } = fetchFunctions[current];
  //       setLabel(label);
  //       fetchFunc(id, level, gun);
  //       console.log("I HAVE CALLED", label);
  //       current = (current + 1) % fetchFunctions.length;
  //     }, 20000); // 20 segundos de intervalo

  //     return () => clearInterval(interval);
  //   }, []);

  const fetchRanking = async (examId, level, gun, ordering) => {
    try {
      let q = query(collection(db, "final-results"));

      if (examId) {
        q = query(q, where("examId", "==", examId));
      }
      if (level) {
        q = query(q, where("level", "==", level));
      }
      if (gun) {
        q = query(q, where("gun", "==", gun));
      }
      if (ordering && ordering.length > 0) {
        ordering.forEach((order) => {
          q = query(q, orderBy(order.field, order.direction));
        });
      }

      const querySnapshot = await getDocs(q);
      const data = [];
      querySnapshot.docs.forEach((el) =>
        data.push({ ...el.data(), id: el.id })
      );

      // Chama a função para encontrar os dois maiores resultados e exibe no console
      const rankingFiltered = removeDuplicateNames(data);

      setRanking(rankingFiltered.sort((a, b) => b.total - a.total));
    } catch (error) {
      console.error("Error fetching ranking: ", error);
    }
  };

  const removeDuplicateNames = (data) => {
    // Itera pelos objetos de data
    return data.map((item) => {
      // Agrupa resultados por data
      const groupedByDate = item.results.reduce((acc, result) => {
        const date = result.event?.date; // Verifica se `event.date` existe
        if (!date) return acc; // Ignora resultados sem data
        if (!acc[date]) acc[date] = [];
        acc[date].push(result);
        return acc;
      }, {});

      // Filtra os resultados agrupados
      const filteredResults = Object.values(groupedByDate).flatMap((group) => {
        // Ordena por total decrescente
        const sortedGroup = group.sort((a, b) => b.total - a.total);

        // Verifica se algum evento tem `isDouble === true`
        const isDouble = group.some((result) => result.event?.isDouble);

        // Retorna 2 ou 1 item dependendo do `isDouble`
        return isDouble ? sortedGroup.slice(0, 2) : sortedGroup.slice(0, 1);
      });

      // Ordena todos os resultados filtrados por total decrescente
      const sortedResults = filteredResults.sort((a, b) => b.total - a.total);

      // Seleciona as 8 maiores pontuações
      const top8Results = sortedResults.slice(0, 8);

      // // Calcula o total das 8 maiores pontuações
      const newTotal = top8Results.reduce(
        (sum, result) => sum + Number(result.total),
        0
      );

      // Retorna o mesmo item com resultados filtrados e total atualizado
      return {
        ...item,
        results: sortedResults,
        total: newTotal,
      };
    });
  };

  // Exemplo de uso da função fetchRanking com as provas específicas
  const fetchCarabina22MiraAberta = (examId, level, gun) => {
    fetchRanking(examId, level, null, [{ field: "total", direction: "desc" }]);
  };

  const fetchFogoCentral = (examId, level, gun) => {
    fetchRanking(examId, level, gun, [{ field: "total", direction: "desc" }]);
  };

  const fetchPercursoCaca = (examId, level, gun) => {
    fetchRanking(examId, level, null, [{ field: "total", direction: "desc" }]);
  };

  const fetchPercursoCaca20 = (examId, level, gun) => {
    fetchRanking(examId, level, null, [{ field: "total", direction: "desc" }]);
  };

  const fetchTrap10 = (examId, level, gun) => {
    fetchRanking(examId, level, null, [{ field: "total", direction: "desc" }]);
  };

  const fetchSaquePreciso = (examId, level, gun) => {
    fetchRanking(examId, level, gun, [{ field: "total", direction: "desc" }]);
  };

  const fetchSM22Apoiado = (examId, level, gun) => {
    fetchRanking(examId, level, null, [{ field: "total", direction: "desc" }]);
  };

  const fetchSM22Precisao = (examId, level, gun) => {
    fetchRanking(examId, level, null, [{ field: "total", direction: "desc" }]);
  };

  const fetchSmallPistol = (examId, level, gun) => {
    fetchRanking(examId, level, null, [{ field: "total", direction: "desc" }]);
  };

  const fetchTrapAmericano = (examId, level, gun) => {
    fetchRanking(examId, null, null, [{ field: "total", direction: "desc" }]);
  };

  const returnClass = (position) => {
    if (position === 1) {
      return "w-1 px-6 py-3 bg-gold text-white whitespace-nowrap dark:text-white text-center";
    } else if (position === 2) {
      return "w-1 px-6 py-3 bg-silver text-white whitespace-nowrap dark:text-white text-center";
    } else if (position === 3) {
      return "w-1 px-6 py-3 bg-bronze text-white whitespace-nowrap dark:text-white text-center";
    } else {
      return "w-1 px-6 py-3 text-center text-gray-900 whitespace-nowrap dark:text-white";
    }
  };

  const handleSelectExam = (exam) => {
    setSelectedExam((prev) => (prev?.id === exam.id ? null : exam)); // Alterna seleção
    handleSelectLevel(null);
    handleSelectGun(null);
  };

  const handleSelectLevel = (level) => {
    setSelectedLevel(level);
  };

  const handleSelectGun = (gun) => {
    setSelectedGun(gun);
  };

  const fetchExam = (examdId, level, gun) => {
    switch (examdId) {
      case "KkAF46R6WrwZWq1FNhvX":
        fetchSaquePreciso(examdId, level, gun);
        break;
      case "YchOCURkmZCTsymgHwG0":
        fetchFogoCentral(examdId, level, gun);
        break;
      case "cpxPRShLAuDSmBwFKHXw":
        fetchSmallPistol(examdId, level, "");
        break;
      case "hej6E1jjnq81xZMGiqEi":
        fetchTrapAmericano(examdId, "", "");
        break;
      case "EfvFedkhOSML884He43N":
        fetchCarabina22MiraAberta(examdId, level, "");
        break;
      case "PCb1rh0OrOzxAmCTghGB":
        fetchSM22Precisao(examdId, level, "");
        break;
      case "q00RXisO4sQqOZ8JfqvW":
        fetchSM22Apoiado(examdId, level, "");
        break;
      case "qnpGZ7u0IW01TZQ4olPn":
        fetchPercursoCaca(examdId, level, "");
        break;
      case "hzTpNUmS4eKFuDHzWQcs":
        fetchPercursoCaca20(examdId, level, "");
        break;
      case "3ZHw4gpIuBq477OGGrur":
        fetchTrap10(examdId, level, "");
    }
  };

  const handleClickUpdateExamFinal = async () => {
    const auxDoc = [];
    const eventIds = [
      "4ifsjKd75BGccjCD8NhQ",
      "Bcz8OUnhZUpiiSUk4k66",
      "PmQ9ZziyzHDRZdxjgOEJ",
      "bLKz92Kaa7F6I70sDmZK",
      "j8nBCis7x3wNctAYpYoF",
      "m7Qa4wYH45st2IuaRgs6",
      "qbZlXoJKsRbQT2bYDmnd",
      "tthUAeu0OHe59QAOIyyg",
      "uC7diCIi2GJYwUYCAViJ",
      "w3j0YhJR2zpvKQskWoHD",
    ];

    const aux = await getDocs(
      query(collection(db, "exam-results"), where("eventId", "in", eventIds))
    );

    aux.docs.forEach((el) => auxDoc.push(el.data()));

    const groupedData = auxDoc.reduce((acc, item) => {
      const { name, examId, results, eventId } = item;
      const gun = results.gun || null; // Garante valor null se gun não existir

      let existing = acc.find(
        (entry) =>
          entry.name === name && entry.examId === examId && entry.gun === gun
      );

      if (!existing) {
        existing = {
          name,
          examId,
          results: [],
          level: results.level || "unknown",
          gun,
          total: 0,
        };
        acc.push(existing);
      }
      const getEvent = async () => {
        const eventDocRef = doc(db, "events", eventId);
        const eventDocSnapshot = await getDoc(eventDocRef);

        if (eventDocSnapshot.exists()) {
          const eventData = eventDocSnapshot.data();
          const resultWithEventId = { ...results, event: eventData };
          existing.results.push(resultWithEventId);
          existing.total += results.total;
        }
      };
      getEvent();

      return acc;
    }, []);

    const sortedData = groupedData.sort((a, b) => a.name.localeCompare(b.name));

    await deleteCollection("final-results");
    await saveCollection(sortedData);
  };

  const deleteCollection = async (collectionName) => {
    const collectionRef = collection(db, collectionName);

    const snapshot = await getDocs(collectionRef);

    const deletePromises = snapshot.docs.map((docSnapshot) =>
      deleteDoc(doc(db, collectionName, docSnapshot.id))
    );

    await Promise.all(deletePromises);

    console.log(`Coleção ${collectionName} deletada com sucesso.`);
  };

  const saveCollection = async (object) => {
    object.forEach(async (element) => {
      const docRef = await addDoc(collection(db, "final-results"), element);
    });
  };

  const addExamResult = async () => {
    const object = {
      examId: "qnpGZ7u0IW01TZQ4olPn",
      eventId: "tthUAeu0OHe59QAOIyyg",
      name: "JOSÉ ARI DE ALMEIDA CASTRO FILHO",
      results: {
        level: "master",
        total: 5,
      },
    };
    await addDoc(collection(db, "exam-results"), object);
  };

  const fetchResultMonth = (results, date) => {
    const resultMonths = results.filter((e) => e.event.date === date);
    return resultMonths.length > 0
      ? resultMonths.map((e) => Number(e.total).toFixed(0))
      : ["-"];
  };
  return (
    <Layout>
      <div className="p-6">
        {/* <button onClick={() => addExamResult()}>ADICI</button> */}
        <div className="flex justify-between row">
          <div className="text-gray-700 py-4 font-bold text-xl">
            Selecione a prova
          </div>
          <button
            onClick={() => handleClickUpdateExamFinal()}
            className="flex row items-center gap-3"
          >
            <div className="text-gray-700 py-4 font-bold text-xl">
              Atualizar resultados
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              fill="#1b4f3f"
              height="24px"
              width="24px"
              version="1.1"
              id="Capa_1"
              viewBox="0 0 489.645 489.645"
              xml:space="preserve"
            >
              <g>
                <path d="M460.656,132.911c-58.7-122.1-212.2-166.5-331.8-104.1c-9.4,5.2-13.5,16.6-8.3,27c5.2,9.4,16.6,13.5,27,8.3   c99.9-52,227.4-14.9,276.7,86.3c65.4,134.3-19,236.7-87.4,274.6c-93.1,51.7-211.2,17.4-267.6-70.7l69.3,14.5   c10.4,2.1,21.8-4.2,23.9-15.6c2.1-10.4-4.2-21.8-15.6-23.9l-122.8-25c-20.6-2-25,16.6-23.9,22.9l15.6,123.8   c1,10.4,9.4,17.7,19.8,17.7c12.8,0,20.8-12.5,19.8-23.9l-6-50.5c57.4,70.8,170.3,131.2,307.4,68.2   C414.856,432.511,548.256,314.811,460.656,132.911z" />
              </g>
            </svg>
          </button>
        </div>
        <div className="p-4 space-y-4 relative">
          {/* Botões das provas */}
          <div className="flex flex-wrap gap-2 justify-center">
            {exams.map((exam) => (
              <button
                key={exam.id}
                className={`px-4 py-2 rounded-lg border text-sm font-medium
              ${
                selectedExam?.id === exam.id
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }
              transition duration-300`}
                onClick={() => handleSelectExam(exam)}
              >
                {exam.tipo_prova}
              </button>
            ))}
          </div>

          {/* Rankings, Níveis e Armas */}
          {selectedExam && (
            <div className="mt-4 p-4 border rounded-lg bg-gray-50 shadow-md">
              <h2 className="text-lg font-bold text-gray-700 mb-4">
                Configurações para: {selectedExam.tipo_prova}
              </h2>

              {/* Seleção de Níveis */}
              {selectedExam.levels && (
                <div className="mb-4">
                  <h3 className="text-md font-semibold text-gray-600 mb-2">
                    Selecione o Nível:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedExam.levels.map((level, index) => (
                      <button
                        key={index}
                        className={`px-3 py-2 rounded-lg transition ${
                          selectedLevel === level.value
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                        }`}
                        onClick={() => handleSelectLevel(level.value)}
                      >
                        {level.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Seleção de Armas */}
              {selectedExam.guns && (
                <div className="mb-4">
                  <h3 className="text-md font-semibold text-gray-600 mb-2">
                    Selecione a Arma:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedExam.guns.map((gun, index) => (
                      <button
                        key={index}
                        className={`px-3 py-2 rounded-lg transition ${
                          selectedGun === gun.value
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                        }`}
                        onClick={() => handleSelectGun(gun.value)}
                      >
                        {gun.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Botão de confirmação */}
              <div className="flex justify-end">
                <button
                  className="px-6 py-2 bg-green-500 text-white font-medium rounded-lg shadow-lg hover:bg-green-600 transition"
                  onClick={() => {
                    fetchExam(selectedExam.id, selectedLevel, selectedGun);
                  }}
                >
                  Confirmar
                </button>
              </div>
            </div>
          )}
        </div>
        <h2 className="text-gray-700 py-4 font-bold text-5xl">{label}</h2>
        <br></br>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          {ranking.length ? (
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Pos.
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Nome
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Pontuação
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
                    Mar
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
                    Abr
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
                    Mai
                  </th>
                  <th colSpan={2} scope="col" className="px-6 py-3 text-center">
                    Jun
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
                    Jul
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
                    Ago
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
                    Set
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
                    Out
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
                    Nov
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
                    Dez
                  </th>
                </tr>
              </thead>
              <tbody>
                {ranking.map((el, index) => (
                  <tr
                    key={index}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  >
                    <td className={returnClass(index + 1)}>{index + 1}</td>
                    <td
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {el.name}
                    </td>
                    <td className="text-gray-900 px-6 py-4 text-center">
                      {Number(el.total.toFixed(0))}
                    </td>
                    <td className="text-gray-900 px-6 py-4 text-center">
                      {fetchResultMonth(el.results, "2024-03-03")}
                    </td>
                    <td className="text-gray-900 px-6 py-4 text-center">
                      {fetchResultMonth(el.results, "2024-04-07")}
                    </td>
                    <td className="text-gray-900 px-6 py-4 text-center">
                      {fetchResultMonth(el.results, "2024-05-05")}
                    </td>
                    <td className="text-gray-900 px-6 py-4 text-center">
                      {fetchResultMonth(el.results, "2024-06-01")[0]}
                    </td>
                    <td className="text-gray-900 px-6 py-4 text-center">
                      {fetchResultMonth(el.results, "2024-06-01")[1]}
                    </td>

                    <td className="text-gray-900 px-6 py-4 text-center">
                      {fetchResultMonth(el.results, "2024-06-30")}
                    </td>
                    <td className="text-gray-900 px-6 py-4 text-center">
                      {fetchResultMonth(el.results, "2024-08-04")}
                    </td>
                    <td className="text-gray-900 px-6 py-4 text-center">
                      {fetchResultMonth(el.results, "2024-09-08")}
                    </td>
                    <td className="text-gray-900 px-6 py-4 text-center">
                      {fetchResultMonth(el.results, "2024-10-13")}
                    </td>
                    <td className="text-gray-900 px-6 py-4 text-center">
                      {fetchResultMonth(el.results, "2024-11-10")}
                    </td>
                    <td className="text-gray-900 px-6 py-4 text-center">
                      {fetchResultMonth(el.results, "2024-12-08")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}
        </div>
      </div>
    </Layout>
  );
};

export default Championship;
