import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useCallback, useEffect } from "react";
import { db } from "../../../firebaseConfig";

const TrapAmericano = ({ onSubmitExam, shooter, dateEvent, examId }) => {
  const [values, setValues] = React.useState();
  const handleValueChange = (newValue, maxValue) => {

    const regex = /^-?\d*\.?\d*$/;

    if (regex.test(newValue)) {
      const numericValue = parseFloat(newValue);

      if (!isNaN(numericValue)) {
        if (numericValue <= maxValue) {
          setValues(newValue);
        } else {
          setValues(maxValue.toString());
        }
      } else {
        setValues(newValue); // Permite a entrada parcial como '0.'
      }
    }
  };

  const onSubmit = () => {
    onSubmitExam({
      points: values,
      pointsCounter: countPoints(values),
      total: sumValues(),
      examId,
      name: shooter,
    });
  };

  return (
    <>
      <div className="min-h-[460px]">
        <div className="w-full max-w-md ">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={values}
              onChange={e => handleValueChange(e.target.value, 25)}
              placeholder="Digite aqui sua nota"
              className="flex-grow h-10 p-2 border outline-none border-gray-300 focus:outline-none"
            />
            <button disabled={values == ""} onClick={() => onSubmit()} className="disabled:bg-gray-200 w-24 h-10 bg-gray-800 text-white hover:bg-gray-700 transition duration-200">
              Submeter
            </button>
            <button className="w-24 h-10 bg-gray-600 text-white hover:bg-gray-500 transition duration-200">
              Ver Rank
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TrapAmericano;
