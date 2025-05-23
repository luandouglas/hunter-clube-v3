import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useCallback, useEffect } from "react";
import { db } from "../../../firebaseConfig";

const PercursoCaca20 = ({ onSubmitExam, shooter, dateEvent, examId, data }) => {
  const [values, setValues] = React.useState({
    first: [false, false, false, false, false],
    second: [false, false, false, false, false],
    third: [false, false, false, false, false],
    fourth: [false, false, false, false, false],
  });

  const [classification, setClassification] = React.useState("")

  const [level, setLevel] = React.useState();

  useEffect(() => {
    if (data) {
      setValues(data.results.points);
    }
  }, [data]);

  const fetchLevel = useCallback(async () => {
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
      setLevel(data[0]);
      setClassification(data[0].level)
      console.log('THE SHOOTER IS', data[0].level)
    }
  }, [shooter]);

  useEffect(() => {
    fetchLevel();
    // fetchLevel();
  }, [shooter, fetchLevel]);

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

  const onSubmit = () => {
    onSubmitExam({
      points: values,
      pointsCounter: countPoints(values),
      total: sumValues(),
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
        <div className="flex flex-row space-x-3 text-center">
          {[1, 2, 3, 4].map((e) => (
            <div key={e}>
              <span className="w-24">{e}ª Serie</span>
              <div className="flex flex-row items-center">
                <div className="flex flex-col">
                  <div className="border border-gray-400 w-auto h-[42px] flex justify-center items-center">
                    <input
                      className="focus:outline-none focus:border-gray-600 focus:shadow-none "
                      type="checkbox"
                      value={values[getAttr(e)][0] || ""}
                      checked={values[getAttr(e)][0] || ""}
                      onChange={(event) =>
                        handleCheckedChange(getAttr(e), 0, event.target.checked)
                      }
                    />
                  </div>
                  <div className="flex flex-row">
                    <div className="border border-gray-400 w-14 h-[42px] flex justify-center items-center">
                      <input
                        className="focus:outline-none focus:border-gray-600 focus:shadow-none "
                        type="checkbox"
                        value={values[getAttr(e)][1] || ""}
                        checked={values[getAttr(e)][1] || ""}
                        onChange={(event) =>
                          handleCheckedChange(
                            getAttr(e),
                            1,
                            event.target.checked
                          )
                        }
                      />
                    </div>
                    <div className="border border-gray-400 w-14 h-[42px] flex justify-center items-center">
                      <input
                        className="focus:outline-none focus:border-gray-600 focus:shadow-none "
                        type="checkbox"
                        value={values[getAttr(e)][2] || ""}
                        checked={values[getAttr(e)][2] || ""}
                        onChange={(event) =>
                          handleCheckedChange(
                            getAttr(e),
                            2,
                            event.target.checked
                          )
                        }
                      />
                    </div>
                  </div>
                  <div className="flex flex-row">
                    <div className="border border-gray-400 w-14 h-[42px] flex justify-center items-center">
                      <input
                        className="focus:outline-none focus:border-gray-600 focus:shadow-none "
                        type="checkbox"
                        value={values[getAttr(e)][3] || ""}
                        checked={values[getAttr(e)][3] || ""}
                        onChange={(event) =>
                          handleCheckedChange(
                            getAttr(e),
                            3,
                            event.target.checked
                          )
                        }
                      />
                    </div>
                    <div className="border border-gray-400 w-14 h-[42px] flex justify-center items-center">
                      <input
                        className="focus:outline-none focus:border-gray-600 focus:shadow-none "
                        type="checkbox"
                        value={values[getAttr(e)][4] || ""}
                        checked={values[getAttr(e)][4] || ""}
                        onChange={(event) =>
                          handleCheckedChange(
                            getAttr(e),
                            4,
                            event.target.checked
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <input
            disabled
            value={sumValues()}
            className="self-end border h-min w-20 focus:outline-none border-gray-400 focus:border-gray-700 focus:shadow-none"
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

export default PercursoCaca20;
