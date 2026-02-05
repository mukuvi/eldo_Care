import { User, PatientCase, VoiceSession, DashboardStats } from '@/types';

const STORAGE_KEYS = {
  USERS: 'eldocare_users',
  CASES: 'eldocare_cases',
  SESSIONS: 'eldocare_sessions',
  CURRENT_USER: 'eldocare_current_user',
};

// No default admin - users must register themselves
const initializeStorage = () => {
  // Storage is initialized empty - first user to register as admin becomes admin
};

// Users
export const getUsers = (): User[] => {
  const data = localStorage.getItem(STORAGE_KEYS.USERS);
  return data ? JSON.parse(data) : [];
};

export const saveUsers = (users: User[]) => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const addUser = (user: Omit<User, 'id' | 'createdAt'>): User => {
  const users = getUsers();
  const newUser: User = {
    ...user,
    id: `user-${Date.now()}`,
    createdAt: new Date().toISOString(),
    licenseNumber: user.licenseNumber,
    chvIdNumber: user.chvIdNumber,
  };
  saveUsers([...users, newUser]);
  return newUser;
};

export const updateUser = (id: string, updates: Partial<User>) => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === id);
  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
    saveUsers(users);
  }
};

export const deleteUser = (id: string) => {
  const users = getUsers().filter(u => u.id !== id);
  saveUsers(users);
};

// Cases
export const getCases = (): PatientCase[] => {
  const data = localStorage.getItem(STORAGE_KEYS.CASES);
  return data ? JSON.parse(data) : [];
};

export const saveCases = (cases: PatientCase[]) => {
  localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(cases));
};

export const addCase = (caseData: Omit<PatientCase, 'id' | 'createdAt'>): PatientCase => {
  const cases = getCases();
  const newCase: PatientCase = {
    ...caseData,
    id: `case-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  saveCases([...cases, newCase]);
  return newCase;
};

export const updateCase = (id: string, updates: Partial<PatientCase>) => {
  const cases = getCases();
  const index = cases.findIndex(c => c.id === id);
  if (index !== -1) {
    cases[index] = { ...cases[index], ...updates };
    saveCases(cases);
  }
};

// Voice Sessions
export const getSessions = (): VoiceSession[] => {
  const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
  return data ? JSON.parse(data) : [];
};

export const saveSessions = (sessions: VoiceSession[]) => {
  localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
};

export const addSession = (session: Omit<VoiceSession, 'id'>): VoiceSession => {
  const sessions = getSessions();
  const newSession: VoiceSession = {
    ...session,
    id: `session-${Date.now()}`,
  };
  saveSessions([...sessions, newSession]);
  return newSession;
};

// Current User
export const getCurrentUser = (): User | null => {
  const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return data ? JSON.parse(data) : null;
};

export const setCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};

// Dashboard Stats
export const getDashboardStats = (): DashboardStats => {
  const cases = getCases();
  const users = getUsers();
  
  return {
    totalCases: cases.length,
    activeCases: cases.filter(c => c.status === 'pending' || c.status === 'in-progress').length,
    urgentRisks: cases.filter(c => c.riskLevel === 'high' || c.riskLevel === 'critical').length,
    referralCount: cases.filter(c => c.status === 'referred').length,
    chvCount: users.filter(u => u.role === 'chv').length,
    userCount: users.filter(u => u.role === 'user').length,
  };
};

// Initialize on import
initializeStorage();
