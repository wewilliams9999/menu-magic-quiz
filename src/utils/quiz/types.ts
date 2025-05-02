
import React from "react";

export interface QuizOption {
  id: string;
  text: string;
  value: string;
  icon?: React.ElementType;
  image?: string;
}

export interface QuizQuestion {
  id: string;
  questionText: string;
  question: string;
  description?: string;
  type: "singleChoice" | "multipleChoice";
  options: QuizOption[];
  multiSelect?: boolean;
}

export interface QuizResult {
  id: string;
  name: string;
  cuisine: string;
  neighborhood: string;
  priceRange: string;
  description: string;
  address?: string;
  imageUrl?: string;
  logoUrl?: string;
  features?: string[];
  website?: string;
  resyLink?: string | null;
  openTableLink?: string | null;
  instagramLink?: string | null;
  phone?: string | null;
  isAlternative?: boolean;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  distanceFromUser?: number;
}
