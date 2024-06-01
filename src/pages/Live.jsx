import {
  collection,
  getDocs,
  orderBy,
  query,
  where
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { exams } from "../utils";
import { Link, useParams } from "react-router-dom";



const Live = () => {
  const [ranking, setRanking] = useState([]);

  const [selectedExam, setSelectedExam] = useState("");
  const [selectedLevel, setSelectedLevel] = useState();
  const [selectedGun, setSelectedGun] = useState("");

  const [levels, setLevels] = useState([]);
  const [guns, setGuns] = useState([]);

  const [canSee, setCanSee] = useState(true);
  const [showGun, setShowGun] = useState(true)

  const [label, setLabel] = useState('')
  const { eventId } = useParams()


  useEffect(() => {
    const fetchFunctions = [
      { label: "Small Pistol - Iniciante", fetchFunc: fetchSmallPistol, level: "beginner", gun: null, id: "cpxPRShLAuDSmBwFKHXw" },
      { label: "Small Pistol - Master", fetchFunc: fetchSmallPistol, level: "master", gun: null, id: "cpxPRShLAuDSmBwFKHXw" },
      { label: "Trap Americano", fetchFunc: fetchTrapAmericano, level: null, gun: null, id: "hej6E1jjnq81xZMGiqEi" },
      { label: "Carabina 22 Mira Aberta", fetchFunc: fetchCarabina22MiraAberta, level: null, gun: null, id: "EfvFedkhOSML884He43N" },
      { label: "Fogo Central - Iniciante (Pistola)", fetchFunc: fetchFogoCentral, level: "beginner", gun: "pistol", id: "YchOCURkmZCTsymgHwG0" },
      { label: "Fogo Central - Master (Pistola)", fetchFunc: fetchFogoCentral, level: "master", gun: "pistol", id: "YchOCURkmZCTsymgHwG0" },
      { label: "Fogo Central - Iniciante (Revolver)", fetchFunc: fetchFogoCentral, level: "beginner", gun: "revolver", id: "YchOCURkmZCTsymgHwG0" },
      { label: "Fogo Central - Master (Revolver)", fetchFunc: fetchFogoCentral, level: "master", gun: "revolver", id: "YchOCURkmZCTsymgHwG0" },
      { label: "Percurso de Caça", fetchFunc: fetchPercursoCaca, level: null, gun: null, id: "qnpGZ7u0IW01TZQ4olPn" },
      { label: "Percurso de Caça 20", fetchFunc: fetchPercursoCaca20, level: null, gun: null, id: "hzTpNUmS4eKFuDHzWQcs" },
      { label: "Trap 10 - Iniciante", fetchFunc: fetchTrap10, level: "beginner", gun: null, id: "3ZHw4gpIuBq477OGGrur" },
      { label: "Trap 10 - Master", fetchFunc: fetchTrap10, level: "master", gun: null, id: "3ZHw4gpIuBq477OGGrur" },
      { label: "Saque Preciso - Iniciante (Pistola)", fetchFunc: fetchSaquePreciso, level: "beginner", gun: "pistol", id: "KkAF46R6WrwZWq1FNhvX" },
      { label: "Saque Preciso - Master (Pistola)", fetchFunc: fetchSaquePreciso, level: "master", gun: "pistol", id: "KkAF46R6WrwZWq1FNhvX" },
      { label: "Saque Preciso - Iniciante (Revolver)", fetchFunc: fetchSaquePreciso, level: "beginner", gun: "revolver", id: "KkAF46R6WrwZWq1FNhvX" },
      { label: "Saque Preciso - Master (Revolver)", fetchFunc: fetchSaquePreciso, level: "master", gun: "revolver", id: "KkAF46R6WrwZWq1FNhvX" },
      { label: "SM22 Apoiado - Master", fetchFunc: fetchSM22Apoiado, level: "master", gun: null, id: "q00RXisO4sQqOZ8JfqvW" },
      { label: "SM22 Apoiado - Super Master", fetchFunc: fetchSM22Apoiado, level: "super-master", gun: null, id: "q00RXisO4sQqOZ8JfqvW" },
      { label: "SM22 Precisao - Iniciante", fetchFunc: fetchSM22Precisao, level: "beginner", gun: null, id: "PCb1rh0OrOzxAmCTghGB" },
      { label: "SM22 Precisao - Master", fetchFunc: fetchSM22Precisao, level: "master", gun: null, id: "PCb1rh0OrOzxAmCTghGB" }
    ];

    let current = 0;
    const interval = setInterval(() => {
      const { id, label, fetchFunc, level, gun } = fetchFunctions[current];
      setLabel(label);
      fetchFunc(id, level, gun);
      console.log('I HAVE CALLED', label);
      current = (current + 1) % fetchFunctions.length;
    }, 20000); // 20 segundos de intervalo

    return () => clearInterval(interval);
  }, []);

  const fetchRanking = async (examId, level, gun, ordering) => {
    try {
      let q = query(collection(db, "exam-results"));

      if (examId) {
        q = query(q, where("examId", "==", examId));
      }
      if (eventId) {
        q = query(q, where("eventId", "==", eventId));
      }
      if (level) {
        q = query(q, where("results.level", "==", level));
      }
      if (gun) {
        q = query(q, where("results.gun", "==", gun));
      }

      if (ordering && ordering.length > 0) {
        ordering.forEach((order) => {
          q = query(q, orderBy(order.field, order.direction));
        });
      }

      const querySnapshot = await getDocs(q);
      const data = [];
      querySnapshot.docs.forEach((el) => data.push({ ...el.data(), id: el.id }));

      // Chama a função para encontrar os dois maiores resultados e exibe no console
      const topTwoScores = findTopTwoScores(data);
      setRanking(topTwoScores);
    } catch (error) {
      console.error("Error fetching ranking: ", error);
    }
  };


  const findTopTwoScores = (data) => {
    const topTwoScores = [];

    // Agrupa os resultados pelo nome da pessoa
    const groupedData = data.reduce((acc, curr) => {
      const name = curr.name;
      if (!acc[name]) {
        acc[name] = [];
      }
      acc[name].push(curr.results.total);
      return acc;
    }, {});

    // Encontra os dois maiores resultados para cada pessoa e os adiciona ao array de resultados
    for (const name in groupedData) {
      const scores = groupedData[name];
      const sortedScores = scores.sort((a, b) => b - a);
      const topTwo = sortedScores.slice(0, 2);
      const total = topTwo.reduce((acc, score) => acc + score, 0);
      topTwoScores.push({ name, scores: topTwo, total });
    }

    return topTwoScores.sort((a, b) => b.total - a.total);
  };

  // Exemplo de uso da função fetchRanking com as provas específicas
  const fetchCarabina22MiraAberta = (examId, level, gun) => {
    fetchRanking(examId, level, null, [
      { field: "results.total", direction: "desc" },
      { field: "results.pointsCounter.12", direction: "desc" },
      { field: "results.pointsCounter.10", direction: "desc" },
      { field: "results.pointsCounter.9", direction: "desc" },
      { field: "results.pointsCounter.8", direction: "desc" },
      { field: "results.pointsCounter.7", direction: "desc" },
      { field: "results.pointsCounter.6", direction: "desc" }
    ]);
  };

  const fetchFogoCentral = (examId, level, gun) => {
    fetchRanking(examId, level, gun, [
      { field: "results.total", direction: "desc" },
      { field: "results.pointsCounter.12", direction: "desc" },
      { field: "results.pointsCounter.10", direction: "desc" },
      { field: "results.pointsCounter.9", direction: "desc" },
      { field: "results.pointsCounter.8", direction: "desc" },
      { field: "results.pointsCounter.7", direction: "desc" },
      { field: "results.pointsCounter.6", direction: "desc" }
    ]);
  };

  const fetchPercursoCaca = (examId, level, gun) => {
    fetchRanking(examId, level, null, [
      { field: "results.total", direction: "desc" }
    ]);
  };

  const fetchPercursoCaca20 = (examId, level, gun) => {
    fetchRanking(examId, level, null, [
      { field: "results.total", direction: "desc" }
    ]);
  };

  const fetchTrap10 = (examId, level, gun) => {
    fetchRanking(examId, level, null, [
      { field: "results.total", direction: "desc" }
    ]);
  };

  const fetchSaquePreciso = (examId, level, gun) => {
    fetchRanking(examId, level, gun, [
      { field: "results.total", direction: "desc" },
      { field: "results.pointsCounter.12", direction: "desc" },
      { field: "results.pointsCounter.10", direction: "desc" },
      { field: "results.pointsCounter.9", direction: "desc" },
      { field: "results.pointsCounter.8", direction: "desc" },
      { field: "results.pointsCounter.7", direction: "desc" },
      { field: "results.pointsCounter.6", direction: "desc" }
    ]);
  };

  const fetchSM22Apoiado = (examId, level, gun) => {


    fetchRanking(examId, level, null, [
      { field: "results.total", direction: "desc" }
    ]);
  };

  const fetchSM22Precisao = (examId, level, gun) => {
    fetchRanking(examId, level, null, [
      { field: "results.total", direction: "desc" },
      { field: "results.pointsCounter.12", direction: "desc" },
      { field: "results.pointsCounter.10", direction: "desc" },
      { field: "results.pointsCounter.9", direction: "desc" },
      { field: "results.pointsCounter.8", direction: "desc" },
      { field: "results.pointsCounter.7", direction: "desc" },
      { field: "results.pointsCounter.6", direction: "desc" }
    ]);
  };

  const fetchSmallPistol = (examId, level, gun) => {
    fetchRanking(examId, level, null, [
      { field: "results.total", direction: "desc" },
      { field: "results.pointsCounter.12", direction: "desc" },
      { field: "results.pointsCounter.10", direction: "desc" },
      { field: "results.pointsCounter.9", direction: "desc" },
      { field: "results.pointsCounter.8", direction: "desc" },
      { field: "results.pointsCounter.7", direction: "desc" },
      { field: "results.pointsCounter.6", direction: "desc" }
    ]);
  };

  const fetchTrapAmericano = (examId, level, gun) => {
    fetchRanking(examId, null, null, [
      { field: "results.total", direction: "desc" }
    ]);
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

  return (
    <div className="p-6">
      <div className="flex flex-row items-center gap-4">
        <Link to={`/events/2024`}>
          <button >

            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
            </svg>
          </button>
        </Link>
        <h1 className="text-gray-700 py-4 font-bold text-xl">Ranking Final</h1>
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
                  <td className="text-gray-900 px-6 py-4">{el.total} ({el.scores.map((e, i) => `${e}${i == 1 ? '' : '+'}`)})</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}

      </div>
    </div>
  );
};

export default Live;
