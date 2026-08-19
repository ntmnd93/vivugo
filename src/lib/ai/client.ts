import { google } from "@ai-sdk/google";

// Free-tier friendly default; override via env if the model id changes on Google's side.
export const itineraryModel = google(process.env.GOOGLE_GENERATIVE_AI_MODEL ?? "gemini-3.6-flash");
