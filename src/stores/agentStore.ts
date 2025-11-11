import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { HealthAgent, mockHealthAgents } from '@/data/mockData';

interface AgentCache {
  agents: HealthAgent[];
  lastUpdated: string | null;
}

interface AgentState {
  cache: AgentCache;
  agents: HealthAgent[];
  
  // Fetching and caching
  fetchAgents: (forceRefresh?: boolean) => Promise<HealthAgent[]>;
  getAgents: () => HealthAgent[];
  getAgentById: (id: string) => HealthAgent | undefined;
  
  // Agent management
  addAgent: (agent: HealthAgent) => void;
  updateAgent: (id: string, updates: Partial<HealthAgent>) => void;
  deleteAgent: (id: string) => void;
  
  // Filter helpers
  getAgentsByStructure: (structure: string) => HealthAgent[];
  getAgentsByDistrict: (district: string) => HealthAgent[];
  getAgentsByType: (type: 'sage_femme' | 'agent_sante') => HealthAgent[];
  
  // Cache management
  clearCache: () => void;
  invalidateCache: () => void;
  isCacheValid: (maxAgeMs?: number) => boolean;
}

const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

export const useAgentStore = create<AgentState>()(
  persist(
    (set, get) => ({
      cache: {
        agents: [],
        lastUpdated: null,
      },
      agents: [],

      fetchAgents: async (forceRefresh = false) => {
        const state = get();
        const now = new Date().toISOString();

        // Retourner le cache s'il est valide et pas de refresh forcé
        if (!forceRefresh && state.isCacheValid()) {
          console.log('📦 Agents du cache');
          return state.agents;
        }

        try {
          // Simuler un appel API en attendant 300ms
          await new Promise((resolve) => setTimeout(resolve, 300));

          // Dans une vraie app, ce serait un appel API
          // Pour maintenant, on utilise les mockData
          const agents = [...mockHealthAgents];

          set({
            agents,
            cache: {
              agents,
              lastUpdated: now,
            },
          });

          console.log(`📥 Agents chargés: ${agents.length}`);
          return agents;
        } catch (error) {
          console.error('❌ Erreur lors du chargement des agents:', error);
          throw error;
        }
      },

      getAgents: () => {
        return get().agents;
      },

      getAgentById: (id: string) => {
        return get().agents.find((a) => a.id === id);
      },

      addAgent: (agent: HealthAgent) => {
        const state = get();
        const newAgents = [...state.agents, agent];
        const now = new Date().toISOString();

        set({
          agents: newAgents,
          cache: {
            agents: newAgents,
            lastUpdated: now,
          },
        });

        console.log(`✅ Agent ajouté: ${agent.prenom} ${agent.nom}`);
      },

      updateAgent: (id: string, updates: Partial<HealthAgent>) => {
        const state = get();
        const updatedAgents = state.agents.map((a) =>
          a.id === id ? { ...a, ...updates } : a
        );
        const now = new Date().toISOString();

        set({
          agents: updatedAgents,
          cache: {
            agents: updatedAgents,
            lastUpdated: now,
          },
        });

        console.log(`✅ Agent mis à jour: ${id}`);
      },

      deleteAgent: (id: string) => {
        const state = get();
        const filteredAgents = state.agents.filter((a) => a.id !== id);
        const now = new Date().toISOString();

        set({
          agents: filteredAgents,
          cache: {
            agents: filteredAgents,
            lastUpdated: now,
          },
        });

        console.log(`✅ Agent supprimé: ${id}`);
      },

      getAgentsByStructure: (structure: string) => {
        return get().agents.filter((a) => a.structure === structure);
      },

      getAgentsByDistrict: (district: string) => {
        return get().agents.filter((a) => a.district === district);
      },

      getAgentsByType: (type: 'sage_femme' | 'agent_sante') => {
        return get().agents.filter((a) => a.type === type);
      },

      clearCache: () => {
        set({
          agents: [],
          cache: {
            agents: [],
            lastUpdated: null,
          },
        });

        console.log('🗑️ Cache vidé');
      },

      invalidateCache: () => {
        set((state) => ({
          cache: {
            ...state.cache,
            lastUpdated: null,
          },
        }));

        console.log('🔄 Cache invalidé');
      },

      isCacheValid: (maxAgeMs = CACHE_DURATION_MS) => {
        const state = get();
        if (!state.cache.lastUpdated) return false;

        const lastUpdate = new Date(state.cache.lastUpdated).getTime();
        const now = new Date().getTime();
        const age = now - lastUpdate;

        return age < maxAgeMs;
      },
    }),
    {
      name: 'agent-storage', // localStorage key
      partialize: (state) => ({
        agents: state.agents,
        cache: state.cache,
      }),
    }
  )
);
