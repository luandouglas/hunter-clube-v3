import React, { useState, useEffect, useCallback, useRef } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

const SM22Precisao = ({ onSubmitExam, shooter, dateEvent, examId, data }) => {
  const [scores, setScores] = useState({
    first: [false, false, false, false, false, 0, 0, 0, 0, 0],
    second: [false, false, false, false, false, 0, 0, 0, 0, 0],
    third: [false, false, false, false, false, 0, 0, 0, 0, 0],
  });
  const [totalPoints, setTotalPoints] = useState(0);
  const [classification, setClassification] = useState("");
  const [repeatedCounts, setRepeatedCounts] = useState({});
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [level, setLevel] = useState();
  const [extraChecks, setExtraChecks] = useState({
    first: false,
    second: false,
    third: false,
  });
  const extraRefs = {
    first: useRef(null),
    second: useRef(null),
    third: useRef(null),
  };

  useEffect(() => {
    if (data) {
      setScores(data.results.points);
    }
  }, [data]);

  useEffect(() => {
    ["first", "second", "third"].forEach((series) => {
      const checkboxes = scores[series].slice(0, 5); // só os 5 primeiros
      const markedCount = checkboxes.filter(Boolean).length;
      const ref = extraRefs[series]?.current;

      if (ref) {
        if (markedCount > 0 && markedCount < 5) {
          ref.indeterminate = true;
          ref.checked = false; // importante para exibir corretamente
        } else {
          ref.indeterminate = false;
          ref.checked = markedCount === 5;
        }
      }
    });
  }, [scores]);

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
    const flatScores = scores.first.concat(scores.second, scores.third);
    const total =
      flatScores.reduce((sum, score) => sum + (parseInt(score) || 0), 0) +
      scores.first.reduce(
        (count, score) => count + (score === true ? 10 : 0),
        0
      ) +
      scores.second.reduce(
        (count, score) => count + (score === true ? 10 : 0),
        0
      ) +
      scores.third.reduce(
        (count, score) => count + (score === true ? 10 : 0),
        0
      );
    setTotalPoints(total);
    if (classification == "") {
      setClassification(getClassification(total));
    }

    setRepeatedCounts(countPoints(scores));
    setIsSubmitDisabled(false); // Enable submit button after calculating total points
  };

  const countPoints = (points) => {
    const result = {};

    for (let serie in points) {
      for (let shot of points[serie]) {
        result[shot] = (result[shot] || 0) + 1;
      }
    }

    for (let i = 0; i <= 12; i++) {
      if (!result[i]) {
        result[i] = 0;
      }
    }

    return result;
  };

  const getClassification = (total) => {
    if (total <= 250) {
      return "beginner";
    } else if (total <= 280) {
      return "master";
    } else {
      return "super-master";
    }
  };

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
    if (data.length > 0) {
      return { level: data[0].level };
    } else {
      return { level: getClassification(totalPoints) };
    }
  };

  useEffect(() => {
    fetchLevel();
  }, [shooter, fetchLevel]);

  const checkLevel = (object, newDate) => {
    if (object && object.level && object.firstRankingDate !== newDate) {
      return true;
    }
    return false;
  };

  const adjustLevel = (object, newDate) => {
    if (checkLevel(object, newDate)) {
      return object.level;
    } else if (object && object.level && object.firstRankingDate === newDate) {
      if (object.pontuation <= 250) {
        return "beginner";
      } else if (object.pontuation <= 280) {
        return "master";
      } else {
        return "super-master";
      }
    } else {
      if (totalPoints <= 250) {
        return "beginner";
      } else if (totalPoints <= 280) {
        return "master";
      } else {
        return "super-master";
      }
    }
  };

  const onSubmit = () => {
    const points = {
      first: scores.first,
      second: scores.second,
      third: scores.third,
    };
    fetchLevel().then(({ level }) => {
      onSubmitExam({
        points,
        pointsCounter: repeatedCounts,
        total: totalPoints,
        level,
        examId,
        name: shooter,
      });
    });
  };

  const onReset = () => {
    setScores({
      first: [false, false, false, false, false, 0, 0, 0, 0, 0],
      second: [false, false, false, false, false, 0, 0, 0, 0, 0],
      third: [false, false, false, false, false, 0, 0, 0, 0, 0],
    });
  };

  return (
    <div className="min-h-[460px] p-4 bg-gray-100">
      <div className="max-w-lg mx-auto bg-white p-6 rounded-md shadow-md">
        <div className="mb-4">
          {["first", "second", "third"].map((series, seriesIndex) => (
            <div key={seriesIndex} className="flex items-center gap-4">
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">
                  {series === "first" &&
                    "1ª Série: Alvo de precisão – 05 metros"}
                  {series === "second" &&
                    "2ª Série: Alvo de precisão – 10 metros"}
                  {series === "third" && "3ª Série: Alvo de duelo – 15 metros"}
                </h3>
                <div className="grid grid-cols-5 gap-2">
                  {scores[series].map((shot, shotIndex) => (
                    <input
                      key={shotIndex}
                      type={shotIndex < 5 ? "checkbox" : "text"}
                      {...(shotIndex < 5
                        ? {
                            checked: scores[series][shotIndex],
                            onChange: (e) =>
                              handleInputChange(e, series, shotIndex),
                          }
                        : {
                            value: scores[series][shotIndex],
                            onChange: (e) =>
                              handleInputChange(e, series, shotIndex),
                          })}
                      className={
                        shotIndex < 5
                          ? "h-5 p-2 border border-gray-300"
                          : "h-10 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      }
                    />
                  ))}
                </div>
              </div>
              <input
                type="checkbox"
                title="Disparo extra"
                ref={extraRefs[series]}
                checked={extraChecks?.[series] || false}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setExtraChecks({
                    ...extraChecks,
                    [series]: checked,
                  });

                  if (checked) {
                    for (let i = 0; i < 5; i++) {
                      handleInputChange(true, series, i);
                    }
                  } else {
                    for (let i = 0; i < 5; i++) {
                      handleInputChange(false, series, i);
                    }
                  }
                }}
              />
            </div>
          ))}
        </div>
        <button
          onClick={calculateTotalPoints}
          className="w-full bg-gray-800 text-white p-2 rounded-md hover:bg-gray-700 transition duration-200 mb-2"
        >
          Calcular Pontuação Total
        </button>
        {totalPoints > 0 && (
          <div className="mt-4 p-4 border border-gray-300 rounded-md">
            <p>
              <strong>Pontuação Total:</strong> {totalPoints}
            </p>
          </div>
        )}
        <div className="flex flex-row items-center gap-2 mt-4">
          <button
            onClick={onSubmit}
            className={`w-full h-10 ${
              isSubmitDisabled ? "bg-gray-400" : "bg-gray-800"
            } text-white hover:bg-gray-700 transition duration-200`}
            disabled={isSubmitDisabled}
          >
            Submeter
          </button>
          <button
            onClick={() => onReset()}
            className="w-full h-10 bg-gray-600 text-white hover:bg-gray-500 transition duration-200"
          >
            Limpar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SM22Precisao;
