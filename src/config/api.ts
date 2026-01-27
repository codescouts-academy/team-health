// Configura la URL de tu backend SSE aquí
const API_BASE_URL = "/api";

export const endpoints = {
  // Room management
  createRoom: `${API_BASE_URL}/rooms`,
  joinRoom: (code: string) => `${API_BASE_URL}/rooms/${code}/join`,
  leaveRoom: (code: string) => `${API_BASE_URL}/rooms/${code}/leave`,

  // Voting
  submitVote: (code: string) => `${API_BASE_URL}/rooms/${code}/vote`,

  // SSE streams
  roomEvents: (code: string) => `${API_BASE_URL}/rooms/${code}/events`,
};
