import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
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
  const [rankingUpdate, setRankingUpdate] = useState([]);

  const [label, setLabel] = useState("");
  const [isDouble, setIsDouble] = useState(false);
  const [examList, setExamList] = useState(exams);
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedGun, setSelectedGun] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [updateLevel, setUpdateLevel] = useState(false);

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
    setUpdateLevel(false)
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
    setLoading(true);
    setProgress(0);
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
    setProgress(25);
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
    setProgress(50);
    const sortedData = groupedData.sort((a, b) => a.name.localeCompare(b.name));

    await deleteCollection("final-results");
    setProgress(75);
    await saveCollection(sortedData);
    setProgress(100);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
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

  const checkNewRank = () => {
    setUpdateLevel(true)
    setRankingUpdate([])
    const update = ranking
      .map(({ name, examId, results, level }) => {
        const prova = exams.find(prova => prova.id === examId);
        if (!prova) return { examId, tipo_prova: "Desconhecido", status: "Prova não encontrada" };

        const totais = results.map(result => result.total);

        if (!prova.levels || prova.levels.length === 0) {
          return { name, examId, tipo_prova: prova.tipo_prova, status: "Sem níveis definidos" };
        }

        // Ordenar níveis por pontos
        const niveisOrdenados = [...prova.levels].sort((a, b) => a.points - b.points);

        // Encontrar o nível atual baseado na string vinda de ranking.level
        const nivelAtual = niveisOrdenados.find(nivel => nivel.value === level) || niveisOrdenados[0];

        // Determinar o novo nível baseado na melhor pontuação do participante
        const melhorPontuacao = Math.max(...totais);
        let novoNivel = nivelAtual;

        for (const nivel of niveisOrdenados) {
          if (melhorPontuacao >= nivel.points) {
            novoNivel = nivel;
          }
        }

        // Verificar se deve subir ou descer de rank
        let status = null;
        let destaque = [];

        if (novoNivel.value !== nivelAtual.value) {
          if (melhorPontuacao >= novoNivel.points) {
            status = "Subir de rank";
            destaque = results.filter(result => result.total >= novoNivel.points);
          } else if (Math.min(...totais) < nivelAtual.points) {
            status = "Descer de rank";
            destaque = results.filter(result => result.total < nivelAtual.points);
          }
        }

        if (!status) return null; // Ignora os que permanecem no mesmo rank

        const resultado = {
          name,
          examId,
          tipo_prova: prova.tipo_prova,
          status,
          nivel_atual: nivelAtual.label,
          novo_nivel: novoNivel.label,
          destaque
        };

        console.log(resultado);
        return resultado;
      })
      .filter(item => item !== null); // Remove os que não mudaram de rank
    setRankingUpdate(update)
    console.log(update);

  };

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-'); // Separar a data no formato YYYY-MM-DD
    return `${day}/${month}/${year}`; // Retorna no formato DD/MM/YYYY
  };

  const fetchResultMonth = (results, date) => {
    const resultMonths = results.filter((e) => e.event.date === date);
    return resultMonths.length > 0
      ? resultMonths.map((e) => Number(e.total).toFixed(0))
      : ["-"];
  };
  return (
    <Layout>
      {loading && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            {/* Animação do Spinner */}
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>

            {/* Texto do progresso */}
            <div className="absolute text-white text-lg font-bold mt-20">
              {progress}%
            </div>

            {/* Mensagem de feedback */}
            <p className="mt-4 text-white text-sm pt-8 font-medium">
              Atualizando, por favor aguarde...
            </p>
          </div>
        </div>
      )}
      <div className="p-6">
        {/* <button onClick={() => addExamResult()}>ADICI</button> */}
        <div className="flex justify-between row">
          <div className="text-gray-700 py-4 font-bold text-xl">
            Selecione a prova
          </div>
          <div className="flex row gap-3 items-center">
            <button
              disabled={loading}
              onClick={() => checkNewRank()}
              className="flex row items-center gap-3"
            >
              <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000" height="24px" width="24px" version="1.1" id="Capa_1" viewBox="0 0 214.943 214.943" xml:space="preserve">
                <g>
                  <path d="M187.693,46.993l-31.102-15.889L140.7,0l-33.229,10.758L74.242,0L58.354,31.104L27.25,46.993l10.758,33.228l-10.757,33.23   l31.102,15.889l4.247,8.314v77.288l44.875-22.431l44.868,22.432v-77.29l4.247-8.313l31.102-15.889l-10.757-33.23L187.693,46.993z    M107.476,175.742l-29.875,14.933v-31.317l29.871-9.67l29.872,9.671v31.316L107.476,175.742z M145.443,118.192l-12.283,24.045   l-25.688-8.316l-25.686,8.316l-12.283-24.045l-24.044-12.283l8.316-25.688l-8.314-25.686l24.043-12.283l12.283-24.044l25.686,8.316   l25.688-8.316l12.283,24.044l24.042,12.283l-8.314,25.686l8.316,25.688L145.443,118.192z" />
                  <path d="M107.475,39.09c-22.683,0-41.137,18.451-41.137,41.13c0,22.684,18.454,41.139,41.137,41.139   c22.68,0,41.132-18.455,41.132-41.139C148.607,57.542,130.155,39.09,107.475,39.09z M107.475,106.359   c-14.412,0-26.137-11.726-26.137-26.139c0-14.408,11.725-26.13,26.137-26.13c14.409,0,26.132,11.722,26.132,26.13   C133.607,94.634,121.884,106.359,107.475,106.359z" />
                </g>
              </svg>
            </button>
            <button
              disabled={loading}
              onClick={() => handleClickUpdateExamFinal()}
              className="flex row items-center gap-3"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#1b4f3f"
                height="24px"
                width="24px"
                version="1.1"
                id="Capa_1"
                viewBox="0 0 489.645 489.645"
              >
                <g>
                  <path d="M460.656,132.911c-58.7-122.1-212.2-166.5-331.8-104.1c-9.4,5.2-13.5,16.6-8.3,27c5.2,9.4,16.6,13.5,27,8.3   c99.9-52,227.4-14.9,276.7,86.3c65.4,134.3-19,236.7-87.4,274.6c-93.1,51.7-211.2,17.4-267.6-70.7l69.3,14.5   c10.4,2.1,21.8-4.2,23.9-15.6c2.1-10.4-4.2-21.8-15.6-23.9l-122.8-25c-20.6-2-25,16.6-23.9,22.9l15.6,123.8   c1,10.4,9.4,17.7,19.8,17.7c12.8,0,20.8-12.5,19.8-23.9l-6-50.5c57.4,70.8,170.3,131.2,307.4,68.2   C414.856,432.511,548.256,314.811,460.656,132.911z" />
                </g>
              </svg>
            </button>
          </div>
        </div>
        <div>

        </div>
        <div className="p-4 space-y-4 relative">
          {/* Botões das provas */}
          <div className="flex flex-wrap gap-2 justify-center">
            {exams.map((exam) => (
              <button
                key={exam.id}
                className={`px-4 py-2 rounded-lg border text-sm font-medium
              ${selectedExam?.id === exam.id
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
                        className={`px-3 py-2 rounded-lg transition ${selectedLevel === level.value
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
                        className={`px-3 py-2 rounded-lg transition ${selectedGun === gun.value
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
          {updateLevel === true ? (
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">Pos.</th>
                  <th scope="col" className="px-6 py-3">Nome</th>
                  <th scope="col" className="px-6 py-3 text-center">Ranking atual</th>
                  <th scope="col" className="px-6 py-3 text-center">Ranking novo</th>
                  <th scope="col" className="px-6 py-3 text-center">Destaque</th>
                </tr>
              </thead>
              <tbody>
                {rankingUpdate.map((el, index) => (
                  <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <td className={returnClass(index + 1)}>{index + 1}</td>
                    <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {el.name}
                    </td>
                    <td className="text-gray-900 px-6 py-4 text-center">
                      {el.nivel_atual}
                    </td>
                    <td className="text-gray-900 px-6 py-4 text-center">
                      {el.novo_nivel}
                    </td>
                    <td className="text-gray-900 px-6 py-4 text-center">
                      {/* Exibindo os destaques */}
                      {el.destaque && el.destaque.length > 0 ? (
                        <div>
                          {el.destaque.map((d, idx) => (
                            <div key={idx} className="text-sm">
                              <strong>{d.event.name} ({formatDate(d.event.date)})</strong> - {d.total} pontos
                              <br />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-500">Sem destaque</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}

          {ranking.length && updateLevel === false ? (
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
