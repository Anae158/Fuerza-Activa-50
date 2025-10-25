import type { HistoryEntry } from '../types';

const HISTORY_KEY = 'workoutHistory';

export const getHistory = (): HistoryEntry[] => {
  try {
    const savedHistoryJSON = localStorage.getItem(HISTORY_KEY);
    if (savedHistoryJSON) {
      const history = JSON.parse(savedHistoryJSON) as HistoryEntry[];
      // Sort by date descending
      return history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    return [];
  } catch (e) {
    console.error("Failed to read history from localStorage", e);
    localStorage.removeItem(HISTORY_KEY);
    return [];
  }
};

export const addHistoryEntry = (entry: HistoryEntry): HistoryEntry[] => {
  const currentHistory = getHistory();
  // Prevent adding duplicate entries for the same day
  const entryExists = currentHistory.some(h => h.date === entry.date);
  if (entryExists) {
    return currentHistory;
  }
  
  const newHistory = [entry, ...currentHistory];
  // Re-sort after adding to be safe
  const sortedHistory = newHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(sortedHistory));
    return sortedHistory;
  } catch (e) {
    console.error("Failed to save history to localStorage", e);
    return currentHistory;
  }
};
