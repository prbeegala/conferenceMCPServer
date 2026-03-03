import { app, InvocationContext, arg } from "@azure/functions";
import * as fs from 'fs';
import * as path from 'path';

// Load conference data from JSON files
const loadData = (filename: string) => {
  try {
    const dataPath = path.join(__dirname, '../../data', filename);
    const data = fs.readFileSync(dataPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error loading ${filename}:`, error);
    return [];
  }
};

// Tool 1: List Sessions
export async function listSessions(
  _toolArguments: unknown,
  context: InvocationContext
): Promise<string> {
  console.info("Listing conference sessions");
  
  const mcptoolargs = context.triggerMetadata.mcptoolargs as {
    track?: string;
    level?: string;
    tag?: string;
  };
  
  let sessions = loadData('sessions.json');
  
  // Filter by track if specified
  if (mcptoolargs?.track) {
    sessions = sessions.filter((s: any) => 
      s.track.toLowerCase().includes(mcptoolargs.track!.toLowerCase())
    );
  }
  
  // Filter by level if specified
  if (mcptoolargs?.level) {
    sessions = sessions.filter((s: any) => 
      s.level.toLowerCase() === mcptoolargs.level!.toLowerCase()
    );
  }
  
  // Filter by tag if specified
  if (mcptoolargs?.tag) {
    sessions = sessions.filter((s: any) => 
      s.tags.some((t: string) => t.toLowerCase().includes(mcptoolargs.tag!.toLowerCase()))
    );
  }
  
  if (sessions.length === 0) {
    return "No sessions found matching your criteria.";
  }
  
  return JSON.stringify(sessions, null, 2);
}

// Tool 2: Get Speaker
export async function getSpeaker(
  _toolArguments: unknown,
  context: InvocationContext
): Promise<string> {
  console.info("Getting speaker information");
  
  const mcptoolargs = context.triggerMetadata.mcptoolargs as {
    speaker_id?: string;
    name?: string;
  };
  
  const speakers = loadData('speakers.json');
  
  let speaker;
  if (mcptoolargs?.speaker_id) {
    speaker = speakers.find((s: any) => s.id === mcptoolargs.speaker_id);
  } else if (mcptoolargs?.name) {
    speaker = speakers.find((s: any) => 
      s.name.toLowerCase().includes(mcptoolargs.name!.toLowerCase())
    );
  }
  
  if (!speaker) {
    return "Speaker not found. Please provide a valid speaker_id or name.";
  }
  
  return JSON.stringify(speaker, null, 2);
}

// Tool 3: Search Attendees
export async function searchAttendees(
  _toolArguments: unknown,
  context: InvocationContext
): Promise<string> {
  console.info("Searching attendees");
  
  const mcptoolargs = context.triggerMetadata.mcptoolargs as {
    interest?: string;
    company?: string;
  };
  
  let attendees = loadData('attendees.json');
  
  // Filter by interest if specified
  if (mcptoolargs?.interest) {
    attendees = attendees.filter((a: any) => 
      a.interests.some((i: string) => 
        i.toLowerCase().includes(mcptoolargs.interest!.toLowerCase())
      )
    );
  }
  
  // Filter by company if specified
  if (mcptoolargs?.company) {
    attendees = attendees.filter((a: any) => 
      a.company.toLowerCase().includes(mcptoolargs.company!.toLowerCase())
    );
  }
  
  if (attendees.length === 0) {
    return "No attendees found matching your criteria.";
  }
  
  return JSON.stringify(attendees, null, 2);
}

// Tool 4: Get Venue Map
export async function getVenueMap(
  _toolArguments: unknown,
  context: InvocationContext
): Promise<string> {
  console.info("Getting venue map");
  
  const mcptoolargs = context.triggerMetadata.mcptoolargs as {
    location?: string;
  };
  
  const venues = loadData('venues.json');
  
  let result;
  if (mcptoolargs?.location) {
    result = venues.filter((v: any) => 
      v.location.toLowerCase().includes(mcptoolargs.location!.toLowerCase())
    );
  } else {
    result = venues; // Return all venues if no location specified
  }
  
  if (result.length === 0) {
    return "Venue location not found.";
  }
  
  return JSON.stringify(result, null, 2);
}

// Tool 5: Build Agenda (simplified - returns formatted session list)
export async function buildAgenda(
  _toolArguments: unknown,
  context: InvocationContext
): Promise<string> {
  console.info("Building personalized agenda");
  
  const mcptoolargs = context.triggerMetadata.mcptoolargs as {
    session_ids?: string;
  };
  
  if (!mcptoolargs?.session_ids) {
    return "Please provide session_ids as a comma-separated list (e.g., 'session-001,session-002')";
  }
  
  const sessions = loadData('sessions.json');
  const sessionIdList = mcptoolargs.session_ids.split(',').map(id => id.trim());
  
  const selectedSessions = sessions.filter((s: any) => 
    sessionIdList.includes(s.id)
  );
  
  if (selectedSessions.length === 0) {
    return "No valid sessions found for the provided IDs.";
  }
  
  // Sort by time
  selectedSessions.sort((a: any, b: any) => 
    new Date(a.time).getTime() - new Date(b.time).getTime()
  );
  
  const agenda = {
    total_sessions: selectedSessions.length,
    sessions: selectedSessions.map((s: any) => ({
      id: s.id,
      title: s.title,
      time: s.time,
      duration_minutes: s.duration_minutes,
      room: s.room,
      track: s.track
    }))
  };
  
  return JSON.stringify(agenda, null, 2);
}

// Tool 6: Submit Question (simplified - stores in memory/console)
export async function submitQuestion(
  _toolArguments: unknown,
  context: InvocationContext
): Promise<string> {
  console.info("Submitting Q&A question");
  
  const mcptoolargs = context.triggerMetadata.mcptoolargs as {
    session_id?: string;
    question?: string;
    attendee_name?: string;
  };
  
  if (!mcptoolargs?.session_id || !mcptoolargs?.question) {
    return "Please provide both session_id and question.";
  }
  
  const sessions = loadData('sessions.json');
  const session = sessions.find((s: any) => s.id === mcptoolargs.session_id);
  
  if (!session) {
    return `Session '${mcptoolargs.session_id}' not found.`;
  }
  
  const questionData = {
    session_id: mcptoolargs.session_id,
    session_title: session.title,
    question: mcptoolargs.question,
    attendee_name: mcptoolargs.attendee_name || "Anonymous",
    timestamp: new Date().toISOString(),
    status: "submitted"
  };
  
  // In a real implementation, this would store to a database or queue
  console.info("Question submitted:", JSON.stringify(questionData));
  
  return `Question submitted successfully for session "${session.title}":\n${JSON.stringify(questionData, null, 2)}`;
}

// Register all MCP tools
app.mcpTool("listSessions", {
  toolName: "list_sessions",
  description: "List and filter conference sessions by track, level, or tag",
  toolProperties: {
    track: arg.string().describe("Filter by track (e.g., 'AI & Machine Learning', 'Cloud Native')").optional(),
    level: arg.string().describe("Filter by level: Beginner, Intermediate, or Advanced").optional(),
    tag: arg.string().describe("Filter by tag (e.g., 'Azure', 'Kubernetes', 'AI')").optional()
  },
  handler: listSessions
});

app.mcpTool("getSpeaker", {
  toolName: "get_speaker",
  description: "Get detailed information about a speaker by ID or name",
  toolProperties: {
    speaker_id: arg.string().describe("Speaker ID (e.g., 'speaker-001')").optional(),
    name: arg.string().describe("Search by speaker name").optional()
  },
  handler: getSpeaker
});

app.mcpTool("searchAttendees", {
  toolName: "search_attendees",
  description: "Find attendees by interests or company for networking",
  toolProperties: {
    interest: arg.string().describe("Search by interest (e.g., 'AI', 'Kubernetes', 'Security')").optional(),
    company: arg.string().describe("Search by company name").optional()
  },
  handler: searchAttendees
});

app.mcpTool("getVenueMap", {
  toolName: "get_venue_map",
  description: "Get venue location information and map details",
  toolProperties: {
    location: arg.string().describe("Specific location name (e.g., 'Main Hall A'). Leave empty for all venues.").optional()
  },
  handler: getVenueMap
});

app.mcpTool("buildAgenda", {
  toolName: "build_agenda",
  description: "Create a personalized agenda from selected session IDs",
  toolProperties: {
    session_ids: arg.string().describe("Comma-separated list of session IDs (e.g., 'session-001,session-003,session-005')")
  },
  handler: buildAgenda
});

app.mcpTool("submitQuestion", {
  toolName: "submit_question",
  description: "Submit a Q&A question for a specific session",
  toolProperties: {
    session_id: arg.string().describe("Session ID for the question"),
    question: arg.string().describe("The question text"),
    attendee_name: arg.string().describe("Your name (optional, defaults to Anonymous)").optional()
  },
  handler: submitQuestion
});
