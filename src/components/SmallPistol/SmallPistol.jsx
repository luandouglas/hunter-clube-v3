"use client";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useCallback, useEffect } from "react";
import { db } from "../../../firebaseConfig";

const SmallPistol = ({ onSubmitExam, shooter, dateEvent, examId }) => {
  const [values, setValues] = React.useState({
    first: [0, 0, 0, 0, 0],
    second: [0, 0, 0, 0, 0],
    third: [0, 0, 0, 0, 0],
    fourth: [0, 0, 0, 0, 0],
  });

  const [level, setLevel] = React.useState();
  const fetchLevel = useCallback(async () => {
    if (!shooter || !examId) {
      return;
    }
    const querySnapshot = await getDocs(
      query(
        collection(db, "levels"),
        where("name", "==", shooter),
        where("examId", "==", examId)
      )
    );
    const data = [];
    querySnapshot.docs.forEach((el) => data.push(el.data()));
    if (data.length > 0) {
      setLevel(data[0]);
    }
  }, []);

  useEffect(() => {
    fetchLevel();
    // fetchLevel();
  }, [shooter, fetchLevel]);

  const sumRow = (ind) => {
    const row = values[ind];
    const filteredRow = row.filter((num) => num !== null && num !== undefined);
    const sum = filteredRow.reduce((acc, num) => acc + num, 0);

    return sum;
  };

  const countPoints = (points) => {
    let result = {};
    Object.values(points).forEach(function (array) {
      array.forEach(function (numero) {
        result[numero] = (result[numero] || 0) + 1;
      });
    });

    for (var i = 0; i <= 12; i++) {
      result[i] = result[i] || 0;
    }
    return result;
  };

  const sumValues = () => {
    let sum = 0;
    for (let i = 0; i < values.first.length; i++) {
      sum +=
        (values.first[i] || 0) +
        (values.second[i] || 0) +
        (values.third[i] || 0) +
        (values.fourth[i] || 0);
    }
    return sum;
  };

  const handleValueChange = (individual, index, newValue, maxValue) => {
    const value = Number(newValue);
    if (!(!isNaN(value) && value >= 0 && value <= maxValue)) return;

    setValues((prevValues) => {
      const updatedValues = { ...prevValues };
      updatedValues[individual] = [
        ...prevValues[individual].slice(0, index),
        value,
        ...prevValues[individual].slice(index + 1),
      ];
      return updatedValues;
    });
  };
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
      if (object.pontuation <= 180) {
        return "beginner";
      } else {
        return "master";
      }
    } else {
      if (sumValues() <= 180) {
        return "beginner";
      } else {
        return "master";
      }
    }
  };

  const onSubmit = () => {
    onSubmitExam({
      points: values,
      pointsCounter: countPoints(values),
      total: sumValues(),
      level: adjustLevel(level, dateEvent),
      examId,
      name: shooter,
    });
  };

  const getAttr = (key) => {
    switch (key) {
      case 1:
        return "first";
      case 2:
        return "second";
      case 3:
        return "third";
      case 4:
        return "fourth";
    }
  };

  return (
    <>
      <div className="flex flex-row items-center">
        <div>
          {[1, 2, 3, 4].map((e) => (
            <div key={e}>
              <div className="flex flex-row items-center">
                <span className="w-24">{e}ª Serie</span>
                {[1, 2, 3, 4, 5].map((j) => (
                  <input
                    key={j}
                    className="border w-20 focus:outline-none focus:border-gray-700 focus:shadow-none"
                    type="number"
                    value={values[getAttr(e)][j - 1] || ""}
                    onChange={(event) =>
                      handleValueChange(
                        getAttr(e),
                        j - 1,
                        event.target.value,
                        e > 2 ? 12 : 10
                      )
                    }
                  />
                ))}
                <input
                  disabled
                  value={sumRow(getAttr(e))}
                  className="border w-20 focus:outline-none focus:border-gray-700 focus:shadow-none"
                  type="number"
                />
              </div>
            </div>
          ))}
          <input
            disabled
            value={sumValues()}
            className="float-right border w-20 focus:outline-none focus:border-gray-700 focus:shadow-none"
            type="number"
          />
        </div>
      </div>
      <div className="text-right mb-4">
        <button
          onClick={() => onSubmit()}
          className="bg-blue-gray-500 px-4 py-2 rounded-lg text-white disabled:bg-blue-gray-200 disabled:text-gray-600"
        >
          Salvar resultado
        </button>
      </div>
    </>
  );
};

export default SmallPistol;
