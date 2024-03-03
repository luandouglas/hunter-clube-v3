import {
  collection,
  getDocs,
  orderBy,
  query,
  where
} from "firebase/firestore";
import { useState } from "react";
import { db } from "../../firebaseConfig";
import Layout from "../components/Layout";
import { exams } from "../utils";

const Geral = () => {
  const [ranking, setRanking] = useState([]);

  const [selectedExam, setSelectedExam] = useState("");
  const [selectedLevel, setSelectedLevel] = useState();
  const [selectedGun, setSelectedGun] = useState("");

  const [levels, setLevels] = useState([]);
  const [guns, setGuns] = useState([]);

  const [canSee, setCanSee] = useState(true);
  const [showGun, setShowGun] = useState(true);

  const [dates, setDates] = useState([
    { pontuation: 0, date: '2023-04-02' },
    { pontuation: 0, date: '2023-05-07' },
    { pontuation: 0, date: '2023-06-03' },
    { pontuation: 0, date: '2023-07-09' },
    { pontuation: 0, date: '2023-08-06' },
    { pontuation: 0, date: '2023-09-10' },
    { pontuation: 0, date: '2023-10-08' },
    { pontuation: 0, date: '2023-11-05' },
  ]);

  const fetchRanking = async () => {
    const ruleOne = selectedExam != "EfvFedkhOSML884He43N";
    if (!selectedExam) return;
    if (!selectedLevel && ruleOne) return;
    if (guns.length > 0 && !selectedGun) return;
    setRanking([]);

    if (ruleOne) {
      if (selectedGun) {
        setShowGun(true);
        const querySnapshot = await getDocs(
          query(
            collection(db, "levels-24"),
            where("examId", "==", selectedExam),
            where("level", "==", selectedLevel),
            where("gun", "==", selectedGun),
            orderBy("pontuation", "desc")
          )
        );
        const data = [];
        querySnapshot.docs.forEach((el) => data.push(el.data()));
        setRanking(trataResultado(data.map(e => ({ ...e, pontuation: pegaOs8(e).pontuation, exams: pegaOs8(e).exams }))).sort((a, b) => b.pontuation - a.pontuation));
      } else {
        setShowGun(false);
        setCanSee(true);
        const querySnapshot = await getDocs(
          query(
            collection(db, "levels-24"),
            where("examId", "==", selectedExam),
            where("level", "==", selectedLevel),
            orderBy("pontuation", "desc")
          )
        );
        const data = [];
        querySnapshot.docs.forEach((el) => data.push(el.data()));
        setRanking(trataResultado(data.map(e => ({ ...e, pontuation: pegaOs8(e).pontuation, exams: pegaOs8(e).exams }))).sort((a, b) => b.pontuation - a.pontuation));

      }
    } else {
      setShowGun(false);
      setCanSee(false);
      const querySnapshot = await getDocs(
        query(
          collection(db, "levels-24"),
          where("examId", "==", selectedExam),
          orderBy("pontuation", "desc")
        )
      );
      const data = [];
      querySnapshot.docs.forEach((el) => data.push(el.data()));
      setRanking(trataResultado(data.map(e => ({ ...e, pontuation: pegaOs8(e).pontuation, exams: pegaOs8(e).exams }))).sort((a, b) => b.pontuation - a.pontuation));

    }
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
      handleChangeLevel("beginner");
    }
    setLevels(find?.levels || []);
  };
  const handleChangeLevel = (value) => {
    setSelectedLevel(value);
  };

  const handleChangeGun = (value) => {
    setSelectedGun(value);
  };

  const trataResultado = (a) => {
    return a
      .map(e => ({ ...e, exams: e.exams.filter(j => j.pontuation > 0) }))
      .filter(e => e.exams.length >= 5);
  }

  const pegaOs8 = a => {
    const oitoMaioresValores = a.exams
      .map(exam => exam.pontuation)
      .sort((a, b) => b - a)
      .slice(0, 8)
    const valor = oitoMaioresValores.reduce((acc, valor) => acc + valor, 0)

    const exams = a.exams.map(exam => ({
      ...exam,
      destaque: oitoMaioresValores.includes(exam.pontuation)
    }));

    return { pontuation: valor, exams: exams }

  }

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

  const normalizeArray = (inputArray) => {
    // Lista de datas desejadas
    const desiredDates = [
      '2023-04-02',
      '2023-05-07',
      '2023-06-03',
      '2023-07-09',
      '2023-08-06',
      '2023-09-10',
      '2023-10-08',
      '2023-11-05',
      '2023-12-02'
    ];

    // Crie um objeto para armazenar os valores do array normalizado
    const normalizedObj = {};

    // Inicialize o objeto com todas as datas desejadas
    desiredDates.forEach(date => {
      normalizedObj[date] = [];
    });

    // Preencha os valores do array original no objeto normalizado
    inputArray.forEach(item => {
      const formattedDate = item.date.split('T')[0];
      if (desiredDates.includes(formattedDate)) {
        normalizedObj[formattedDate].push({ date: formattedDate, pontuation: item.pontuation, destaque: item.destaque });
      }
    });

    // Converta o objeto normalizado de volta para um array
    const normalizedArray = desiredDates.reduce((acc, date) => {
      const pontuations = normalizedObj[date].length > 0 ? normalizedObj[date] : [{ date, pontuation: 0 }];
      return [...acc, ...pontuations];
    }, []);

    return normalizedArray;
  }



  return (
    <Layout>
      <h1 className="text-gray-700 py-4 font-bold text-xl">Ranking Final</h1>

      <br></br>

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
          className="bg-green-800 p-2 px-4 rounded-lg text-white"
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
                {canSee && (
                  <th scope="col" className="px-6 py-3">
                    Categoria
                  </th>
                )}
                {showGun && (
                  <th scope="col" className="px-6 py-3">
                    Armamento
                  </th>
                )}
                <th scope="col" className="px-6 py-3">
                  Pontuação
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
                <th scope="col" className="px-6 py-3 text-center ">
                  Jul
                </th>
                <th scope="col" className="px-6 py-3 text-center ">
                  Ago
                </th>
                <th scope="col" className="px-6 py-3 text-center ">
                  Set
                </th>
                <th scope="col" className="px-6 py-3 text-center ">
                  Out
                </th>
                <th scope="col" className="px-6 py-3 text-center ">
                  Nov
                </th>
                <th scope="col" className="px-6 py-3 text-center ">
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
                  {canSee && (
                    <td className="px-6 py-4 text-gray-900">
                      {el.level == "beginner"
                        ? "Inciante"
                        : el.level == "master"
                          ? "Master"
                          : "Super Master"}
                    </td>
                  )}

                  {el.gun && (
                    <td className="px-6 py-4 text-gray-900">
                      {el.gun == "pistol" ? "Pistola" : "Revolver"}
                    </td>
                  )}
                  <td className="text-gray-900 px-6 py-4">{el.pontuation}</td>
                  {normalizeArray(el.exams).map((e, j) =>
                    <td
                      key={j}
                      className={`text-gray-900 px-6 py-4 text-center ${e.destaque && 'bg-blue-gray-300'}`}
                    >
                      {e.pontuation}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </div>
    </Layout>
  );
};

export default Geral;
