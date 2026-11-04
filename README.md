# 🌿 Trilha Clara — Parque Ecológico de Águas Claras (DF)

Guia de cuidado, acessibilidade e fauna para frequentadores do **Parque Ecológico de Águas Claras (Brasília-DF)**. Desenvolvido com foco total em inclusão, privacidade e funcionamento offline.

---

## 🌟 O Que Torna o Trilha Clara Diferente

* **Acessibilidade em primeiro lugar**: Rotas acessíveis, status de banheiros PCD, rampas, vagas preferenciais e piso tátil. Modos de **Alto Contraste** (preto e amarelo), **Texto Maior (+30%)**, **Reduzir Animações** e compatibilidade com leitores de tela (TalkBack/VoiceOver).
* **Sem cadastro e sem login**: Abra e use imediatamente. Não pede nome, e-mail, telefone nem senha.
* **100% Funcional Offline**: Mapa esquemático em SVG vetorial (sem violar a política de tiles do OpenStreetMap), guia de descarte, catálogo de fauna e avisos ficam em cache local no navegador/dispositivo.
* **Descarte Correto (Padrão CONAMA)**: Seletor das 6 cores de lixeira (Azul, Vermelho, Amarelo, Verde, Marrom, Cinza) com listas objetivas de *"Vai"* e *"Não vai"*, além da dica da mochila.
* **Fauna e Segurança**: Alerta educativo de capivaras com as 4 regras essenciais de respeito e convivência, além de fichas detalhadas de animais (o que comem, características, curiosidades e como agir ao avistar).
* **Denúncia Ética e Eficiente em 2 Passos**: Lixo espalhado, lixeira cheia, animal em risco, foco de fogo ou trilha danificada. Gera protocolo rastreável (`TC-YYYYMMDD-XXXX`) e remove metadados EXIF/GPS de fotos antes de enviar.
* **Estado Nunca Só por Cor**: Todos os indicadores de status combinam **ícone + texto** (*Disponível*, *Pode lotar*, *Precisa de atenção*).

---

## 📱 As 12 Telas Implementadas

| # | Tela | Rota | Descrição |
|---|---|---|---|
| 1 | **Entrada** | `/` | Boas-vindas com os 3 benefícios do parque e entrada direta |
| 2 | **Início** | `/inicio` | Avisos oficiais, alerta de capivaras e 5 atalhos de serviços |
| 3 | **Mapa do Parque** | `/mapa` | Mapa esquemático SVG com filtros (Todos, Acessibilidade, Coleta, Alertas) |
| 4 | **Acessibilidade** | `/acessibilidade` | Status de sanitários PCD, vagas, rampas e botão "Relatar uma barreira" |
| 5 | **Descarte Correto** | `/descarte` | Guia interativo das 6 cores com o que vai e o que não vai |
| 6 | **Denúncia: Passo 1** | `/denuncia` | Seleção do tipo de ocorrência, localização e botão "Usar GPS" |
| 7 | **Denúncia: Passo 2** | `/denuncia/detalhes` | Descrição, foto com remoção automática de EXIF e opção anônima |
| 8 | **Confirmação** | `/denuncia/confirmacao` | Protocolo oficial e linha do tempo de 3 etapas (*Recebida → Em análise → Resolvida*) |
| 9 | **Ajustes de Acessibilidade** | `/ajustes` | Alto contraste, texto ampliado, reduzir movimento e histórico de denúncias |
| 10 | **Alerta de Capivaras** | `/alerta-capivaras` | 4 regras de ouro de convivência pacífica com a fauna |
| 11 | **Fauna do Parque** | `/fauna` | Catálogo de mamíferos, aves e répteis com destaque "Mais vista hoje" |
| 12 | **Ficha do Animal** | `/fauna/:id` | Ficha científica com orientação de como agir e fonte oficial |

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos
* Node.js v20+ ou v22 LTS

### 1. Instalar dependências
```bash
npm install
```

### 2. Rodar em modo de desenvolvimento
```bash
npm run dev
```
Acesse no seu navegador em `http://localhost:5173`.

### 3. Gerar build de produção
```bash
npm run build
```
Os arquivos otimizados serão gerados na pasta `dist/`.

### 4. Visualizar o build localmente
```bash
npm run preview
```

---

## 📂 Como o Gestor do Parque Atualiza os Dados (Sem Mexer no Código)

Todos os dados do parque estão isolados na pasta `/public/data/` em formato JSON legível:

### 1. Pontos do Mapa (`public/data/pontos.json`)
Adicione ou edite pontos de interesse, banheiros e lixeiras:
```json
{
  "id": "banheiro-central",
  "nome": "Banheiro acessível (PCD)",
  "tipo": "banheiro",
  "descricao": "Barra de apoio e pia rebaixada",
  "acessivel": true,
  "lat": -15.8398,
  "lng": -48.0252,
  "status": "disponivel",
  "icone": "bath"
}
```

### 2. Guia de Resíduos (`public/data/residuos.json`)
Adicione novos itens permitidos ou proibidos para cada cor de lixeira (azul, vermelho, amarelo, verde, marrom, cinza).

### 3. Animais Catalogados (`public/data/fauna.json`)
Atualize o animal em destaque (`mais_vista_hoje: true`) ou inclua novas espécies avistadas com sua respectiva orientação de comportamento (`como_agir`).

### 4. Avisos Oficiais (`public/data/avisos.json`)
Cadastre alertas de queimada, obras na trilha ou eventos:
```json
{
  "id": "aviso-iluminacao",
  "tipo": "alerta",
  "titulo": "Trecho com pouca iluminação",
  "mensagem": "Prefira a rota pavimentada norte após as 18h.",
  "acao_texto": "Ver rotas mais seguras",
  "acao_rota": "/mapa",
  "ativo": true
}
```

---

## 📦 Como Gerar APK / PWA

### Opção 1: Como PWA (Sem Loja de Aplicativos)
1. Faça o deploy da pasta `dist/` em qualquer servidor HTTPS estático (Vercel, Netlify, Cloudflare Pages, GitHub Pages).
2. Abra o link no Chrome (Android) ou Safari (iOS).
3. Toque no menu do navegador e selecione **"Adicionar à Tela de Início"** ou **"Instalar aplicativo"**.
4. O app será instalado no celular com ícone próprio e funcionará 100% offline via Service Worker.

### Opção 2: Gerar APK nativo via Capacitor
Se desejar gerar um arquivo APK para distribuição:
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "Trilha Clara" "br.gov.df.trilhaclara" --web-dir dist
npm run build
npx cap add android
npx cap open android
```
No Android Studio aberto, vá em **Build > Build Bundle(s) / APK(s) > Build APK(s)**.

---

## ♿ Conformidade de Acessibilidade (WCAG 2.1 AA)

* **Contraste de Cores**: Modo padrão alcança contraste de 5.2:1 (superior ao mínimo de 4.5:1). O modo **Alto Contraste** preto e amarelo atinge 14.8:1.
* **Tipografia**: Utiliza a fonte **Atkinson Hyperlegible Next**, criada especialmente pela Braille Institute para maximizar a distinção entre caracteres.
* **Alvos de Toque**: Todos os botões, chips e abas possuem altura mínima de **48px** para atender a pessoas com deficiência motora.
* **Leitores de Tela**: Suporte completo a TalkBack e VoiceOver, com `aria-label`, `role="tablist"`, `role="switch"`, `aria-checked` e textos descritivos nos ícones.
* **Semântica de Estado**: Indicadores nunca dependem apenas de cores; combinam ícones padronizados e texto legível.
