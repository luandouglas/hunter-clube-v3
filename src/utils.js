import carbine_dark from './assets/carbine_dark.png';
import carbine from './assets/carbine.png';
import pistol_dark from './assets/pistol_dark.png';
import pistol from './assets/pistol.png';
import revolver_dark from './assets/revolver_dark.png';
import revolver from './assets/revolver.png';
import shotgun_dark from './assets/shotgun_dark.png';
import shotgun from './assets/shotgun.png';

const exams = [
  {
    tipo_prova: "Apuração - Carabina Precisão 22 a 25 Metros",
    id: "EfvFedkhOSML884He43N",
    iconActive: carbine_dark,
    icon: carbine,
    levels: [
      {
        value: "beginner",
        label: "Iniciante",
      },
      {
        label: "Master",
        value: "master",
      },
    ],
  },
  {
    tipo_prova: "Trap 10",
    id: "3ZHw4gpIuBq477OGGrur",
    iconActive: shotgun_dark,
    icon: shotgun,
    levels: [
      {
        value: "beginner",
        label: "Iniciante",
      },
      {
        label: "Master",
        value: "master",
      },
    ],
  },
  {
    guns: [
      {
        value: "pistol",
        label: "Pistola",
      },
      {
        value: "revolver",
        label: "Revolver",
      },
    ],
    levels: [
      {
        value: "beginner",
        label: "Iniciante",
      },
      {
        label: "Master",
        value: "master",
      },
    ],
    iconActive: [pistol_dark, revolver_dark],
    icon: [pistol, revolver],
    tipo_prova: "Apuração de Saque Preciso",
    id: "KkAF46R6WrwZWq1FNhvX",
  },
  {
    levels: [
      {
        value: "beginner",
        label: "Iniciante",
      },
      {
        value: "master",
        label: "Master",
      },
      {
        label: "Super master",
        value: "super-master",
      },
    ],
    iconActive: carbine_dark,
    icon: carbine,
    tipo_prova: "Silhueta Metálica 22 e Precisão",
    id: "PCb1rh0OrOzxAmCTghGB",
  },
  {
    guns: [
      {
        label: "Pistola",
        value: "pistol",
      },
      {
        value: "revolver",
        label: "Revolver",
      },
    ],
    tipo_prova: "Súmula de Apuração de Fogo Central",
    levels: [
      {
        value: "beginner",
        label: "Iniciante",
      },
      {
        label: "Master",
        value: "master",
      },
    ],
    iconActive: [pistol_dark, revolver_dark],
    icon: [pistol, revolver],
    id: "YchOCURkmZCTsymgHwG0",
  },
  {
    tipo_prova: "Apuração de Prova Extra - Small Pistol",
    levels: [
      {
        value: "beginner",
        label: "Iniciante",
      },
      {
        label: "Master",
        value: "master",
      },
    ],
    iconActive: pistol_dark,
    icon: pistol,
    id: "cpxPRShLAuDSmBwFKHXw",
  },
  {
    tipo_prova: "Trap Americano",
    iconActive: shotgun_dark,
    icon: shotgun,
    id: "hej6E1jjnq81xZMGiqEi",
  },
  {
    levels: [
      {
        label: "Master",
        value: "master",
      },
      {
        label: "Super Master",
        value: "super-master",
      },
    ],
    iconActive: carbine_dark,
    icon: carbine,
    tipo_prova: "Silhueta Metálica 22 Apoiado",
    id: "q00RXisO4sQqOZ8JfqvW",
  },
  {
    iconActive: shotgun_dark,
    icon: shotgun,
    tipo_prova: "Percurso de Caça",
    id: "qnpGZ7u0IW01TZQ4olPn",
  },
  {

    iconActive: shotgun_dark,
    icon: shotgun,
    tipo_prova: "Percurso de Caça 20",
    id: "hzTpNUmS4eKFuDHzWQcs",

  }
];

export { exams }