"use client";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useCallback, useEffect } from "react";
import { db } from "../../../firebaseConfig";

const SM22Apoiado = ({ onSubmitExam, shooter, dateEvent, examId }) => {
  const [values, setValues] =
    React.useState <
    any >
    {
      first: [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ],
      second: [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ],
      third: [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ],
      fourth: [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ],
      fifth: [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ],
    };

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
    return sum + sumRow("fifth") / 10;
  };

  const handleCheckedChange = (individual, index, newValue) => {
    setValues((prevValues) => {
      const updatedValues = { ...prevValues };
      updatedValues[individual] = [
        ...prevValues[individual].slice(0, index),
        newValue,
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
      if (object.pontuation <= 37) {
        return "beginner";
      } else {
        return "master";
      }
    } else {
      if (sumValues() <= 37) {
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

  React.useEffect(() => {
    if (sumValues() < 40) {
      setValues((prevValues) => ({
        ...prevValues,
        fifth: new Array(10).fill(false),
      }));
    }
  }, [sumValues()]);

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
      case 5:
        return "fifth";
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
                <div>
                  {e === 1 && (
                    <div className="w-16 h-[42px] px-2 flex justify-center items-center border border-gray-400">
                      Galinha
                    </div>
                  )}
                  {e === 2 && (
                    <div className="w-16 h-[42px] px-2 flex justify-center items-center border border-gray-400">
                      Porco
                    </div>
                  )}
                  {e === 3 && (
                    <div className="w-16 h-[42px] px-2 flex justify-center items-center border border-gray-400">
                      Peru
                    </div>
                  )}
                  {e === 4 && (
                    <div className="w-16 h-[42px] px-2 flex justify-center items-center border border-gray-400">
                      Bode
                    </div>
                  )}
                </div>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((j) => (
                  <div
                    className="border border-gray-400 w-14 h-[42px] flex justify-center items-center"
                    key={j}
                  >
                    <input
                      className="focus:outline-none focus:border-gray-600 focus:shadow-none "
                      type="checkbox"
                      value={values[getAttr(e)][j - 1] || ""}
                      onChange={(event) =>
                        handleCheckedChange(
                          getAttr(e),
                          j - 1,
                          event.target.checked
                        )
                      }
                    />
                  </div>
                ))}
                <input
                  disabled
                  value={sumRow(getAttr(e))}
                  className="border w-20 focus:outline-none border-gray-400 focus:border-gray-700 focus:shadow-none"
                  type="number"
                />
              </div>
            </div>
          ))}
          {sumValues() >= 40 ? (
            <div className="flex flex-row items-center">
              <span className="w-24">5ª Serie</span>
              <div className="w-16 h-[42px] px-2 flex justify-center items-center border border-gray-400">
                Bode
              </div>

              <div className="flex flex-row items-center">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((j) => (
                  <div
                    className="border border-gray-400 w-14 h-[42px] flex justify-center items-center"
                    key={j}
                  >
                    <input
                      className="focus:outline-none focus:border-gray-600 focus:shadow-none "
                      type="checkbox"
                      value={values[getAttr(5)][j - 1] || ""}
                      onChange={(event) =>
                        handleCheckedChange(
                          getAttr(5),
                          j - 1,
                          event.target.checked
                        )
                      }
                    />
                  </div>
                ))}
                <input
                  disabled
                  value={sumRow(getAttr(5)) / 10}
                  className="border w-20 focus:outline-none border-gray-400 focus:border-gray-700 focus:shadow-none"
                  type="number"
                />
              </div>
            </div>
          ) : null}
          <input
            disabled
            value={sumValues()}
            className="float-right border w-20 focus:outline-none border-gray-400 focus:border-gray-700 focus:shadow-none"
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

export default SM22Apoiado;
