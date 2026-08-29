export type FlowerSpecies = "rose" | "tulip" | "daisy" | "sunflower" | "lotus" | "poppy";

export interface FlowerProject {
  id: string;
  name: string;
  category: string;
  organisation: string;
  description: string;
  metric?: string;
  species: FlowerSpecies;
  petalFrom: string;
  petalTo: string;
  centerColor: string;
}

export interface ExperienceItem {
  role: string;
  organisation: string;
  location: string;
  period: string;
  bullets: string[];
}

export interface EducationItem {
  qualification: string;
  institution: string;
  year: string;
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export interface Profile {
  name: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  linkedin: string;
  summary: string;
}
