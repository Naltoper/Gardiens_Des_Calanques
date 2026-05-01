// constants/emergencyNumbers.ts

export interface EmergencyNumber {
  id: string;
  title: string;
  number: string;
  description: string;
  colors: [string, string];
}

export const EMERGENCY_NUMBERS: EmergencyNumber[] = [
  {
    id: '3020',
    title: "Non au Harcèlement",
    number: "3020",
    description: "Écoute, conseil et orientation pour les victimes et témoins.",
    colors: ["#48a4f4", "#00b4d8"],
  },
  {
    id: '3018',
    title: "Cyber-Harcèlement",
    number: "3018",
    description: "Le numéro court national pour les violences numériques.",
    colors: ["#76c893", "#10ac56"],
  },
  {
    id: '119',
    title: "Enfance en Danger",
    number: "119",
    description: "Numéro national dédié à la prévention et à la protection.",
    colors: ["#023e8a", "#48cae4"],
  }
];