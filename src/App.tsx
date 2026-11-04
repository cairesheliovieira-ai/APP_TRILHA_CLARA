import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './theme/theme-context';

// Import Screens
import Entrada from './screens/01-Entrada/Entrada';
import Inicio from './screens/02-Inicio/Inicio';
import Mapa from './screens/03-Mapa/Mapa';
import Acessibilidade from './screens/04-Acessibilidade/Acessibilidade';
import Descarte from './screens/05-Descarte/Descarte';
import DenunciaPasso1 from './screens/06-DenunciaPasso1/DenunciaPasso1';
import DenunciaPasso2 from './screens/07-DenunciaPasso2/DenunciaPasso2';
import DenunciaConfirmacao from './screens/08-DenunciaConfirmacao/DenunciaConfirmacao';
import Ajustes from './screens/09-Ajustes/Ajustes';
import AlertaCapivaras from './screens/10-AlertaCapivaras/AlertaCapivaras';
import Fauna from './screens/11-Fauna/Fauna';
import FichaAnimal from './screens/12-FichaAnimal/FichaAnimal';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* 1. Entrada / Onboarding */}
          <Route path="/" element={<Entrada />} />

          {/* 2. Início */}
          <Route path="/inicio" element={<Inicio />} />

          {/* 3. Mapa do Parque */}
          <Route path="/mapa" element={<Mapa />} />

          {/* 4. Acessibilidade */}
          <Route path="/acessibilidade" element={<Acessibilidade />} />

          {/* 5. Descarte Correto */}
          <Route path="/descarte" element={<Descarte />} />

          {/* 6. Denúncia Passo 1 */}
          <Route path="/denuncia" element={<DenunciaPasso1 />} />

          {/* 7. Denúncia Passo 2 */}
          <Route path="/denuncia/detalhes" element={<DenunciaPasso2 />} />

          {/* 8. Confirmação com Protocolo */}
          <Route path="/denuncia/confirmacao" element={<DenunciaConfirmacao />} />

          {/* 9. Ajustes de Acessibilidade */}
          <Route path="/ajustes" element={<Ajustes />} />

          {/* 10. Alerta de Capivaras */}
          <Route path="/alerta-capivaras" element={<AlertaCapivaras />} />

          {/* 11. Fauna do Parque */}
          <Route path="/fauna" element={<Fauna />} />

          {/* 12. Ficha do Animal */}
          <Route path="/fauna/:id" element={<FichaAnimal />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
