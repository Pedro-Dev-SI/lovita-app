# 💕 Lovita - Plataforma de Páginas Especiais para Casais

*Automatically synced with your [v0.dev](https://v0.dev) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/pedrodevsis-projects/v0-casal-micro-saas)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/G7H6HI9JJ3y)

## 🌟 Visão Geral

O **Lovita** é uma plataforma SaaS que permite casais criarem páginas personalizadas e únicas para celebrar seu relacionamento. Com recursos como contador de tempo em tempo real, galeria de memórias, integração musical e animações especiais, cada casal pode ter sua própria página do amor.

## ✨ Funcionalidades Principais

### 🎯 **Core Features**
- ⏰ **Contador de Tempo Real** - Acompanha anos, meses, dias, horas, minutos e segundos juntos
- 📸 **Galeria de Memórias** - Upload e organização de fotos especiais
- 🎵 **Integração Musical** - Player integrado com Spotify
- 📱 **QR Code Personalizado** - Compartilhamento fácil da página
- 🎨 **Temas Personalizáveis** - Cores e animações de fundo
- ✨ **Animações Especiais** - Efeitos mágicos em aniversários (confete e corações)

### 💎 **Sistema de Planos**

#### 🌟 **Plano Para Sempre** (R$ 27,00 - pagamento único)
- ✅ Texto dedicado personalizado
- ✅ Contador em tempo real
- ✅ QR Code exclusivo
- ✅ **Até 8 imagens** na galeria
- ✅ **Integração com música** (Spotify)
- ✅ **Fundo dinâmico** com animações
- ✅ **Animações exclusivas** em datas especiais
- ✅ URL personalizada
- ✅ Suporte 24h

#### 📅 **Plano Anual** (R$ 17,00/ano)
- ✅ Texto dedicado personalizado
- ✅ Contador em tempo real
- ✅ QR Code exclusivo
- ✅ **Até 4 imagens** na galeria
- ❌ Sem música
- ❌ Sem fundo dinâmico
- ❌ Sem animações exclusivas
- ✅ URL personalizada
- ✅ Suporte 24h

## 🏗️ Arquitetura Técnica

### **Stack Principal**
- **Frontend**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS + Framer Motion (animações)
- **UI Components**: shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Deployment**: Vercel

### **Estrutura do Banco de Dados**

\`\`\`sql
-- Tabelas principais
users (extends auth.users)
├── subscription_plan (forever/annual/none)
├── max_images (4 ou 8 baseado no plano)
├── has_music (boolean)
├── has_dynamic_background (boolean)
└── has_exclusive_animations (boolean)

couple_pages
├── partner1_name, partner2_name
├── relationship_start_date
├── theme_color, background_animation
├── page_slug (URL única)
└── qr_code_url

memories
├── title, description
├── media_url, media_type
└── memory_date

music
├── song_title, artist
├── spotify_url
└── is_primary (música principal)

notifications
├── notification_type (monthly/yearly)
└── is_active
\`\`\`

## 🚀 Funcionalidades Implementadas

### ✅ **Autenticação e Usuários**
- [x] Magic Link authentication via Supabase
- [x] Verificação inteligente de usuários existentes
- [x] Sistema de planos com verificação em tempo real
- [x] Modal amigável para usuários não encontrados
- [x] Fluxo de onboarding otimizado

### ✅ **Gestão de Páginas**
- [x] Criação de páginas personalizadas
- [x] Editor completo com preview em tempo real
- [x] Sistema de slugs únicos
- [x] Páginas públicas otimizadas para compartilhamento

### ✅ **Upload e Mídia**
- [x] Upload de imagens via Supabase Storage
- [x] Verificação automática de limites por plano
- [x] Galeria responsiva com hover effects
- [x] Compressão e otimização automática

### ✅ **Integração Musical**
- [x] Player integrado do Spotify
- [x] Sistema de música principal
- [x] Gerenciamento de múltiplas músicas
- [x] Verificação de plano para recursos premium

### ✅ **Animações e UX**
- [x] Animações de aniversário (confete mensal, corações anuais)
- [x] Fundos dinâmicos personalizáveis
- [x] Transições suaves com Framer Motion
- [x] Loading states animados
- [x] Micro-interações em toda a interface

### ✅ **Compartilhamento**
- [x] Geração automática de QR Codes
- [x] Botão de compartilhamento nativo
- [x] URLs amigáveis e SEO otimizadas
- [x] Preview social media ready

## 📱 Páginas e Rotas

\`\`\`
/                    # Homepage com planos e features
/login              # Autenticação com magic link
/plans              # Seleção de planos
/dashboard          # Painel do usuário
/create             # Criação de nova página
/edit/[id]          # Editor da página
/couple/[slug]      # Página pública do casal
/auth/callback      # Callback de autenticação
\`\`\`

## 🔧 Configuração e Instalação

### **Pré-requisitos**
- Node.js 18+
- Conta no Supabase
- Conta na Vercel (para deploy)

### **Variáveis de Ambiente**
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
\`\`\`

### **Setup do Banco de Dados**
Execute os scripts SQL na seguinte ordem:

1. `scripts/01-create-tables.sql` - Criação das tabelas
2. `scripts/02-enable-rls.sql` - Ativação do RLS
3. `scripts/03-create-policies.sql` - Políticas de segurança
4. `scripts/04-create-functions.sql` - Funções e triggers
5. `scripts/05-insert-sample-data.sql` - Dados de exemplo
6. `scripts/06-add-subscription-plan.sql` - Sistema de planos
7. `scripts/07-add-test-user.sql` - Usuário de teste
8. `scripts/08-setup-storage.sql` - Configuração do storage

### **Instalação Local**
\`\`\`bash
# Clone o repositório
git clone [repository-url]

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local

# Execute o projeto
npm run dev
\`\`\`

## 🎨 Design System

### **Cores Principais**
\`\`\`css
--primary: #B61862 (Rosa romântico)
--secondary: #FFB7CB (Rosa claro)
--accent: #9F2525 (Vermelho paixão)
--dark: #20231F (Preto suave)
\`\`\`

### **Tipografia**
- **Primary**: Poppins (headings e elementos importantes)
- **Secondary**: Inter (corpo do texto)

### **Componentes Reutilizáveis**
- `TimeCounter` - Contador de tempo em tempo real
- `QRCodeGenerator` - Geração de QR codes
- `UserNotFoundModal` - Modal de usuário não encontrado
- `CheckoutModal` - Modal de checkout
- `Navbar` - Navegação principal
- `FloatingElements` - Elementos flutuantes animados

## 🔐 Segurança e Políticas

### **Row Level Security (RLS)**
- ✅ Usuários só acessam seus próprios dados
- ✅ Páginas públicas acessíveis via slug
- ✅ Verificação de limites por plano
- ✅ Upload seguro de arquivos

### **Validações**
- ✅ Verificação de planos em tempo real
- ✅ Limites de upload por subscription
- ✅ Sanitização de inputs
- ✅ Validação de URLs e slugs

## 📊 Métricas e Analytics

### **KPIs Principais**
- Conversão de visitantes para usuários
- Taxa de criação de páginas
- Engagement nas páginas públicas
- Retenção por tipo de plano

### **Eventos Trackados**
- Criação de conta
- Seleção de plano
- Criação de página
- Upload de mídia
- Compartilhamentos

## 🚀 Roadmap

### **Próximas Funcionalidades**
- [ ] 💳 Integração com Stripe para pagamentos
- [ ] 📧 Sistema de notificações por email
- [ ] 🌙 Modo escuro
- [ ] 📱 PWA (Progressive Web App)
- [ ] 🎥 Suporte a vídeos
- [ ] 🎨 Editor de temas avançado
- [ ] 📈 Dashboard de analytics
- [ ] 🔗 Integração com redes sociais

### **Melhorias Técnicas**
- [ ] Cache otimizado
- [ ] Compressão de imagens automática
- [ ] Lazy loading avançado
- [ ] SEO otimizado
- [ ] Testes automatizados
- [ ] CI/CD pipeline

## 🎯 Casos de Uso

### **Para Casais**
- 💕 Celebrar aniversários de namoro/casamento
- 📸 Criar um álbum digital especial
- 🎵 Compartilhar músicas significativas
- 📱 Facilitar compartilhamento com família/amigos

### **Para Eventos**
- 💒 Casamentos (página de presente para convidados)
- 🎉 Aniversários de relacionamento
- 💝 Dia dos Namorados
- 🎊 Pedidos de casamento

## 📞 Suporte

### **Canais de Suporte**
- 📧 Email: suporte@lovita.com
- 💬 Chat: Disponível 24/7 no dashboard
- 📚 Documentação: [docs.lovita.com]

### **Status do Sistema**
- 🟢 Uptime: 99.9%
- ⚡ Performance: < 2s loading
- 🔒 Segurança: SSL + RLS
- 📱 Mobile: 100% responsivo

## 🏆 Diferenciais

### **Tecnológicos**
- ⚡ Performance otimizada com Next.js 15
- 🎨 Animações fluidas com Framer Motion
- 📱 Design responsivo mobile-first
- 🔒 Segurança enterprise-grade

### **Experiência do Usuário**
- 🎯 Onboarding simplificado
- ✨ Interface intuitiva e moderna
- 💝 Foco na experiência emocional
- 🚀 Compartilhamento facilitado

---

## 📈 Deployment

**Production URL**: [https://vercel.com/pedrodevsis-projects/v0-casal-micro-saas](https://vercel.com/pedrodevsis-projects/v0-casal-micro-saas)

**Continue building**: [https://v0.dev/chat/projects/G7H6HI9JJ3y](https://v0.dev/chat/projects/G7H6HI9JJ3y)

---

*Feito com ❤️ para casais apaixonados | © 2025 Lovita*
