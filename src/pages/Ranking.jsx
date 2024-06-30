import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, updateDoc, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { db } from "../../firebaseConfig";
import Layout from "../components/Layout";
import { exams } from "../utils";

const Ranking = () => {
  const [ranking, setRanking] = useState([]);
  const navigate = useNavigate()
  const [selectedExam, setSelectedExam] = useState("");
  const [selectedLevel, setSelectedLevel] = useState();
  const [selectedGun, setSelectedGun] = useState("");

  const [levels, setLevels] = useState([]);
  const [guns, setGuns] = useState([]);

  const [showCategory, setShowCategory] = useState(true);
  const [showGun, setShowGun] = useState(true);
  const [event, setEvent] = useState()
  const [isDouble, setIsDouble] = useState(false)
  const { id } = useParams();

  useEffect(() => {
    fetchEvent()
    // findDuplicates()
  }, []);

  const fetchRanking = async () => {
    if (selectedExam === "") return;
    if (selectedExam != "EfvFedkhOSML884He43N") setShowCategory(true);
    if (selectedExam == "EfvFedkhOSML884He43N") fetchCarabina22MiraAberta();
    else if (selectedExam == "KkAF46R6WrwZWq1FNhvX") fetchSaquePreciso();
    else if (selectedExam == "PCb1rh0OrOzxAmCTghGB") fetchSM22Precisao();
    else if (selectedExam == "YchOCURkmZCTsymgHwG0") fetchFogoCentral();
    else if (selectedExam == "cpxPRShLAuDSmBwFKHXw") fetchSmallPistol();
    else if (selectedExam == "hej6E1jjnq81xZMGiqEi") fetchTrapAmericano();
    else if (selectedExam == "q00RXisO4sQqOZ8JfqvW") fetchSM22Apoiado();
    else if (selectedExam == "qnpGZ7u0IW01TZQ4olPn") fetchPercursoCaca();
    else if (selectedExam == "hzTpNUmS4eKFuDHzWQcs") fetchPercursoCaca20();
    else if (selectedExam == "3ZHw4gpIuBq477OGGrur") fetchTrap10();
  };

  const findDuplicates = async () => {
    const levels24Snapshot = await getDocs(collection(db, "levels-24"));
    const records = {};

    levels24Snapshot.forEach(doc => {
      const data = doc.data();
      const key = `${data.name.trim().toLowerCase()}-${data.examId.trim().toLowerCase()}-${data.gun ? data.gun.trim().toLowerCase() : ''}`;

      if (!records[key]) {
        records[key] = [];
      }
      records[key].push(data);
    });

    const duplicates = Object.values(records).filter(group => group.length > 1);
    console.log(duplicates);
    return duplicates;
  };

  async function mergeLevels() {
    try {
      // Buscar documentos nas coleções levels-24 e levels
      const levels24Snapshot = await getDocs(collection(db, "levels-24"));
      const levelsSnapshot = await getDocs(collection(db, "levels"));

      const allLevels = [];
      const duplicates = [];
      const uniqueLevels = new Map();

      const normalize = (item) => ({
        name: item.name.trim().toLowerCase(),
        examId: item.examId.trim().toLowerCase(),
        gun: item.gun ? item.gun.trim().toLowerCase() : null,
        level: item.level
      });

      const addOrUpdateLevel = (level) => {
        const normalizedLevel = normalize(level);
        const key = `${normalizedLevel.name}-${normalizedLevel.examId}-${normalizedLevel.gun}-${normalizedLevel.level}`;

        if (uniqueLevels.has(key)) {
          const existingLevel = uniqueLevels.get(key);
          existingLevel.rankings = [...existingLevel.rankings, ...level.rankings];
          duplicates.push({ name: level.name, level: level.level });
        } else {
          uniqueLevels.set(key, { ...level, rankings: [...level.rankings] });
        }
      };

      // Processar documentos de levels-24
      levels24Snapshot.forEach(doc => {
        const data = doc.data();
        addOrUpdateLevel({ ...data, id: doc.id });
      });

      // Processar documentos de levels
      levelsSnapshot.forEach(doc => {
        const data = doc.data();
        addOrUpdateLevel({ ...data, id: doc.id });
      });

      const mergedLevels = Array.from(uniqueLevels.values());

      // console.log("Merged Levels:", mergedLevels);
      // console.log("Duplicates:", duplicates);

      return { merged: mergedLevels, duplicates: duplicates };
    } catch (error) {
      console.error('Erro ao mesclar documentos: ', error);
    }
  }

  const fetchEvent = async () => {
    const eventDocRef = doc(db, "events", id);
    const eventDocSnapshot = await getDoc(eventDocRef);

    if (eventDocSnapshot.exists()) {
      const eventData = eventDocSnapshot.data();
      setEvent(eventData);

      if (eventData.isDouble) {
        setIsDouble(true)
      } else {
        setIsDouble(false)

      }
    }
  }

  async function findMissingLevels() {
    try {
      // Buscar documentos na coleção levels-24
      const levels24Snapshot = await getDocs(collection(db, "levels-24"));
      const levels24Names = new Set();

      levels24Snapshot.forEach(doc => {
        const name = doc.data().name.trimEnd().toLowerCase();
        levels24Names.add(name);
      });

      // Buscar documentos na coleção levels
      const levelsSnapshot = await getDocs(collection(db, "levels"));

      let missingLevels = [];
      levelsSnapshot.forEach(doc => {
        const name = doc.data().name.trimEnd().toLowerCase();
        if (levels24Names.has(name)) {
          missingLevels.push({ ...doc.data(), id: doc.id });
        }
      });

      console.log(missingLevels);
      return missingLevels;
    } catch (error) {
      console.error('Erro ao buscar documentos: ', error);
    }
  }

  async function updateLevels() {
    try {
      const querySnapshot = await getDocs(
        query(
          collection(db, "levels"),
        )
      );

      let level = []

      // querySnapshot.forEach((e) => {
      //   level.push({ ...e.data(), id: e.id });
      // });

      console.log(level);

      const updatedLevels = level.map(f => ({
        name: f.name.trimEnd(),
        examId: f.examId,
        ...(f.gun && { gun: f.gun }),
        ...(f.level && { level: f.level }),
        rankings: [{
          pontuation: f.pontuation,
          firstRankingDate: f.firstRankingDate,
          exams: f.exams,
          year: '2023'
        }]
      }));

      // Deleta cada documento na coleção
      for (const levelData of level) {
        const levelDocRef = doc(db, "levels", levelData.id);
        await deleteDoc(levelDocRef);
      }

      // console.log('Documentos deletados com sucesso.');

      // // Cria novos documentos com os dados atualizados
      for (const newLevelData of level) {
        console.log(newLevelData);
        await addDoc(collection(db, "levels-new"), newLevelData);
      }

      console.log('Documentos atualizados com sucesso.');
    } catch (error) {
      console.error('Erro ao atualizar documentos: ', error);
    }
  }

  const removeDuplicateNames = (persons) => {
    const map = new Map();

    for (const person of persons) {
      if (
        !map.has(person.name) ||
        map.get(person.name).results.total < person.results.total
      ) {
        map.set(person.name, person);
      }
    }
    return Array.from(map.values());
  };
  const handleChangeExam = (value) => {
    setSelectedExam(value);
    const find = exams.find((e) => e.id == value);
    if (!find?.guns) {
      setGuns([]);
      setSelectedGun("");
    } else {
      setGuns(find.guns);
      setSelectedGun("pistol");
    }
    if (!find?.levels) {
      handleChangeLevel("");
    } else {
      handleChangeLevel(find?.levels[0].value);
    }
    setLevels(find?.levels || []);
  };
  const handleChangeLevel = (value) => {
    setSelectedLevel(value);
  };
  const handleChangeGun = (value) => {
    setSelectedGun(value);
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
  const fetchCarabina22MiraAberta = async () => {
    setShowCategory(true);
    setShowGun(false);
    const querySnapshot = await getDocs(
      query(
        collection(db, "exam-results"),
        where("examId", "==", selectedExam),
        where("eventId", "==", id),
        where("results.level", "==", selectedLevel),
        orderBy("results.total", "desc"),
        orderBy("results.pointsCounter.12", "desc"),
        orderBy("results.pointsCounter.10", "desc"),
        orderBy("results.pointsCounter.9", "desc"),
        orderBy("results.pointsCounter.8", "desc"),
        orderBy("results.pointsCounter.7", "desc"),
        orderBy("results.pointsCounter.6", "desc")
      )
    );
    const data = [];
    querySnapshot.docs.forEach((el) => data.push({ ...el.data(), id: el.id }));

    const filteredData = isDouble ? findTopTwoScores(data) : removeDuplicateNames(data);
    setRanking(filteredData);
  };
  const fetchFogoCentral = async () => {
    setShowGun(true);

    const querySnapshot = await getDocs(
      query(
        collection(db, "exam-results"),
        where("examId", "==", selectedExam),
        where("eventId", "==", id),
        where("results.level", "==", selectedLevel),
        where("results.gun", "==", selectedGun),
        orderBy("results.total", "desc"),
        orderBy("results.pointsCounter.12", "desc"),
        orderBy("results.pointsCounter.10", "desc"),
        orderBy("results.pointsCounter.9", "desc"),
        orderBy("results.pointsCounter.8", "desc"),
        orderBy("results.pointsCounter.7", "desc"),
        orderBy("results.pointsCounter.6", "desc")
      )
    );
    const data = [];
    querySnapshot.docs.forEach((el) => data.push({ ...el.data(), id: el.id }));

    const filteredData = isDouble ? findTopTwoScores(data) : removeDuplicateNames(data);
    setRanking(filteredData);

  };
  const fetchPercursoCaca = async () => {
    setShowCategory(true);
    setShowGun(false);

    const querySnapshot = await getDocs(
      query(
        collection(db, "exam-results"),
        where("examId", "==", selectedExam),
        where("eventId", "==", id),
        orderBy("results.total", "desc")
      )
    );
    const data = [];
    querySnapshot.docs.forEach((el) => data.push({ ...el.data(), id: el.id }));
    const filteredData = isDouble ? findTopTwoScores(data) : removeDuplicateNames(data);
    setRanking(filteredData);
  };

  const fetchPercursoCaca20 = async () => {
    setShowCategory(true);
    setShowGun(false);

    const querySnapshot = await getDocs(
      query(
        collection(db, "exam-results"),
        where("examId", "==", selectedExam),
        where("eventId", "==", id),
        orderBy("results.total", "desc")
      )
    );
    const data = [];
    querySnapshot.docs.forEach((el) => data.push({ ...el.data(), id: el.id }));
    const filteredData = isDouble ? findTopTwoScores(data) : removeDuplicateNames(data);
    setRanking(filteredData);
  };

  const fetchTrap10 = async () => {
    setShowCategory(true);
    setShowGun(false);

    const querySnapshot = await getDocs(
      query(
        collection(db, "exam-results"),
        where("examId", "==", selectedExam),
        where("results.level", "==", selectedLevel),
        where("eventId", "==", id),
        orderBy("results.total", "desc")
      )
    );
    const data = [];
    querySnapshot.docs.forEach((el) => data.push({ ...el.data(), id: el.id }));
    const filteredData = isDouble ? findTopTwoScores(data) : removeDuplicateNames(data);
    setRanking(filteredData);
  };

  const fetchSaquePreciso = async () => {
    setShowGun(true);

    const querySnapshot = await getDocs(
      query(
        collection(db, "exam-results"),
        where("examId", "==", selectedExam),
        where("eventId", "==", id),
        where("results.level", "==", selectedLevel),
        where("results.gun", "==", selectedGun),
        orderBy("results.total", "desc"),
        orderBy("results.pointsCounter.12", "desc"),
        orderBy("results.pointsCounter.10", "desc"),
        orderBy("results.pointsCounter.9", "desc"),
        orderBy("results.pointsCounter.8", "desc"),
        orderBy("results.pointsCounter.7", "desc"),
        orderBy("results.pointsCounter.6", "desc")
      )
    );
    const data = [];
    querySnapshot.docs.forEach((el) => data.push({ ...el.data(), id: el.id }));

    const filteredData = isDouble ? findTopTwoScores(data) : removeDuplicateNames(data);
    setRanking(filteredData);
  };
  const fetchSM22Apoiado = async () => {
    setShowCategory(true);
    setShowGun(false);

    const querySnapshot = await getDocs(
      query(
        collection(db, "exam-results"),
        where("examId", "==", selectedExam),
        where("results.level", "==", selectedLevel),
        where("eventId", "==", id),
        orderBy("results.total", "desc")
      )
    );
    const data = [];
    querySnapshot.docs.forEach((el) => data.push({ ...el.data(), id: el.id }));

    const filteredData = isDouble ? findTopTwoScores(data) : removeDuplicateNames(data);
    setRanking(filteredData);
  };
  const fetchSM22Precisao = async () => {
    setShowGun(false);

    const querySnapshot = await getDocs(
      query(
        collection(db, "exam-results"),
        where("examId", "==", selectedExam),
        where("eventId", "==", id),
        where("results.level", "==", selectedLevel),
        orderBy("results.total", "desc"),
        orderBy("results.pointsCounter.12", "desc"),
        orderBy("results.pointsCounter.10", "desc"),
        orderBy("results.pointsCounter.9", "desc"),
        orderBy("results.pointsCounter.8", "desc"),
        orderBy("results.pointsCounter.7", "desc"),
        orderBy("results.pointsCounter.6", "desc")
      )
    );
    const data = [];
    querySnapshot.docs.forEach((el) => data.push({ ...el.data(), id: el.id }));

    const filteredData = isDouble ? findTopTwoScores(data) : removeDuplicateNames(data);
    setRanking(filteredData);
  };
  const fetchSmallPistol = async () => {
    setShowGun(false);

    const querySnapshot = await getDocs(
      query(
        collection(db, "exam-results"),
        where("examId", "==", selectedExam),
        where("eventId", "==", id),
        where("results.level", "==", selectedLevel),
        orderBy("results.total", "desc"),
        orderBy("results.pointsCounter.12", "desc"),
        orderBy("results.pointsCounter.10", "desc"),
        orderBy("results.pointsCounter.9", "desc"),
        orderBy("results.pointsCounter.8", "desc"),
        orderBy("results.pointsCounter.7", "desc"),
        orderBy("results.pointsCounter.6", "desc")
      )
    );
    const data = [];
    querySnapshot.docs.forEach((el) => data.push({ ...el.data(), id: el.id }));

    const filteredData = isDouble ? findTopTwoScores(data) : removeDuplicateNames(data);
    setRanking(filteredData);
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
  const fetchTrapAmericano = async () => {
    setShowCategory(false);
    const querySnapshot = await getDocs(
      query(
        collection(db, "exam-results"),
        where("examId", "==", selectedExam),
        where("eventId", "==", id),
        orderBy("results.total", "desc")
      )
    );
    const data = [];
    querySnapshot.docs.forEach((el) => data.push({ ...el.data(), id: el.id }));
    const filteredData = isDouble ? findTopTwoScores(data) : removeDuplicateNames(data);
    setRanking(filteredData);
  };

  return (
    <Layout>

      <br></br>
      <div className="flex flex-row items-center gap-4">
        <button onClick={() => navigate(-1)} >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
          </svg>
        </button>
        <h1 className="text-gray-700 py-4 font-bold text-xl">Ranking</h1>
      </div>
      <div className="relative w-full flex flex-row items-center gap-4 mb-4">
        <select
          className="text-blue-gray-700 font-sans font-normal text-left outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all border text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200"
          value={selectedExam}
          onChange={(e) => handleChangeExam(e.target.value)}
        >
          <option key={0} value={""} disabled>
            Selecione a prova
          </option>

          {exams.map((e) => (
            <option key={e.id} value={e.id}>
              {e.tipo_prova}
            </option>
          ))}
        </select>
        {levels.length ? (
          <select
            className="bg-transparent text-blue-gray-700 font-sans font-normal text-left outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all border text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200"
            value={selectedLevel}
            onChange={(e) => handleChangeLevel(e.target.value)}
          >
            <option value={undefined} key={0} disabled>
              Selecione a classificação
            </option>

            {levels.map((e) => (
              <option key={e.value} value={e.value}>
                {e.label}
              </option>
            ))}
          </select>
        ) : null}
        {guns.length ? (
          <select
            className="bg-transparent text-blue-gray-700 font-sans font-normal text-left outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all border text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200"
            value={selectedGun}
            onChange={(e) => handleChangeGun(e.target.value)}
          >
            <option value={undefined} key={0} disabled>
              Selecione o armamento
            </option>

            {guns.map((e) => (
              <option key={e.value} value={e.value}>
                {e.label}
              </option>
            ))}
          </select>
        ) : null}
        <button
          className="bg-blue-600 p-2 px-4 rounded-lg text-white"
          onClick={() => fetchRanking()}
        >
          Buscar
        </button>
        {/* <Button onClick={() => fetchRanking()}>Buscar</Button> */}
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        {ranking.length ? (
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 ">
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
                  {
                    isDouble ?
                      <td className="text-gray-900 px-6 py-4">{el.total.toFixed(0)} ({el.scores[0].toFixed(0)}{el.scores.length > 1 ? `+${el.scores[1].toFixed(0)}` : ''})</td> :
                      <td className="text-gray-900 px-6 py-4">{el.results.total.toFixed(0)}</td>
                  }


                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </div>
    </Layout >
  );
};
export default Ranking;
