import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useState, useCallback, useEffect } from "react";
import { db } from "../../../firebaseConfig";

const Carabina22MiraAberta = ({ onSubmitExam, shooter, dateEvent, examId }) => {
  const [scores, setScores] = useState(Array(3).fill(Array(5).fill(0)));
  const [totalPoints, setTotalPoints] = useState(0);
  const [classification, setClassification] = useState('');
  const [repeatedCounts, setRepeatedCounts] = useState({});
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [level, setLevel] = useState(null);

  const handleInputChange = (e, seqIndex, shotIndex) => {
    const value = parseInt(e.target.value);
    const newValue = (value > 12) ? 12 : (value < 0) ? 0 : value; // Enforcing value range between 0 and 12
    const newScores = scores.map((seq, sIndex) =>
      seq.map((shot, shIndex) =>
        (sIndex === seqIndex && shIndex === shotIndex) ? newValue : shot
      )
    );
    setScores(newScores);
    setIsSubmitDisabled(true); // Disable submit button when score is changed
  };

  const calculateTotalPoints = () => {
    const flatScores = scores.flat();
    const total = flatScores.reduce((sum, score) => sum + (parseInt(score) || 0), 0);
    setTotalPoints(total);
    setClassification(total <= 140 ? 'beginner' : 'master');

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

  const fetchLevel = useCallback(async () => {
    if (!shooter || !examId) {
      return;
    }
    const querySnapshot = await getDocs(
      query(
        collection(db, "levels-24"),
        where("name", "==", shooter),
        where("examId", "==", examId)
      )
    );
    const data = [];
    querySnapshot.docs.forEach((el) => data.push(el.data()));
    if (data.length > 0) {
      setLevel(data[0]);
    }
  }, [shooter, examId]);

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
      if (object.pontuation <= 140) {
        return "beginner";
      } else {
        return "master";
      }
    } else {
      if (totalPoints <= 140) {
        return "beginner";
      } else {
        return "master";
      }
    }
  };

  useEffect(() => {
    fetchLevel();
  }, [shooter, fetchLevel]);

  const onSubmit = () => {
    const points = {
      first: scores[0],
      second: scores[1],
      third: scores[2],
    };

    const userLevel = level ? adjustLevel(level, dateEvent) : classification;
    onSubmitExam({
      points,
      pointsCounter: repeatedCounts,
      total: totalPoints,
      level: userLevel,
      examId,
      name: shooter,
    });
  };

  return (
    <div className="min-h-[460px] p-4 bg-gray-100">
      <div className="max-w-lg mx-auto bg-white p-6  shadow-md">

        {scores.map((sequence, seqIndex) => (
          <div key={seqIndex} className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Sequência {seqIndex + 1}</h3>
            <div className="grid grid-cols-5 gap-2">
              {sequence.map((shot, shotIndex) => (
                <input
                  key={shotIndex}
                  type="number"
                  min="0"
                  max="12"
                  value={shot}
                  onChange={(e) => handleInputChange(e, seqIndex, shotIndex)}
                  className="h-10 p-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ))}
            </div>
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
              <p><strong>Pontuação Total:</strong> {totalPoints}</p>
            </div>
          </>
        )}

        <div className="flex flex-row items-center gap-2 mt-4">
          <button
            onClick={onSubmit}
            className={`w-full h-10 ${isSubmitDisabled ? 'bg-gray-400' : 'bg-gray-800'} text-white  hover:bg-gray-700 transition duration-200`}
            disabled={isSubmitDisabled}
          >
            Submeter
          </button>
          <button className="w-full h-10 bg-gray-600 text-white  hover:bg-gray-500 transition duration-200">
            Ver Rank
          </button>
        </div>
      </div>
    </div>
  );
};

export default Carabina22MiraAberta;
