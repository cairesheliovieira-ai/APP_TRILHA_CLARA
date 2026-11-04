import { useState, useEffect } from 'react';

interface PontosData {
  _meta?: {
    ultima_atualizacao?: string;
    coordenadas_nota?: string;
  };
  pontos: Array<{
    id: string;
    nome: string;
    tipo: string;
    descricao: string;
    acessivel: boolean;
    lat: number;
    lng: number;
    status: string;
    icone: string;
  }>;
}

interface ResiduosData {
  categorias: Array<{
    cor: string;
    material: string;
    hex: string;
    icone: string;
    vai: string[];
    nao_vai: string[];
  }>;
}

interface FaunaData {
  animais: Array<{
    id: string;
    nome: string;
    nome_cientifico: string;
    categoria: string;
    come: string;
    caracteristica: string;
    origem: string;
    curiosidade: string;
    como_agir: string;
    fonte: string;
    mais_vista_hoje: boolean;
    imagem_placeholder: string;
  }>;
}

interface AvisosData {
  avisos: Array<{
    id: string;
    tipo: string;
    titulo: string;
    mensagem: string;
    acao_texto: string;
    acao_rota: string;
    ativo: boolean;
    data: string;
  }>;
}

function useLocalData<T>(path: string): { data: T | null; loading: boolean; error: string | null } {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    // Try cache first
    const cacheKey = `trilha-clara-cache-${path}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        setData(JSON.parse(cached));
        setLoading(false);
      } catch {
        // ignore parse error, will fetch
      }
    }

    fetch(path)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        if (!cancelled) {
          setData(json);
          setLoading(false);
          // Cache for offline
          localStorage.setItem(cacheKey, JSON.stringify(json));
        }
      })
      .catch((err) => {
        if (!cancelled) {
          if (!cached) {
            setError(err.message);
          }
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [path]);

  return { data, loading, error };
}

export function usePontos() {
  return useLocalData<PontosData>('/data/pontos.json');
}

export function useResiduos() {
  return useLocalData<ResiduosData>('/data/residuos.json');
}

export function useFauna() {
  return useLocalData<FaunaData>('/data/fauna.json');
}

export function useAvisos() {
  return useLocalData<AvisosData>('/data/avisos.json');
}
