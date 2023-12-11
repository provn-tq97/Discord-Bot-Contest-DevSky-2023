import Enmap from 'enmap';

// too many databases
export const reminderDatabase = new Enmap({ name: 'reminder', dataDir: 'database/reminder' });
export const suggestionDatabase = new Enmap({ name: 'suggestion', dataDir: 'database/suggestion' });
export const flagQuizDatabase = new Enmap({ name: 'flagquiz', dataDir: 'database/flagquiz' });
export const countingDatabase = new Enmap({ name: 'counting', dataDir: 'database/counting' });
