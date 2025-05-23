import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../../firebaseConfig";
const FogoCentral = ({ onSubmitExam, shooter, dateEvent, examId, data }) => {
  const [gunType, setGunType] = useState("pistol");
  const [scores, setScores] = useState({
    first: Array(3).fill(0),
    second: Array(3).fill(0),
    third: Array(3).fill(0),
    fourth: Array(3).fill(0),
  });
  const [repeatedCounts, setRepeatedCounts] = useState({});
  const [totalPoints, setTotalPoints] = useState(0);
  const [classification, setClassification] = useState("");
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  useEffect(() => {
    if (data) {
      setGunType(data.results.gun);
      setScores(data.results.points);
    }
  }, [data]);

  const fetchLevel = async () => {
    if (!shooter || !examId) {
      return;
    }
    const querySnapshot = await getDocs(
      query(
        collection(db, "levels-25"),
        where("name", "==", shooter.trimEnd()),
        where("gun", "==", gunType),
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

  const handleInputChange = (e, series, index, maxValue = 12) => {
    const value = parseInt(e.target.value);
    const newValue = isNaN(value) ? 0 : Math.min(value, maxValue); // Se não for um número, definir como 0. Se for maior que maxValue, definir como maxValue
    const newScores = { ...scores };
    newScores[series][index] = newValue;
    setScores(newScores);
    setIsSubmitDisabled(true); // Disable submit button when score is changed
  };

  const onSubmit = () => {
    fetchLevel().then(({ level }) => {
      onSubmitExam({
        points: scores,
        pointsCounter: repeatedCounts,
        total: totalPoints,
        level,
        gun: gunType,
        examId,
        name: shooter,
      });
    });
  };

  const onReset = () => {
    setScores({
      first: Array(3).fill(0),
      second: Array(3).fill(0),
      third: Array(3).fill(0),
      fourth: Array(3).fill(0),
    });
  };

  const calculateTotalPoints = () => {
    const flatScores = scores.first.concat(
      scores.second,
      scores.third,
      scores.fourth
    );

    const total = flatScores.reduce(
      (sum, score) => sum + (parseInt(score) || 0),
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
    if (total <= 105) {
      return "beginner";
    } else {
      return "master";
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <div className="max-w-lg mx-auto bg-white p-6 rounded-md shadow-md">
        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2">
            Escolha a arma:
          </label>
          <select
            value={gunType}
            onChange={(e) => setGunType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="pistol">Pistola</option>
            <option value="revolver">Revólver</option>
          </select>
        </div>
        {["first", "second", "third", "fourth"].map((series, seriesIndex) => (
          <div key={seriesIndex} className="mb-4">
            <h3 className="text-lg font-semibold mb-2">
              {series === "first" && "1ª Série: Alvo de precisão"}
              {series === "second" && "2ª Série: Alvo de precisão"}
              {series === "third" && "3ª Série: Alvo de duelo"}
              {series === "fourth" && "4ª Série: Alvo de duelo"}
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {scores[series].map((shot, shotIndex) => (
                <input
                  key={shotIndex}
                  type="number"
                  min="0"
                  max="12"
                  value={shot}
                  onChange={(e) =>
                    handleInputChange(
                      e,
                      series,
                      shotIndex,
                      ["first", "second"].includes(series) ? 10 : 12
                    )
                  }
                  className="h-10 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ))}
            </div>
          </div>
        ))}
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

export default FogoCentral;
