
import { quizQuestions } from "@/utils/quiz";

export const getQuizQuestions = (locationMode: boolean) => {
  // Filter out the locationMethod question since we already asked this in LocationSelectionScreen
  const filteredQuestions = quizQuestions.filter(q => q.id !== "locationMethod");
  
  if (locationMode) {
    // If using location, replace the "neighborhood" question with "distance"
    const neighborhoodIndex = filteredQuestions.findIndex(q => q.id === "neighborhood");
    if (neighborhoodIndex !== -1) {
      filteredQuestions[neighborhoodIndex] = {
        id: "distance",
        questionText: "How far would you like to travel?",
        question: "How far would you like to travel?",
        description: "We'll find restaurants within this distance from your location",
        type: "singleChoice",
        options: [
          { id: "1-mile", text: "1 mile", value: "1" },
          { id: "3-miles", text: "3 miles", value: "3" },
          { id: "5-miles", text: "5 miles", value: "5" },
          { id: "10-miles", text: "10 miles", value: "10" }
        ],
      };
    }
  }
  
  return filteredQuestions;
};

export const processAnswersForAPI = (answers: Record<string, any>) => {
  // Get neighborhoods as string array for the API
  const neighborhoods = answers.neighborhood && Array.isArray(answers.neighborhood) 
    ? answers.neighborhood 
    : (answers.neighborhood ? [answers.neighborhood as string] : []);
  
  // Get preferences as string array for the API
  const preferences = answers.preferences && Array.isArray(answers.preferences)
    ? answers.preferences
    : (answers.preferences ? [answers.preferences as string] : []);
  
  // Get price as string array for the API - handle both multi-select and single-select cases
  const prices = answers.price 
    ? (Array.isArray(answers.price) ? answers.price : [answers.price as string])
    : [];
    
  // Get cuisine as string array for the API
  const cuisines = answers.cuisine && Array.isArray(answers.cuisine)
    ? answers.cuisine
    : (answers.cuisine ? [answers.cuisine as string] : []);
  
  // Get distance value for location-based search
  const distance = typeof answers.distance === 'number' ? answers.distance : undefined;

  return {
    neighborhoods: neighborhoods.length > 0 ? neighborhoods : undefined,
    cuisine: cuisines.length > 0 ? cuisines : undefined,
    price: prices.length > 0 ? prices : undefined,
    atmosphere: answers.atmosphere as string,
    preferences: preferences.length > 0 ? preferences : undefined,
    distance: distance,
  };
};
