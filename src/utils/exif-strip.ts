/**
 * Remove EXIF e metadados de localização de imagens
 * antes de enviar na denúncia.
 * Reprocessa via canvas para garantir que nenhum
 * metadado é preservado.
 */
export async function stripExifFromFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas not supported'));
        return;
      }

      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);

      // Convert to base64 without EXIF
      const cleanBase64 = canvas.toDataURL('image/jpeg', 0.8);
      resolve(cleanBase64);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Não foi possível processar a imagem'));
    };

    img.src = url;
  });
}

/**
 * Gera um protocolo único para denúncia
 * Formato: TC-YYYYMMDD-XXXX
 */
export function gerarProtocolo(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `TC-${date}-${rand}`;
}
