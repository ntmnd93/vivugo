import { createGoogle } from "@ai-sdk/google";

// GOOGLE_GENERATIVE_AI_BASE_URL points at our own Vercel-hosted relay
// (see src/app/api/gemini-relay) when set. Needed because Google's free
// Generative Language API rejects requests from some server locations
// ("User location is not supported for the API use") — routing through
// Vercel's supported regions works around that without paying for a
// different provider. Leave unset for local dev / regions Google allows.
const google = createGoogle({
  baseURL: process.env.GOOGLE_GENERATIVE_AI_BASE_URL,
});

// Free-tier friendly default; override via env if the model id changes on Google's side.
export const itineraryModel = google(process.env.GOOGLE_GENERATIVE_AI_MODEL ?? "gemini-3.6-flash");
