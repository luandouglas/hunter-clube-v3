import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useState, useCallback, useEffect } from "react";
import { db } from "../../../firebaseConfig";

const SM22Apoiado = ({ onSubmitExam, shooter, dateEvent, examId }) => {
  const [scores, setScores] = useState({
    first: Array(10).fill(false), // Array de 10 disparos para cada sequência
    second: Array(10).fill(false),
    third: Array(10).fill(false),
    fourth: Array(10).fill(false),
  });
  const [totalPoints, setTotalPoints] = useState(0);
  const [classification, setClassification] = useState('');
  const [repeatedCounts, setRepeatedCounts] = useState({});
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

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
      return { level: data[0].level }
    } else {
      return { level: getClassification(totalPoints) }
    }
  }

  const handleInputChange = (e, seqIndex, shotIndex) => {
    const { type, checked } = e.target;
    const newScores = { ...scores };
    newScores[seqIndex][shotIndex] = type === 'checkbox' ? checked : parseInt(value);
    setScores(newScores);
    setIsSubmitDisabled(true); // Desabilita o botão de submissão quando a pontuação é alterada
  };

  const calculateTotalPoints = () => {
    const flatScores = scores.first.concat(scores.second, scores.third, scores.fourth);

    // Calcula a pontuação total
    const total = flatScores.reduce((sum, score, index) => {
      if (score === true) {
        if (index >= scores.first.length + scores.second.length + scores.third.length) {
          return sum + 0.1; // Cada galinha derrubada à 100 metros soma 0,1 ponto
        }
        return sum + 1; // Cada acerto em porcos, perus, carneiros e galinhas soma 1 ponto
      }
      return sum;
    }, 0);

    setTotalPoints(Number(total).toFixed(1));
    if (classification == '') {
      setClassification(getClassification(total));
    }

    // Contagem de ocorrências de cada valor
    const countOccurrences = flatScores.reduce((acc, score) => {
      const key = score === true ? 'true' : String(score);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    delete countOccurrences.false;
    setRepeatedCounts(countOccurrences);

    setIsSubmitDisabled(false); // Habilita o botão de submissão após calcular a pontuação total
  };

  const getClassification = (total) => {
    if (total <= 27) {
      return 'beginner';
    } else {
      return 'master';
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

  return (
    <div className="min-h-[460px] p-4 bg-gray-100">
      <div className="max-w-lg mx-auto bg-white p-6  shadow-md">

        {['first', 'second', 'third', 'fourth'].map((sequence, seqIndex) => (
          <div key={seqIndex} className="mb-4">
            <h3 className="text-lg font-semibold mb-2">
              {sequence === 'first' && 'Silhueta Porcos 50 metros'}
              {sequence === 'second' && 'Silhueta Peru 75 metros'}
              {sequence === 'third' && 'Silhueta Carneiro 100 metros'}
              {sequence === 'fourth' && 'Silhueta Galinha 100 metros'}
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {scores[sequence].map((shot, shotIndex) => (
                <React.Fragment key={shotIndex}>
                  {(shotIndex % 10 === 0 && shotIndex !== 0) && <p>Próxima sequência de disparos</p>}
                  <input
                    type="checkbox"
                    checked={shot}
                    disabled={sequence === "fourth" && totalPoints < 30}
                    onChange={(e) => handleInputChange(e, sequence, shotIndex)}
                    className="h-5 p-2 border border-gray-300"
                  />
                </React.Fragment>
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

export default SM22Apoiado;
