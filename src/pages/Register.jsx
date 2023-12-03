import { Dialog, Transition } from "@headlessui/react";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { Fragment, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../firebaseConfig";
import Autocomplete from "../components/Autocomplete/Autocomplete";
import Carabina22MiraAberta from "../components/Carabina22MiraAberta/Carabina22MiraAberta";
import FogoCentral from "../components/FogoCentral/FogoCentral";
import Layout from "../components/Layout";
import PercursoCaca from "../components/PercursoCaca/PercursoCaca";
import SM22Apoiado from "../components/SM22Apoiado/SM22Apoiado";
import SM22Precisao from "../components/SM22Precisao/SM22Precisao";
import SaquePreciso from "../components/SaquePreciso/SaquePreciso";
import SmallPistol from "../components/SmallPistol/SmallPistol";
import TrapAmericano from "../components/TrapAmericano/TrapAmericano";
import { exams } from "../utils";

const Register = () => {
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);
  const [result, setResult] = React.useState();
  const [showToast, setShowToast] = React.useState(false);

  const cancelButtonRef = React.useRef(null);
  const [event, setEvent] = React.useState();
  const [users, setUsers] = React.useState([]);

  const [selectedUser, setSelectedUser] = React.useState("");
  const [selectedExam, setSelectedExam] = React.useState("");
  const [step, setStep] = React.useState(0);
  const { id } = useParams();

  const fetchEvent = useCallback(async () => {
    if (!id) return;

    const docSnapshot = await getDoc(doc(db, "events", id));
    const eventData = { ...docSnapshot.data(), id: docSnapshot.id };

    setEvent(eventData);
  }, [id]);

  const fetchUsers = useCallback(async () => {
    const usersSnapshot = await getDocs(collection(db, "users"));
    const usersData = [];

    usersSnapshot.forEach((doc) => {
      usersData.push({ id: doc.id, ...doc.data() });
    });

    setUsers(usersData);
  }, [id]);

  useEffect(() => {
    fetchEvent();
    fetchUsers();
  }, []);

  const getExamSelected = () => {
    const id = exams.find((e) => e.tipo_prova == selectedExam).id;
    switch (id) {
      case "KkAF46R6WrwZWq1FNhvX":
        return 0;
      case "YchOCURkmZCTsymgHwG0":
        return 1;
      case "cpxPRShLAuDSmBwFKHXw":
        return 2;
      case "hej6E1jjnq81xZMGiqEi":
        return 3;
      case "EfvFedkhOSML884He43N":
        return 4;
      case "PCb1rh0OrOzxAmCTghGB":
        return 5;
      case "q00RXisO4sQqOZ8JfqvW":
        return 6;
      case "qnpGZ7u0IW01TZQ4olPn":
        return 7;
    }
  };

  const saveResult = async () => {
    const data = {
      eventId: id,
      name: result.name.trim(),
      examId: result.examId,
      results: {
        points: result.points,
        pointsCounter: result.pointsCounter,
        total: result.total,
        ...(result.level && { level: result.level }),
        ...(result.gun && { gun: result.gun }),
      },
      userId: result.userId,
    };
    try {
      const docRef = await addDoc(collection(db, "exam-results"), data);

      if (docRef) {
        if (result.gun) {
          const querySnapshot = await getDocs(
            query(
              collection(db, "levels"),
              where("examId", "==", result.examId),
              where("name", "==", result.name),
              where("gun", "==", result.gun)
            )
          );
          const level = [];
          querySnapshot.forEach((e) => {
            level.push({ ...e.data(), id: e.id });
          });

          if (level.length > 0) {
            const levelsCollection = collection(db, "levels");
            let aux = addOrUpdateExam(level[0], data, event.date);

            const q = await doc(levelsCollection, aux.id);
            const querySnapshot = await getDoc(q);

            await updateDoc(querySnapshot.ref, aux);
          } else {
            let newLevel = createLevel(data);
            await addDoc(collection(db, "levels"), newLevel);
          }
        } else {
          const querySnapshot = await getDocs(
            query(
              collection(db, "levels"),
              where("examId", "==", result.examId),
              where("name", "==", result.name)
            )
          );
          const level = [];
          querySnapshot.forEach((e) => {
            level.push({ ...e.data(), id: e.id });
          });

          if (level.length > 0) {
            let aux = addOrUpdateExam(level[0], data, event.date);
            const levelsCollection = collection(db, "levels");
            const q = await doc(levelsCollection, aux.id);
            const querySnapshot = await getDoc(q);

            await updateDoc(querySnapshot.ref, aux);
          } else {
            let newLevel = createLevel(data);
            await addDoc(collection(db, "levels"), newLevel);
          }
        }

        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
          navigate("/events");
        }, 5000);
      }
    } catch (error) {
      console.log(error);
    }
    setOpen(false);
  };
  const addOrUpdateExam = (obj, newExam, date) => {
    const { exams } = obj;

    const existingExam = exams.find((exam) => exam.date === date);
    if (existingExam) {
      if (newExam.results.total > existingExam.pontuation) {
        existingExam.pontuation = newExam.results.total;
      }
    } else {
      exams.push({ date: date, pontuation: newExam.results.total });
    }
    if (obj.results?.level) {
      obj.level = newExam.results.level;
    }
    obj.pontuation = obj.exams.reduce((acc, exam) => acc + exam.pontuation, 0);

    return obj;
  };

  const createLevel = (obj) => {
    let temp = {};

    temp.pontuation = obj.results.total;
    temp.exams = [
      { date: "2023-04-02", pontuation: 0 },
      { date: "2023-05-07", pontuation: 0 },
      { date: "2023-06-03", pontuation: 0 },
      { date: "2023-06-03", pontuation: 0 },
      { date: event.date, pontuation: obj.results.total },
    ];
    temp.firstRankingDate = event.date;
    if (obj.results?.level) {
      temp.level = obj.results.level;
    }
    temp.name = obj.name;
    temp.examId = obj.examId;
    if (obj.results.gun) {
      temp.gun = obj.results.gun;
    }
    return temp;
  };
  return (
    <Layout>
      <h1 className="text-gray-700 py-4 font-bold text-xl">
        Cadastro de resultado
      </h1>
      <h2 className="text-gray-700  font-semibold text-lg">
        Selecione o atirador
      </h2>
      <div className="flex items-center my-4">
        <Autocomplete
          disabled={step > 0}
          onChange={(e) => setSelectedUser(e)}
          value={selectedUser}
          people={users}
        />
      </div>
      {step == 0 ? (
        <>
          <h2 className="text-gray-700  font-semibold text-lg">
            Selecione a prova
          </h2>
          <div className="flex justify-center">
            <div className="py-4 w-3/4 grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6">
              {exams.map((e) => (
                <div
                  key={e.tipo_prova}
                  onClick={() => {
                    setSelectedExam(e.tipo_prova);
                  }}
                  className={
                    "flex flex-col w-48 h-48 items-center py-4 px-7 cursor-pointer rounded-lg  " +
                    (selectedExam === e.tipo_prova
                      ? "bg-green-800 text-white"
                      : "bg-transparent bg-green-600")
                  }
                >
                  <div className="p-4 rounded-md">
                    {typeof e.icon != "string" ? (
                      <div className="flex flex-row items-center">
                        <img
                          src={
                            selectedExam === e.tipo_prova
                              ? e.iconActive[0]
                              : e.icon[0]
                          }
                          alt="pistol"
                          height={60}
                          width={60}
                        />
                        <img
                          src={
                            selectedExam === e.tipo_prova
                              ? e.iconActive[1]
                              : e.icon[1]
                          }
                          alt="revolver"
                          height={60}
                          width={60}
                        />
                      </div>
                    ) : (
                      <img
                        src={
                          selectedExam === e.tipo_prova ? e.iconActive : e.icon
                        }
                        alt="pistol"
                        height={60}
                        width={60}
                      />
                    )}
                  </div>
                  <span className="text-lg font-medium text-center">
                    {e.tipo_prova}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <h2 className="text-gray-700 font-semibold text-md mb-2">
            {selectedExam}
          </h2>
          {getExamSelected() === 0 && (
            <SaquePreciso
              examId={exams.find((e) => e.tipo_prova == selectedExam).id}
              shooter={users.find((e) => e.id === selectedUser).nome}
              dateEvent={event.date}
              onSubmitExam={(e) => {
                setResult({ ...e, userId: selectedUser });
                setOpen(true);
              }}
            />
          )}
          {getExamSelected() === 1 && (
            <FogoCentral
              examId={exams.find((e) => e.tipo_prova == selectedExam).id}
              shooter={users.find((e) => e.id === selectedUser).nome}
              dateEvent={event.date}
              onSubmitExam={(e) => {
                setResult({ ...e, userId: selectedUser });
                setOpen(true);
              }}
            />
          )}
          {getExamSelected() === 2 && (
            <SmallPistol
              examId={exams.find((e) => e.tipo_prova == selectedExam).id}
              shooter={users.find((e) => e.id === selectedUser).nome}
              dateEvent={event.date}
              onSubmitExam={(e) => {
                setResult({ ...e, userId: selectedUser });
                setOpen(true);
              }}
            />
          )}
          {getExamSelected() === 3 && (
            <TrapAmericano
              examId={exams.find((e) => e.tipo_prova == selectedExam).id}
              shooter={users.find((e) => e.id === selectedUser).nome}
              dateEvent={event.date}
              onSubmitExam={(e) => {
                setResult({ ...e, userId: selectedUser });
                setOpen(true);
              }}
            />
          )}
          {getExamSelected() === 4 && (
            <Carabina22MiraAberta
              examId={exams.find((e) => e.tipo_prova == selectedExam).id}
              shooter={users.find((e) => e.id === selectedUser).nome}
              dateEvent={event.date}
              onSubmitExam={(e) => {
                setResult({ ...e, userId: selectedUser });
                setOpen(true);
              }}
            />
          )}
          {getExamSelected() === 5 && (
            <SM22Precisao
              examId={exams.find((e) => e.tipo_prova == selectedExam).id}
              shooter={users.find((e) => e.id === selectedUser).nome}
              dateEvent={event.date}
              onSubmitExam={(e) => {
                setResult({ ...e, userId: selectedUser });
                setOpen(true);
              }}
            />
          )}
          {getExamSelected() === 6 && (
            <SM22Apoiado
              examId={exams.find((e) => e.tipo_prova == selectedExam).id}
              shooter={users.find((e) => e.id === selectedUser).nome}
              dateEvent={event.date}
              onSubmitExam={(e) => {
                setResult({ ...e, userId: selectedUser });
                setOpen(true);
              }}
            />
          )}
          {getExamSelected() === 7 && (
            <PercursoCaca
              examId={exams.find((e) => e.tipo_prova == selectedExam).id}
              shooter={users.find((e) => e.id === selectedUser).nome}
              dateEvent={event.date}
              onSubmitExam={(e) => {
                setResult({ ...e, userId: selectedUser });
                setOpen(true);
              }}
            />
          )}
        </>
      )}

      <div className="text-right">
        {step === 0 ? (
          <button
            disabled={selectedExam == "" || selectedUser == ""}
            onClick={() => setStep((value) => value + 1)}
            className="bg-green-800 text-white px-4 py-2 rounded-lg disabled:bg-green-200 disabled:text-gray-300 "
          >
            Avançar
          </button>
        ) : (
          <button
            onClick={() => setStep(0)}
            className="bg-green-800 px-4 py-2 rounded-lg text-white"
          >
            Voltar
          </button>
        )}
      </div>

      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={setOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                        {/* <ExclamationTriangleIcon
                          className="h-6 w-6 text-green-600"
                          aria-hidden="true"
                        /> */}
                      </div>
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-base font-semibold leading-6 text-gray-900"
                        >
                          Salvar Resultado
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            Você tem certeza de que deseja salvar o resultado?
                            Uma vez salvo, não será possível corrigi-lo. Por
                            favor, verifique o resultado antes de prosseguir.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto"
                      onClick={() => saveResult()}
                    >
                      Confirmar
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => setOpen(false)}
                      ref={cancelButtonRef}
                    >
                      Cancelar
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {showToast && (
        <div
          id="toast-success"
          className="flex items-center w-full float-right absolute top-6 right-4 animate-pulse max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
          role="alert"
        >
          <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
            </svg>
            <span className="sr-only">Check icon</span>
          </div>
          <div className="ml-3 text-sm font-normal">
            Registro salvo com sucesso!.
          </div>
          <button
            type="button"
            className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
            data-dismiss-target="#toast-success"
            aria-label="Close"
          >
            <span className="sr-only">Close</span>
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
          </button>
        </div>
      )}
    </Layout>
  );
};
export default Register;
