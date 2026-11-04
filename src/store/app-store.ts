import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Denuncia {
  id: string;
  tipo: string;
  local: string;
  usarLocalizacao: boolean;
  coordenadas?: { lat: number; lng: number };
  detalhes: string;
  foto?: string; // base64 sem EXIF
  anonima: boolean;
  protocolo: string;
  status: 'recebida' | 'em_analise' | 'resolvida';
  criadaEm: string;
  atualizadaEm: string;
}

interface AppState {
  // Theme
  theme: 'default' | 'high-contrast';
  textSize: 'default' | 'large';
  reduceMotion: boolean;
  economyMode: boolean;
  setTheme: (theme: 'default' | 'high-contrast') => void;
  setTextSize: (size: 'default' | 'large') => void;
  setReduceMotion: (reduce: boolean) => void;
  setEconomyMode: (economy: boolean) => void;

  // Onboarding
  hasEntered: boolean;
  setHasEntered: (v: boolean) => void;

  // Reports
  denuncias: Denuncia[];
  addDenuncia: (d: Denuncia) => void;
  updateDenunciaStatus: (id: string, status: Denuncia['status']) => void;

  // Draft report (between steps)
  reportDraft: Partial<Denuncia> | null;
  setReportDraft: (draft: Partial<Denuncia> | null) => void;

  // Active waste category
  activeWasteColor: string;
  setActiveWasteColor: (color: string) => void;

  // Capybara alert dismissed
  capybaraAlertDismissed: boolean;
  setCapybaraAlertDismissed: (v: boolean) => void;

  // Map filter
  mapFilter: string;
  setMapFilter: (filter: string) => void;
  favoritePointIds: string[];
  toggleFavoritePoint: (id: string) => void;
  recentPointIds: string[];
  addRecentPoint: (id: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Theme
      theme: 'default',
      textSize: 'default',
      reduceMotion: false,
      economyMode: false,
      setTheme: (theme) => set({ theme }),
      setTextSize: (textSize) => set({ textSize }),
      setReduceMotion: (reduceMotion) => set({ reduceMotion }),
      setEconomyMode: (economyMode) => set({ economyMode }),

      // Onboarding
      hasEntered: false,
      setHasEntered: (hasEntered) => set({ hasEntered }),

      // Reports
      denuncias: [],
      addDenuncia: (d) =>
        set((state) => ({ denuncias: [...state.denuncias, d] })),
      updateDenunciaStatus: (id, status) =>
        set((state) => ({
          denuncias: state.denuncias.map((d) =>
            d.id === id ? { ...d, status, atualizadaEm: new Date().toISOString() } : d
          ),
        })),

      // Draft
      reportDraft: null,
      setReportDraft: (reportDraft) => set({ reportDraft }),

      // Waste
      activeWasteColor: 'azul',
      setActiveWasteColor: (activeWasteColor) => set({ activeWasteColor }),

      // Capybara
      capybaraAlertDismissed: false,
      setCapybaraAlertDismissed: (capybaraAlertDismissed) =>
        set({ capybaraAlertDismissed }),

      // Map
      mapFilter: 'todos',
      setMapFilter: (mapFilter) => set({ mapFilter }),
      favoritePointIds: [],
      toggleFavoritePoint: (id) =>
        set((state) => ({
          favoritePointIds: state.favoritePointIds.includes(id)
            ? state.favoritePointIds.filter((pointId) => pointId !== id)
            : [...state.favoritePointIds, id],
        })),
      recentPointIds: [],
      addRecentPoint: (id) =>
        set((state) => ({
          recentPointIds: [id, ...state.recentPointIds.filter((pointId) => pointId !== id)].slice(0, 5),
        })),
    }),
    {
      name: 'trilha-clara-storage',
      partialize: (state) => ({
        theme: state.theme,
        textSize: state.textSize,
        reduceMotion: state.reduceMotion,
        economyMode: state.economyMode,
        hasEntered: state.hasEntered,
        denuncias: state.denuncias,
        capybaraAlertDismissed: state.capybaraAlertDismissed,
        activeWasteColor: state.activeWasteColor,
        favoritePointIds: state.favoritePointIds,
        recentPointIds: state.recentPointIds,
      }),
    }
  )
);
