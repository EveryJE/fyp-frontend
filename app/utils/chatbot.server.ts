import fs from "node:fs/promises";
import path from "node:path";
import Papa from "papaparse";

// Define data structures
interface Event {
  event_name: string;
  date: string;
  time: string;
  location: string;
}

interface TimetableEntry {
  course_name: string;
  day: string;
  start_time: string;
  end_time: string;
  professor: string;
}

// In-memory cache for the data
let events: Event[] = [];
let timetable: TimetableEntry[] = [];

// Function to load data from CSVs
async function loadData() {
  // Only load if the cache is empty
  if (events.length > 0 && timetable.length > 0) {
    return;
  }

  try {
    const eventsPath = path.join(process.cwd(), "data", "events.csv");
    const timetablePath = path.join(process.cwd(), "data", "timetable.csv");

    const [eventsCsv, timetableCsv] = await Promise.all([
      fs.readFile(eventsPath, "utf8"),
      fs.readFile(timetablePath, "utf8"),
    ]);

    events = Papa.parse<Event>(eventsCsv, { header: true, skipEmptyLines: true }).data;
    timetable = Papa.parse<TimetableEntry>(timetableCsv, { header: true, skipEmptyLines: true }).data;
    
    console.log("Chatbot data loaded successfully.");
  } catch (error) {
    console.error("Failed to load chatbot data:", error);
  }
}

// Simple NLP to determine user intent
function getIntent(query: string): { intent: string; params: { course?: string } } {
  const lowerQuery = query.toLowerCase().trim();

  if (lowerQuery.includes("events")) {
    return { intent: "get_events", params: {} };
  }
  if (lowerQuery.includes("timetable") || lowerQuery.includes("schedule")) {
    return { intent: "get_timetable", params: {} };
  }
  if (lowerQuery.startsWith("who teaches")) {
    const course = lowerQuery.replace("who teaches", "").trim().replace("?", "");
    return { intent: "get_professor", params: { course } };
  }
  if (lowerQuery.startsWith("when is")) {
    const course = lowerQuery.replace("when is", "").trim().replace("?", "");
    return { intent: "get_course_time", params: { course } };
  }

  return { intent: "unknown", params: {} };
}

// Main function to get a response
export async function getChatbotResponse(message: string): Promise<string> {
  await loadData(); // Ensure data is loaded

  const { intent, params } = getIntent(message);

  switch (intent) {
    case "get_events":
      if (!events || events.length === 0) return "I couldn't find any event data.";
      let eventResponse = "Here are the upcoming events:\n";
      events.forEach(event => {
        eventResponse += `- ${event.event_name} on ${event.date} at ${event.time} in ${event.location}\n`;
      });
      return eventResponse;

    case "get_timetable":
      if (!timetable || timetable.length === 0) return "I couldn't find any timetable data.";
      let timetableResponse = "Here is the timetable:\n";
      timetable.forEach(entry => {
        timetableResponse += `- ${entry.course_name} on ${entry.day} from ${entry.start_time} to ${entry.end_time}\n`;
      });
      return timetableResponse;

    case "get_professor":
      const profEntry = timetable.find(e => e.course_name.toLowerCase().includes(params.course ?? ""));
      return profEntry
        ? `${profEntry.course_name} is taught by ${profEntry.professor}.`
        : `I couldn't find a professor for the course: "${params.course}".`;
    
    case "get_course_time":
      const timeEntry = timetable.find(e => e.course_name.toLowerCase().includes(params.course ?? ""));
       return timeEntry
        ? `${timeEntry.course_name} is on ${timeEntry.day} from ${timeEntry.start_time} to ${timeEntry.end_time}.`
        : `I couldn't find a time for the course: "${params.course}".`;

    default:
      return "I'm sorry, I don't understand that. You can ask about 'events', 'timetable', 'who teaches [course]?', or 'when is [course]?'.";
  }
}