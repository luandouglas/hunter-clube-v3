import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useState, useCallback, useEffect, useRef } from "react";
import { db } from "../../../firebaseConfig";

const SM22Apoiado = ({ onSubmitExam, shooter, dateEvent, examId, data }) => {
  const [scores, setScores] = useState({
    first: Array(10).fill(false), // Array de 10 disparos para cada sequência
    second: Array(10).fill(false),
    third: Array(10).fill(false),
    fourth: Array(10).fill(false),
  });
  const [totalPoints, setTotalPoints] = useState(0);
  const [classification, setClassification] = useState("");
  const [repeatedCounts, setRepeatedCounts] = useState({});
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [extraChecks, setExtraChecks] = useState({
    first: false,
    second: false,
    third: false,
    fourth: false,
  });
  const extraRefs = {
    first: useRef(null),
    second: useRef(null),
    third: useRef(null),
    fourth: useRef(null),
  };

  useEffect(() => {
    if (data) {
      setScores(data.results.points);
    }
  }, [data]);

  useEffect(() => {
    ["first", "second", "third", "fourth"].forEach((series) => {
      const checkboxes = scores[series].slice(0, 10);
      const markedCount = checkboxes.filter(Boolean).length;
      const ref = extraRefs[series]?.current;

      if (ref) {
        if (markedCount > 0 && markedCount < 10) {
          ref.indeterminate = true;
          ref.checked = false;
        } else {
          ref.indeterminate = false;
          ref.checked = markedCount === 10;
        }
      }
    });
  }, [scores]);

  const fetchLevel = async () => {
    if (!shooter || !examId) {
      return;
    }
    const querySnapshot = await getDocs(
      query(
        collection(db, "levels-25"),
        where("name", "==", shooter),
        where("examId", "==", examId)
      )
    );
    const data = [];
    querySnapshot.docs.forEach((el) => data.push(el.data()));
    console.log(data);
    if (data.length > 0) {
      return { level: data[0].level };
    } else {
      return { level: getClassification(totalPoints) };
    }
  };

  const handleInputChange = (e, section, index) => {
    const newScores = { ...scores };
    const isManualCall = typeof e === "boolean";

    if (isManualCall) {
      // chamada manual
      newScores[section][index] = e;
    } else {
      const { type, checked, value } = e.target;

      if (type === "checkbox") {
        newScores[section][index] = checked;
      } else {
        let newValue = parseInt(value);
        if (isNaN(newValue)) {
          newValue = 0;
        } else {
          newValue = Math.min(Math.max(newValue, 0), 12);
        }
        newScores[section][index] = newValue;
      }
    }

    setScores(newScores);
    setIsSubmitDisabled(true);
  };

  const calculateTotalPoints = () => {
    const flatScores = scores.first.concat(
      scores.second,
      scores.third,
      scores.fourth
    );

    // Calcula a pontuação total
    const total = flatScores.reduce((sum, score, index) => {
      if (score === true) {
        if (
          index >=
          scores.first.length + scores.second.length + scores.third.length
        ) {
          return sum + 0.1; // Cada galinha derrubada à 100 metros soma 0,1 ponto
        }
        return sum + 1; // Cada acerto em porcos, perus, carneiros e galinhas soma 1 ponto
      }
      return sum;
    }, 0);

    setTotalPoints(Number(total).toFixed(1));
    if (classification == "") {
      setClassification(getClassification(total));
    }

    // Contagem de ocorrências de cada valor
    const countOccurrences = flatScores.reduce((acc, score) => {
      const key = score === true ? "true" : String(score);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    delete countOccurrences.false;
    setRepeatedCounts(countOccurrences);

    setIsSubmitDisabled(false); // Habilita o botão de submissão após calcular a pontuação total
  };

  const getClassification = (total) => {
    if (total <= 27) {
      return "beginner";
    } else {
      return "master";
    }
  };

  const onSubmit = () => {
    fetchLevel().then(({ level }) => {
      onSubmitExam({
        points: scores,
        pointsCounter: repeatedCounts,
        total: Number(totalPoints),
        level,
        examId,
        name: shooter,
      });
    });
  };

  const onReset = () => {
    setScores({
      first: Array(10).fill(false),
      second: Array(10).fill(false),
      third: Array(10).fill(false),
      fourth: Array(10).fill(false),
    });
  };

  return (
    <div className="min-h-[460px] p-4 bg-gray-100">
      <div className="max-w-lg mx-auto bg-white p-6 rounded-md shadow-md">
        <div className="mb-4">
          {["first", "second", "third", "fourth"].map((series, seqIndex) => (
            <div key={seqIndex} className="flex items-center gap-4">
              <div className="mb-4 flex-1">
                <h3 className="text-lg font-semibold mb-2">
                  {series === "first" && "Silhueta Porcos 50 metros"}
                  {series === "second" && "Silhueta Peru 75 metros"}
                  {series === "third" && "Silhueta Carneiro 100 metros"}
                  {series === "fourth" && "Silhueta Galinha 100 metros"}
                </h3>
                <div className="grid grid-cols-5 gap-2">
                  {scores[series].map((shot, shotIndex) => (
                    <input
                      key={shotIndex}
                      type="checkbox"
                      checked={scores[series][shotIndex]}
                      disabled={series === "fourth" && totalPoints < 30}
                      onChange={(e) => handleInputChange(e, series, shotIndex)}
                      className="h-5 p-2 border border-gray-300"
                    />
                  ))}
                </div>
              </div>
              <input
                type="checkbox"
                title="Disparo extra"
                ref={extraRefs[series]}
                disabled={series === "fourth" && totalPoints < 30}
                checked={extraChecks?.[series] || false}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setExtraChecks({
                    ...extraChecks,
                    [series]: checked,
                  });

                  if (checked) {
                    for (let i = 0; i < 10; i++) {
                      handleInputChange(true, series, i);
                    }
                  } else {
                    for (let i = 0; i < 10; i++) {
                      handleInputChange(false, series, i);
                    }
                  }
                }}
                className="h-5 w-5 cursor-pointer ml-4"
              />
            </div>
          ))}

          <button
            onClick={calculateTotalPoints}
            className="w-full bg-gray-800 text-white p-2  hover:bg-gray-700 transition duration-200 mb-2"
          >
            Calcular Pontuação Total
          </button>

          {totalPoints > 0 && (
            <>
              <div className="mt-4 p-4 border border-gray-300 ">
                <p>
                  <strong>Pontuação Total:</strong> {totalPoints}
                </p>
              </div>
            </>
          )}

          <div className="flex flex-row items-center gap-2 mt-4">
            <button
              onClick={onSubmit}
              className={`w-full h-10 ${
                isSubmitDisabled ? "bg-gray-400" : "bg-gray-800"
              } text-white  hover:bg-gray-700 transition duration-200`}
              disabled={isSubmitDisabled}
            >
              Submeter
            </button>
            <button
              onClick={() => onReset()}
              className="w-full h-10 bg-gray-600 text-white  hover:bg-gray-500 transition duration-200"
            >
              Limpar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SM22Apoiado;
