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
    tipo_prova: "Carabina Precisão 22 a 25 Metros",
    id: "EfvFedkhOSML884He43N",
    iconActive: carbine_dark,
    icon: carbine,
    levels: [
      {
        value: "beginner",
        label: "Iniciante",
        points: 0
      },
      {
        label: "Master",
        value: "master",
        points: 141
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
        points: 0
      },
      {
        label: "Master",
        value: "master",
        points: 9
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
        points: 0
      },
      {
        label: "Master",
        value: "master",
        points: 105
      },
    ],
    iconActive: [pistol_dark, revolver_dark],
    icon: [pistol, revolver],
    tipo_prova: "Saque Preciso",
    id: "KkAF46R6WrwZWq1FNhvX",
  },
  {
    levels: [
      {
        value: "beginner",
        label: "Iniciante",
        points: 0
      },
      {
        value: "master",
        label: "Master",
        points: 251
      },
      {
        label: "Super master",
        value: "super-master",
        points: 281
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
    tipo_prova: "Fogo Central",
    levels: [
      {
        value: "beginner",
        label: "Iniciante",
        points: 0
      },
      {
        label: "Master",
        value: "master",
        points: 106
      },
    ],
    iconActive: [pistol_dark, revolver_dark],
    icon: [pistol, revolver],
    id: "YchOCURkmZCTsymgHwG0",
  },
  {
    tipo_prova: "Small Pistol",
    levels: [
      {
        value: "beginner",
        label: "Iniciante",
        points: 0
      },
      {
        label: "Master",
        value: "master",
        points: 86
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
        label: "Iniciante",
        value: "beginner",
        points: 0
      },
      {
        label: "Master",
        value: "master",
        points: 28
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