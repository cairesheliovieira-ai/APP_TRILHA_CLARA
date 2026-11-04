import { useState, useRef, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, 
  Trash2, 
  ShieldCheck, 
  ArrowLeft, 
  Send
} from 'lucide-react';
import { useAppStore, type Denuncia } from '../../store/app-store';
import { stripExifFromFile, gerarProtocolo } from '../../utils/exif-strip';
import Button from '../../components/Button/Button';
import BottomNav from '../../components/BottomNav/BottomNav';
import styles from './DenunciaPasso2.module.css';

export default function DenunciaPasso2() {
  const navigate = useNavigate();
  const draft = useAppStore((state) => state.reportDraft);
  const setReportDraft = useAppStore((state) => state.setReportDraft);
  const addDenuncia = useAppStore((state) => state.addDenuncia);

  const [detalhes, setDetalhes] = useState(draft?.detalhes || '');
  const [fotoBase64, setFotoBase64] = useState<string | undefined>(draft?.foto);
  const [anonima, setAnonima] = useState(draft?.anonima ?? true);
  const [processingPhoto, setProcessingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProcessingPhoto(true);
    setPhotoError(null);

    try {
      const cleanBase64 = await stripExifFromFile(file);
      setFotoBase64(cleanBase64);
      setProcessingPhoto(false);
    } catch (err: unknown) {
      setProcessingPhoto(false);
      setPhotoError('Falha ao higienizar imagem. Tente outra foto.');
    }
  };

  const handleRemovePhoto = () => {
    setFotoBase64(undefined);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = () => {
    if (!draft?.tipo || !draft?.local) {
      navigate('/denuncia');
      return;
    }

    const protocolo = gerarProtocolo();
    const now = new Date().toISOString();

    const novaDenuncia: Denuncia = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      tipo: draft.tipo,
      local: draft.local,
      usarLocalizacao: Boolean(draft.usarLocalizacao),
      coordenadas: draft.coordenadas,
      detalhes: detalhes.trim() || 'Sem detalhes adicionais informados.',
      foto: fotoBase64,
      anonima,
      protocolo,
      status: 'recebida',
      criadaEm: now,
      atualizadaEm: now,
    };

    addDenuncia(novaDenuncia);
    setReportDraft(null);
    navigate('/denuncia/confirmacao');
  };

  return (
    <div className={styles.screenWrapper}>
      <header className={styles.header}>
        <div className={styles.headerTitleGroup}>
          <button
            type="button"
            className={styles.backBtn}
            onClick={() => navigate('/denuncia')}
            aria-label="Voltar para o passo 1"
          >
            <ArrowLeft size={22} />
          </button>
          <div>
            <h1 className={styles.title}>Fazer denúncia</h1>
            <span className={styles.stepBadge}>Passo 2 de 2 • Detalhes e envio</span>
          </div>
        </div>

        {/* Barra de Progresso Acessível */}
        <div 
          className={styles.progressBar} 
          role="progressbar" 
          aria-valuenow={100} 
          aria-valuemin={0} 
          aria-valuemax={100}
          aria-label="Progresso da denúncia: 100%"
        >
          <div className={styles.progressFill} style={{ width: '100%' }} />
        </div>
      </header>

      <main className={styles.mainContent} role="main" aria-label="Formulário de denúncia - Passo 2">
        {/* Resumo do Passo 1 */}
        <div className={styles.summaryCard} aria-label="Resumo do tipo e local">
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Tipo selecionado:</span>
            <strong>{draft?.tipo || 'Não especificado'}</strong>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Local:</span>
            <span>{draft?.local || 'Não especificado'}</span>
          </div>
        </div>

        {/* Campo Detalhes */}
        <div className={styles.inputGroup}>
          <label htmlFor="detalhes-input" className={styles.label}>
            Descreva o que você viu (opcional mas recomendado)
          </label>
          <p className={styles.inputHelp}>
            Ex.: Há garrafas plásticas acumuladas no córrego; poste da iluminação com fios expostos.
          </p>
          <textarea
            id="detalhes-input"
            className={styles.textarea}
            rows={4}
            placeholder="Forneça mais informações que ajudem a equipe do parque..."
            value={detalhes}
            onChange={(e) => setDetalhes(e.target.value)}
          />
        </div>

        {/* Upload de Foto Higienizada */}
        <div className={styles.photoSection}>
          <span className={styles.label}>Adicionar foto (opcional)</span>
          <p className={styles.inputHelp}>
            Ajuda os fiscais a identificarem o tamanho e material do problema.
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoSelect}
            className="sr-only"
            id="photo-input"
          />

          {!fotoBase64 ? (
            <label htmlFor="photo-input" className={styles.photoUploadBtn}>
              <Camera size={22} className={styles.photoUploadIcon} />
              <span>{processingPhoto ? 'Removendo EXIF...' : 'Tirar ou escolher foto'}</span>
            </label>
          ) : (
            <div className={styles.previewContainer}>
              <img
                src={fotoBase64}
                alt="Foto anexada à denúncia com metadados EXIF removidos"
                className={styles.photoPreview}
              />
              <button
                type="button"
                className={styles.removePhotoBtn}
                onClick={handleRemovePhoto}
                aria-label="Remover foto anexada"
              >
                <Trash2 size={18} />
                <span>Remover foto</span>
              </button>
            </div>
          )}

          {photoError && <span className={styles.errorText}>{photoError}</span>}

          {/* Aviso de Privacidade da Foto */}
          <div className={styles.exifNotice}>
            <ShieldCheck size={18} className={styles.shieldIcon} aria-hidden="true" />
            <p>
              <strong>Privacidade garantida:</strong> Metadados EXIF, dados de lente e geolocalização do arquivo de imagem são removidos no seu navegador antes do envio.
            </p>
          </div>
        </div>

        {/* Opção Anônima */}
        <div className={styles.anonimatoBox}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={anonima}
              onChange={(e) => setAnonima(e.target.checked)}
            />
            <div className={styles.checkboxInfo}>
              <strong>Enviar sem me identificar (denúncia anônima)</strong>
              <p>Não coletamos seu nome, e-mail, telefone nem IP.</p>
            </div>
          </label>
        </div>

        {/* Botão de Envio */}
        <div className={styles.actions}>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            icon={<Send size={18} />}
            onClick={handleSubmit}
            ariaLabel="Enviar denúncia agora"
          >
            Enviar denúncia
          </Button>

          <Button
            variant="ghost"
            size="md"
            fullWidth
            onClick={() => navigate('/denuncia')}
            ariaLabel="Voltar para o passo 1"
          >
            Voltar e alterar local
          </Button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
