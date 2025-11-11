import { useEffect, useState } from 'react';
import { useAgentStore } from '@/stores/agentStore';
import { HealthAgent } from '@/data/mockData';

/**
 * Hook pour gérer les agents avec cache et chargement
 */
export const useAgents = (forceRefresh = false) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const agents = useAgentStore((state) => state.agents);
  const fetchAgents = useAgentStore((state) => state.fetchAgents);
  const getAgentsByStructure = useAgentStore((state) => state.getAgentsByStructure);
  const getAgentsByDistrict = useAgentStore((state) => state.getAgentsByDistrict);
  const getAgentsByType = useAgentStore((state) => state.getAgentsByType);
  const getAgentById = useAgentStore((state) => state.getAgentById);
  const addAgent = useAgentStore((state) => state.addAgent);
  const updateAgent = useAgentStore((state) => state.updateAgent);
  const deleteAgent = useAgentStore((state) => state.deleteAgent);
  const isCacheValid = useAgentStore((state) => state.isCacheValid);
  const invalidateCache = useAgentStore((state) => state.invalidateCache);

  // Charger les agents au montage si le cache n'est pas valide
  useEffect(() => {
    const loadAgents = async () => {
      if (!isCacheValid() || forceRefresh) {
        setLoading(true);
        try {
          await fetchAgents(forceRefresh);
          setError(null);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
          console.error('Erreur:', err);
        } finally {
          setLoading(false);
        }
      }
    };

    loadAgents();
  }, [forceRefresh, fetchAgents, isCacheValid]);

  return {
    agents,
    loading,
    error,
    getAgentsByStructure,
    getAgentsByDistrict,
    getAgentsByType,
    getAgentById,
    addAgent,
    updateAgent,
    deleteAgent,
    invalidateCache,
  };
};

/**
 * Hook pour un agent spécifique
 */
export const useAgent = (id: string) => {
  const agent = useAgentStore((state) => state.getAgentById(id));
  const updateAgent = useAgentStore((state) => state.updateAgent);

  const update = (updates: Partial<HealthAgent>) => {
    updateAgent(id, updates);
  };

  return {
    agent,
    update,
  };
};
