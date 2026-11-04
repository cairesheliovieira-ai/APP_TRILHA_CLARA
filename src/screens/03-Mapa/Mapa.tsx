import { useEffect, useMemo, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  AlertTriangle,
  BookOpen,
  CheckCircle,
  Clock3,
  Compass,
  History,
  LocateFixed,
  MapPin,
  Maximize,
  Minimize,
  Navigation,
  Search,
  Star,
  X,
} from 'lucide-react';
import L from 'leaflet';
import polyline from '@mapbox/polyline';
import { CircleMarker, MapContainer, Marker, Polyline, Popup, TileLayer, ZoomControl, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { usePontos, useResiduos } from '../../hooks/useOfflineData';
import StatusBadge, { type Status } from '../../components/StatusBadge/StatusBadge';
import Card from '../../components/Card/Card';
import BottomNav from '../../components/BottomNav/BottomNav';
import { useAppStore } from '../../store/app-store';
import styles from './Mapa.module.css';

type Point = NonNullable<ReturnType<typeof usePontos>['data']>['pontos'][number];
type MapCenter = [number, number];
type WalkRoute = { coordinates: MapCenter[]; distanceKm: number; durationMinutes: number };

const parkCenter: MapCenter = [-15.830198, -48.0211675];
const tiles = {
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri, Maxar, Earthstar Geographics, and the GIS User Community',
  },
  streets: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
  },
};

const markerLabels: Record<string, string> = {
  entrada: 'E',
  banheiro: 'A',
  vaga: 'P',
  coleta: 'C',
  lixeira: 'C',
  trecho: '!',
};

const filterOptions = [
  { id: 'acessibilidade', label: 'Acessibilidade' },
  { id: 'coleta', label: 'Coleta' },
  { id: 'alertas', label: 'Alertas' },
];

const searchAliases: Record<string, string[]> = {
  banheiro: ['banheiro', 'sanitario', 'sanitarios', 'toalete', 'wc', 'pcd', 'cadeirante'],
  vaga: ['vaga', 'estacionamento', 'carro', 'pcd', 'preferencial'],
  entrada: ['entrada', 'portao', 'acesso', 'guarita'],
  coleta: ['lixeira', 'lixo', 'reciclagem', 'reciclavel', 'descarte', 'coleta'],
  trecho: ['alerta', 'perigo', 'iluminacao', 'escuro', 'atencao', 'risco'],
};

function normalizeSearch(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR').replace(/[^a-z0-9\s]/g, ' ').trim();
}

const ignoredSearchTerms = new Set(['onde', 'fica', 'para', 'perto', 'mim', 'quero', 'ir', 'jogo', 'jogar', 'descarto', 'descartar', 'descarte', 'lixo', 'o', 'a', 'do', 'da', 'no', 'na', 'com']);

function MapController({
  selectedPoint,
  route,
  resetKey,
  userLocation,
  reduceMotion,
}: {
  selectedPoint: Point | undefined;
  route: WalkRoute | null;
  resetKey: number;
  userLocation: MapCenter | null;
  reduceMotion: boolean;
}) {
  const map = useMap();

  useEffect(() => {
    if (selectedPoint) {
      if (reduceMotion) map.setView([selectedPoint.lat, selectedPoint.lng], 17, { animate: false });
      else map.flyTo([selectedPoint.lat, selectedPoint.lng], 17, { duration: 0.6 });
    }
  }, [map, reduceMotion, selectedPoint]);

  useEffect(() => {
    if (resetKey > 0) {
      if (reduceMotion) map.setView(parkCenter, 15, { animate: false });
      else map.flyTo(parkCenter, 15, { duration: 0.6 });
    }
  }, [map, reduceMotion, resetKey]);

  useEffect(() => {
    if (userLocation) {
      if (reduceMotion) map.setView(userLocation, 17, { animate: false });
      else map.flyTo(userLocation, 17, { duration: 0.6 });
    }
  }, [map, reduceMotion, userLocation]);

  useEffect(() => {
    if (route?.coordinates.length) {
      map.fitBounds(L.latLngBounds(route.coordinates), { padding: [48, 48], maxZoom: 18, animate: !reduceMotion });
    }
  }, [map, reduceMotion, route]);

  return null;
}

export default function Mapa() {
  const { data: pontosData, loading } = usePontos();
  const { data: residuosData } = useResiduos();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);
  const [mapStyle, setMapStyle] = useState<'satellite' | 'streets'>('satellite');
  const [userLocation, setUserLocation] = useState<MapCenter | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [destinationId, setDestinationId] = useState('');
  const [originId, setOriginId] = useState('gps');
  const [route, setRoute] = useState<WalkRoute | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState('');
  const [resetKey, setResetKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const mapViewportRef = useRef<HTMLDivElement>(null);
  const favoritePointIds = useAppStore((state) => state.favoritePointIds);
  const recentPointIds = useAppStore((state) => state.recentPointIds);
  const toggleFavoritePoint = useAppStore((state) => state.toggleFavoritePoint);
  const addRecentPoint = useAppStore((state) => state.addRecentPoint);
  const setActiveWasteColor = useAppStore((state) => state.setActiveWasteColor);
  const reduceMotion = useAppStore((state) => state.reduceMotion);

  const pontos = pontosData?.pontos || [];
  const parkEntries = pontos.filter((point) => point.tipo === 'entrada');
  const selectedPoint = pontos.find((point) => point.id === selectedPointId);
  const destination = pontos.find((point) => point.id === destinationId);
  const activeTiles = tiles[mapStyle];
  const normalizedQuery = normalizeSearch(searchQuery);
  const searchResults = normalizedQuery
    ? pontos.filter((point) => {
      const searchableText = normalizeSearch(`${point.nome} ${point.tipo} ${point.descricao}`);
      const aliases = normalizeSearch([...(searchAliases[point.tipo] ?? []), point.id.replaceAll('-', ' ')].join(' '));
      const terms = normalizedQuery.split(/\s+/).filter((term) => !ignoredSearchTerms.has(term));
      return normalizedQuery.includes('acess') && point.acessivel
        || (terms.length > 0 && terms.every((term) => searchableText.includes(term) || aliases.includes(term)));
    })
    : pontos;
  const wasteMatches = normalizedQuery
    ? (residuosData?.categorias ?? []).flatMap((category) => [
      ...category.vai.map((item) => ({ item, category, canDiscard: true })),
      ...category.nao_vai.map((item) => ({ item, category, canDiscard: false })),
    ]).filter(({ item }) => {
      const terms = normalizedQuery.split(/\s+/).filter((term) => !ignoredSearchTerms.has(term));
      const normalizedItem = normalizeSearch(item);
      return terms.length > 0 && terms.some((term) => normalizedItem.includes(term));
    }).slice(0, 4)
    : [];
  const favoritePoints = favoritePointIds.map((id) => pontos.find((point) => point.id === id)).filter((point): point is Point => Boolean(point));
  const recentPoints = recentPointIds.map((id) => pontos.find((point) => point.id === id)).filter((point): point is Point => Boolean(point));

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const query = searchParams.get('buscar');
    const destinationParam = searchParams.get('destino');
    if (destinationParam) {
      if (loading) return;
      const point = pontos.find((item) => item.id === destinationParam);
      if (point) {
        setDestinationId(point.id);
        setSearchQuery(point.nome);
        setSelectedPointId(point.id);
      }
      setSearchParams({}, { replace: true });
    } else if (query) {
      setSearchQuery(query);
      setSearchParams({}, { replace: true });
    }
  }, [loading, pontos, searchParams, setSearchParams]);

  const markerIcons = useMemo(() => {
    const icons = new Map<string, L.DivIcon>();
    for (const point of pontos) {
      const tone = point.status === 'precisa_atencao' ? 'warning' : point.acessivel ? 'accessible' : 'standard';
      icons.set(point.id, L.divIcon({
        className: styles.markerShell,
        html: `<span class="${styles.marker} ${styles[`marker_${tone}`]}"><span>${markerLabels[point.tipo] ?? 'P'}</span></span>`,
        iconSize: [38, 44],
        iconAnchor: [19, 42],
        popupAnchor: [0, -40],
      }));
    }
    return icons;
  }, [pontos]);

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(document.fullscreenElement === mapViewportRef.current);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const filteredPontos = pontos.filter((p) => {
    if (!activeFilters.length) return true;
    return activeFilters.some((filter) => {
      if (filter === 'acessibilidade') return p.acessivel || p.tipo === 'banheiro' || p.tipo === 'vaga';
      if (filter === 'coleta') return p.tipo === 'coleta' || p.tipo === 'lixeira';
      if (filter === 'alertas') return p.tipo === 'trecho' || p.status === 'precisa_atencao';
      return false;
    });
  });

  const selectDestination = (point: Point) => {
    setDestinationId(point.id);
    setSearchQuery(point.nome);
    setSelectedPointId(point.id);
    addRecentPoint(point.id);
    setRoute(null);
    setRouteError('');
  };

  const getCurrentPosition = () => new Promise<MapCenter>((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Este navegador não oferece localização.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve([coords.latitude, coords.longitude]),
      () => reject(new Error('Não foi possível acessar sua localização. Permita o acesso à localização para traçar a rota.')),
      { enableHighAccuracy: true, timeout: 12000 },
    );
  });

  const handleRouteSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = destination ?? searchResults[0];
    if (!target) {
      if (wasteMatches.length) {
        setActiveWasteColor(wasteMatches[0].category.cor);
        navigate('/descarte');
        return;
      }
      setRouteError('Nenhum lugar encontrado no parque. Tente buscar por entrada, banheiro ou lixeira.');
      return;
    }

    selectDestination(target);
    setRouteLoading(true);
    setRouteError('');
    try {
      if (!isOnline) throw new Error('A rota precisa de internet. Conecte-se e tente novamente.');
      const selectedOrigin = pontos.find((point) => point.id === originId);
      const origin = originId === 'gps'
        ? userLocation ?? await getCurrentPosition()
        : selectedOrigin ? [selectedOrigin.lat, selectedOrigin.lng] as MapCenter : null;
      if (!origin) throw new Error('Escolha um ponto de partida válido.');
      if (originId === 'gps') setUserLocation(origin);
      const query = new URLSearchParams({
        json: JSON.stringify({
          locations: [
            { lat: origin[0], lon: origin[1] },
            { lat: target.lat, lon: target.lng },
          ],
          costing: 'pedestrian',
          units: 'kilometers',
        }),
      });
      const response = await fetch(`https://valhalla1.openstreetmap.de/route?${query}`);
      if (!response.ok) throw new Error('O serviço de rotas está indisponível. Tente novamente.');

      const result = await response.json();
      const leg = result.trip?.legs?.[0];
      if (result.trip?.status !== 0 || !leg?.shape) {
        throw new Error('Não foi possível encontrar um caminho a pé até esse local.');
      }

      setRoute({
        coordinates: polyline.decode(leg.shape, 6) as MapCenter[],
        distanceKm: result.trip.summary.length,
        durationMinutes: Math.max(1, Math.round(result.trip.summary.time / 60)),
      });
      setSelectedPointId(target.id);
    } catch (error) {
      setRouteError(error instanceof Error ? error.message : 'Erro ao traçar rota. Verifique sua conexão e tente novamente.');
    } finally {
      setRouteLoading(false);
    }
  };

  const renderPointChoice = (point: Point, icon: 'favorite' | 'recent') => (
    <div key={`${icon}-${point.id}`} className={styles.savedPlaceRow}>
      <button type="button" className={styles.savedPlaceButton} onClick={() => selectDestination(point)}>
        {icon === 'favorite' ? <Star size={16} aria-hidden="true" /> : <History size={16} aria-hidden="true" />}
        <span><strong>{point.nome}</strong><small>{point.tipo}</small></span>
      </button>
      {icon === 'favorite' && (
        <button
          type="button"
          className={styles.favoriteButton}
          aria-label={`Remover ${point.nome} dos favoritos`}
          onClick={() => toggleFavoritePoint(point.id)}
        >
          <Star size={17} fill="currentColor" aria-hidden="true" />
        </button>
      )}
    </div>
  );

  return (
    <div className={styles.screenWrapper}>
      <header className={styles.header}>
        <div className={styles.headerRow}>
          <div className={styles.headerTitleGroup}>
            <Compass size={24} className={styles.headerIcon} aria-hidden="true" />
            <h1 className={styles.title}>Mapa do parque</h1>
          </div>
          <span className={styles.offlineChip} aria-label="Camada cartográfica online">
            Mapa online
          </span>
        </div>
        <p className={styles.subtitle}>
          Imagem de satélite com pontos aproximados. A base do mapa precisa de internet.
        </p>

        <div className={styles.filterWrapper}>
          <div className={styles.filterControls} role="group" aria-label="Filtrar pontos no mapa">
            <button
              type="button"
              className={`${styles.filterChip} ${activeFilters.length === 0 ? styles.filterChipActive : ''}`}
              aria-pressed={activeFilters.length === 0}
              onClick={() => setActiveFilters([])}
            >Todos</button>
            {filterOptions.map((filter) => {
              const isActive = activeFilters.includes(filter.id);
              return (
                <button
                  key={filter.id}
                  type="button"
                  className={`${styles.filterChip} ${isActive ? styles.filterChipActive : ''}`}
                  aria-pressed={isActive}
                  onClick={() => setActiveFilters((current) => isActive
                    ? current.filter((id) => id !== filter.id)
                    : [...current, filter.id])}
                >{filter.label}</button>
              );
            })}
          </div>
        </div>
      </header>

      <main className={styles.mainContent} role="main" aria-label="Mapa e pontos de interesse">
        <section className={styles.searchSection} aria-label="Buscar lugar e traçar rota">
          <form className={styles.searchForm} onSubmit={handleRouteSearch}>
            <label htmlFor="park-destination" className={styles.searchLabel}>Para onde você quer ir?</label>
            <label htmlFor="route-origin" className={styles.originLabel}>Ponto de partida</label>
            <select
              id="route-origin"
              className={styles.originSelect}
              value={originId}
              onChange={(event) => setOriginId(event.target.value)}
            >
              <option value="gps">Minha localização atual</option>
              {parkEntries.map((entry) => <option key={entry.id} value={entry.id}>{entry.nome}</option>)}
            </select>
            <div className={styles.searchControls}>
              <div className={styles.searchInputWrap}>
                <Search size={19} aria-hidden="true" />
                <input
                  id="park-destination"
                  type="search"
                  value={searchQuery}
                  placeholder="Ex.: banheiro acessível, entrada, lixeira"
                  autoComplete="off"
                  onChange={(event) => {
                    setSearchQuery(event.target.value);
                    setDestinationId('');
                    setRoute(null);
                    setRouteError('');
                  }}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className={styles.clearSearch}
                    aria-label="Limpar busca"
                    onClick={() => {
                      setSearchQuery('');
                      setDestinationId('');
                      setRoute(null);
                      setRouteError('');
                    }}
                  >
                    <X size={17} aria-hidden="true" />
                  </button>
                )}
              </div>
              <button type="submit" className={styles.routeButton} disabled={routeLoading || !searchQuery.trim()}>
                {wasteMatches.length > 0 && searchResults.length === 0
                  ? <BookOpen size={17} aria-hidden="true" />
                  : <Navigation size={17} aria-hidden="true" />}
                {routeLoading ? 'Calculando...' : wasteMatches.length > 0 && searchResults.length === 0 ? 'Abrir guia' : 'Traçar rota'}
              </button>
            </div>
          </form>

          {searchQuery.trim() && !destinationId && (
            <div className={styles.searchResults} aria-label="Sugestões de lugares encontrados">
              {searchResults.length > 0 && (
                <section className={styles.suggestionGroup} aria-label="Locais no parque">
                  <h2>Locais no parque</h2>
                  {searchResults.slice(0, 5).map((point) => (
                    <div key={point.id} className={styles.searchResultRow}>
                      <button
                        type="button"
                        aria-pressed={point.id === destinationId}
                        className={styles.searchResult}
                        onClick={() => selectDestination(point)}
                      >
                        <MapPin size={17} aria-hidden="true" />
                        <span><strong>{point.nome}</strong><small>{point.tipo}</small></span>
                      </button>
                      <button
                        type="button"
                        className={styles.favoriteButton}
                        aria-label={`${favoritePointIds.includes(point.id) ? 'Remover dos' : 'Adicionar aos'} favoritos: ${point.nome}`}
                        aria-pressed={favoritePointIds.includes(point.id)}
                        onClick={() => toggleFavoritePoint(point.id)}
                      >
                        <Star size={17} fill={favoritePointIds.includes(point.id) ? 'currentColor' : 'none'} aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                </section>
              )}
              {wasteMatches.length > 0 && (
                <section className={styles.suggestionGroup} aria-label="Materiais no guia de descarte">
                  <h2>Guia de descarte</h2>
                  {wasteMatches.map(({ item, category, canDiscard }) => (
                    <button
                      key={`${category.cor}-${item}`}
                      type="button"
                      className={styles.wasteSuggestion}
                      onClick={() => {
                        setActiveWasteColor(category.cor);
                        navigate('/descarte');
                      }}
                    >
                      <BookOpen size={17} aria-hidden="true" />
                      <span>
                        <strong>{item}</strong>
                        <small>{canDiscard ? `Vai na lixeira ${category.cor}` : `Não vai na lixeira ${category.cor}`} · {category.material}</small>
                      </span>
                    </button>
                  ))}
                </section>
              )}
              {searchResults.length === 0 && wasteMatches.length === 0 && (
                <p className={styles.noSearchResults}>Não encontrei esse local ou material. Tente “banheiro”, “entrada”, “garrafa” ou “lixeira”.</p>
              )}
            </div>
          )}

          {!searchQuery.trim() && (favoritePoints.length > 0 || recentPoints.length > 0) && (
            <div className={styles.savedPlaces}>
              {favoritePoints.length > 0 && (
                <section aria-label="Lugares favoritos">
                  <h2><Star size={15} aria-hidden="true" /> Favoritos</h2>
                  {favoritePoints.slice(0, 3).map((point) => renderPointChoice(point, 'favorite'))}
                </section>
              )}
              {recentPoints.length > 0 && (
                <section aria-label="Buscas recentes">
                  <h2><History size={15} aria-hidden="true" /> Recentes</h2>
                  {recentPoints.slice(0, 3).map((point) => renderPointChoice(point, 'recent'))}
                </section>
              )}
            </div>
          )}

          {route && destination && (
            <div className={styles.routeSummary} role="status" aria-live="polite">
              <div>
                <strong>Rota a pé até {destination.nome}</strong>
                <span>{route.distanceKm.toFixed(1)} km · <Clock3 size={14} aria-hidden="true" /> cerca de {route.durationMinutes} min</span>
                <small>Estimativa do serviço de rotas; acessibilidade do trajeto não confirmada.</small>
              </div>
              <button type="button" className={styles.clearRoute} onClick={() => setRoute(null)} aria-label="Limpar rota">
                <X size={18} aria-hidden="true" />
              </button>
            </div>
          )}

          {routeError && <p className={styles.routeError} role="alert">{routeError}</p>}
        </section>

        <section className={styles.mapSection} aria-label="Mapa visual do parque">
          <div className={styles.mapContainer} ref={mapViewportRef}>
            <div className={styles.layerSwitch} role="group" aria-label="Tipo de mapa">
              <button
                type="button"
                className={mapStyle === 'satellite' ? styles.layerActive : ''}
                aria-pressed={mapStyle === 'satellite'}
                onClick={() => setMapStyle('satellite')}
              >
                Satélite
              </button>
              <button
                type="button"
                className={mapStyle === 'streets' ? styles.layerActive : ''}
                aria-pressed={mapStyle === 'streets'}
                onClick={() => setMapStyle('streets')}
              >
                Ruas
              </button>
            </div>

            <div className={styles.mapTools}>
              <button
                type="button"
                className={styles.mapTool}
                title="Usar minha localização"
                aria-label="Usar minha localização"
                onClick={() => {
                  setLocationError('');
                  if (!navigator.geolocation) {
                    setLocationError('Este navegador não oferece localização.');
                    return;
                  }
                  navigator.geolocation.getCurrentPosition(
                    ({ coords }) => setUserLocation([coords.latitude, coords.longitude]),
                    () => setLocationError('Não foi possível acessar sua localização.'),
                    { enableHighAccuracy: true, timeout: 10000 },
                  );
                }}
              >
                <LocateFixed size={19} aria-hidden="true" />
              </button>
              <button
                type="button"
                className={styles.mapTool}
                title={isFullscreen ? 'Sair da tela cheia' : 'Abrir em tela cheia'}
                aria-label={isFullscreen ? 'Sair da tela cheia' : 'Abrir em tela cheia'}
                onClick={() => {
                  if (document.fullscreenElement) void document.exitFullscreen();
                  else void mapViewportRef.current?.requestFullscreen();
                }}
              >
                {isFullscreen ? <Minimize size={19} aria-hidden="true" /> : <Maximize size={19} aria-hidden="true" />}
              </button>
            </div>

            <MapContainer
              center={parkCenter}
              zoom={15}
              minZoom={12}
              maxZoom={19}
              zoomControl={false}
              scrollWheelZoom
              className={styles.leafletMap}
              aria-label="Mapa interativo do Parque Ecológico de Águas Claras"
            >
              <MapController selectedPoint={selectedPoint} route={route} resetKey={resetKey} userLocation={userLocation} reduceMotion={reduceMotion} />
              <TileLayer
                key={mapStyle}
                url={activeTiles.url}
                attribution={activeTiles.attribution}
                maxZoom={19}
              />
              <ZoomControl position="topright" />
              {filteredPontos.map((point) => (
                <Marker
                  key={point.id}
                  position={[point.lat, point.lng]}
                  icon={markerIcons.get(point.id)}
                  eventHandlers={{ click: () => setSelectedPointId(point.id) }}
                >
                  <Popup>
                    <div className={styles.popupContent}>
                      <strong>{point.nome}</strong>
                      <span>{point.descricao}</span>
                      <span className={styles.popupStatus}>Status: {point.status.replaceAll('_', ' ')}</span>
                      <a href={`https://www.google.com/maps/dir/?api=1&destination=${point.lat},${point.lng}`} target="_blank" rel="noreferrer">
                        Abrir rota
                      </a>
                    </div>
                  </Popup>
                </Marker>
              ))}
              {route && (
                <Polyline
                  positions={route.coordinates}
                  pathOptions={{ color: '#f5c400', weight: 7, opacity: 0.95, lineCap: 'round', lineJoin: 'round' }}
                />
              )}
              {userLocation && (
                <CircleMarker
                  center={userLocation}
                  radius={8}
                  pathOptions={{ color: '#ffffff', fillColor: '#1877f2', fillOpacity: 1, weight: 3 }}
                >
                  <Popup>Você está aqui</Popup>
                </CircleMarker>
              )}
            </MapContainer>

            <button
              type="button"
              className={styles.resetMap}
              onClick={() => {
                setSelectedPointId(null);
                setResetKey((current) => current + 1);
              }}
            >
              <Compass size={16} aria-hidden="true" />
              Parque
            </button>
            {locationError && <p className={styles.mapMessage} role="status">{locationError}</p>}
          </div>
          <div className={styles.mapNotes}>
            <div className={styles.mapLegend} aria-label="Legenda dos pontos">
              <span><i className={styles.legendGreen} /> Acessível informado</span>
              <span><i className={styles.legendBlue} /> Ponto de apoio</span>
              <span><i className={styles.legendRed} /> Atenção</span>
            </div>
            <p className={styles.mapCaption}>
              {pontosData?._meta?.ultima_atualizacao
                ? `Dados atualizados em ${new Date(`${pontosData._meta.ultima_atualizacao}T12:00:00`).toLocaleDateString('pt-BR')}. `
                : 'Data de atualização não informada. '}
              {pontosData?._meta?.coordenadas_nota ?? 'Coordenadas aproximadas; confirme os locais em campo.'}
            </p>
            <p className={styles.onlineNotice} role="status">
              {isOnline
                ? 'Rotas dependem de internet e da autorização de localização.'
                : 'Sem conexão: mapa e dados em cache podem funcionar, mas não é possível calcular rotas.'}
            </p>
          </div>
        </section>

        {/* Lista de Pontos */}
        <section className={styles.pointsListSection} aria-label="Lista de pontos de interesse">
          <div className={styles.listHeader}>
            <h2 className={styles.sectionTitle}>
              Pontos encontrados ({filteredPontos.length})
            </h2>
            <span className={styles.listHelp}>Toque para detalhes</span>
          </div>

          {loading && (
            <div className={styles.loadingBox} role="status">
              Carregando pontos do parque...
            </div>
          )}

          <div className={styles.pointsGrid}>
            {filteredPontos.map((p) => {
              const isSelected = selectedPointId === p.id;
              return (
                <Card
                  key={p.id}
                  onClick={() => setSelectedPointId(isSelected ? null : p.id)}
                  ariaLabel={`Ponto ${p.nome}, status: ${p.status}`}
                  className={`${styles.pointCard} ${isSelected ? styles.selectedCard : ''}`}
                >
                  <div className={styles.pointCardHeader}>
                    <div className={styles.pointTitleGroup}>
                      <MapPin size={20} className={styles.pinIcon} aria-hidden="true" />
                      <div>
                        <h3 className={styles.pointName}>{p.nome}</h3>
                        <span className={styles.pointType}>
                          Tipo: {p.tipo} · {p.lat.toFixed(4)}, {p.lng.toFixed(4)} (aproximado)
                        </span>
                      </div>
                    </div>
                    <StatusBadge status={p.status as Status} />
                  </div>

                  <p className={styles.pointDesc}>{p.descricao}</p>

                  <div className={styles.pointFooter}>
                    {p.acessivel ? (
                      <span className={styles.accessBadge}>
                        <CheckCircle size={14} aria-hidden="true" />
                        Acessível PCD
                      </span>
                    ) : (
                      <span className={styles.alertNoticeBadge}>
                        <AlertTriangle size={14} aria-hidden="true" />
                        Atenção ao terreno
                      </span>
                    )}

                    <a
                      className={styles.directionsButton}
                      href={`https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Navigation size={14} aria-hidden="true" />
                      Como chegar
                    </a>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
