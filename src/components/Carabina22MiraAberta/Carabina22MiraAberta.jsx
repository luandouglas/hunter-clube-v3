import React from "react";

const Carabina22MiraAberta = ({ onSubmitExam, shooter, dateEvent, examId }) => {
  const [values, setValues] = React.useState({
    first: [0, 0, 0, 0, 0],
    second: [0, 0, 0, 0, 0],
  });

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
      sum += (values.first[i] || 0) + (values.second[i] || 0);
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
    }
  };

  return (
    <>
      <div className="flex flex-row items-center">
        <div>
          {[1, 2].map((e) => (
            <div key={e}>
              <div className="flex flex-row items-center">
                <span className="w-24">{e}ª Serie</span>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((j) => (
                  <input
                    key={j}
                    className="border w-14 focus:outline-none focus:border-gray-700 focus:shadow-none"
                    type="number"
                    value={values[getAttr(e)][j - 1] || ""}
                    onChange={(event) =>
                      handleValueChange(
                        getAttr(e),
                        j - 1,
                        event.target.value,
                        12
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

export default Carabina22MiraAberta;
