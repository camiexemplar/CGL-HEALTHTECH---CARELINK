# CGL HealthTech - Plataforma

Sistema de gestão hospitalar desenvolvido para o Hospital das Clínicas, proporcionando uma plataforma digital segura e eficiente para gerenciamento de informações de pacientes, dashboards de gestão e alertas de consultas.

## Descrição do Projeto

O CGL HealthTech é uma plataforma que integra funcionalidades essenciais para profissionais de saúde e gestores, oferecendo:

  - Gerenciamento de informações de pacientes
  - Dashboards de métricas em tempo real
  - Sistema de alertas e notificações de lembretes

## Funcionalidades Principais

### Públicas

  - Home Page – Apresentação da plataforma
  - FAQ – Perguntas frequentes
  - Contato – Formulário de contato
  - Integrantes – Informações da equipe
  - Login – Autenticação de usuários

### Protegidas (Requer Autenticação)

  - Dashboard – Painel principal com métricas e indicadores
  - Importar Dados – Upload de arquivos de pacientes
  - Validação – Validação de dados médicos
  - Histórico – Histórico completo de pacientes
  - Alertas – Sistema de alertas e notificações

## Tecnologias Utilizadas

  - **Frontend:** React 18 + TypeScript
  - **Roteamento:** React Router DOM
  - **Build Tool:** Vite
  - **Estilização:** Tailwind CSS
  - **Gerenciamento de Estado:** Context API
  - **Tratamento de Erros:** React Error Boundary

## Integrantes

  - Lucas Nunes Soares – RM566503
  - Gustavo Pinheiro de Oliveira – RM566358
  - Camily Vitoria Pereira Maciel – RM566520

## Recursos Visuais

### Logotipos e Identidade Visual

  - `logo.png`, `logodois.png`, `logoextendida.png` - Logotipos da plataforma
  - `coracao.png` - Ícone médico/hospitalar

### Ícones e Elementos de Interface

  - `user.png`, `logout.png` - Ícones de usuário e logout
  - `email.png`, `telefone.png` - Ícones de contato
  - `relogio.png`, `chart.png` - Ícones de tempo e gráficos
  - `seta.jpg` - Ícone de navegação

### Imagens de Conteúdo e Equipe

  - `computer.png` - Ilustração de tecnologia
  - `camily.jpg`, `gustavo.jpg`, `lucas.jpeg` - Fotos dos integrantes
  - `person1.png`, `person2.jpg` - Imagens de usuários
  - `nopicture.png` - Avatar padrão

## Estrutura de Pastas do Projeto

```text
CGL-HealthTech/
├── public/                # Arquivos estáticos públicos
├── src/                   # Código-fonte principal
│   ├── assets/            # Imagens, ícones e fontes
│   │   ├── camily.jpg
│   │   ├── chart.png
│   │   ├── computer.png
│   │   ├── coracao.png
│   │   ├── email.png
│   │   ├── gustavo.jpg
│   │   ├── logo.png
│   │   ├── logodois.png
│   │   ├── logoextendida.png
│   │   ├── logout.png
│   │   ├── lucas.jpeg
│   │   ├── nopicture.png
│   │   ├── person1.png
│   │   ├── person2.jpg
│   │   ├── relogio.png
│   │   ├── seta.jpg
│   │   ├── telefone.png
│   │   └── user.png
│   ├── components/        # Componentes React reutilizáveis
│   │   ├── Home/
│   │   │   ├── FeatureCard.tsx
│   │   │   ├── FeatureCardsSection.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── PublicLayout.tsx
│   │   │   └── PublicNavbar.tsx
│   │   ├── pageCalendar/
│   │   │   ├── AgendamentoService.tsx
│   │   │   ├── CalendarComponent.tsx
│   │   │   ├── SidebarCalendar.tsx
│   │   │   └── dataCalendar.tsx
│   │   ├── pageDashboard/
│   │   │   ├── Hooks/
│   │   │   ├── primeiroBloco/
│   │   │   └── segundoBloco/
│   │   ├── pagePatientHistory/
│   │   ├── ApiService.tsx
│   │   ├── FileUploader.tsx
│   │   ├── Layout.tsx
│   │   ├── Loading.tsx
│   │   ├── ManualUploading.tsx
│   │   ├── PatientHistoryTable.tsx
│   │   ├── PatientList.tsx
│   │   ├── ProcessedData.ts
│   │   ├── ProtectedRoute.tsx
│   │   └── ValidateForm.tsx
│   ├── contexts/          # Contextos React (ex: Autenticação)
│   │   └── AuthContext.tsx
│   ├── pages/             # Páginas da aplicação
│   │   ├── Calendar.tsx
│   │   ├── ContactUs.tsx
│   │   ├── Dashboard.tsx
│   │   ├── FallbackScreen.tsx
│   │   ├── Faq.tsx
│   │   ├── Home.tsx
│   │   ├── NotFound.tsx
│   │   ├── TeamPage.tsx
│   │   ├── UploadFiles.tsx
│   │   ├── historicoPaciente.tsx
│   │   ├── loginPage.tsx
│   │   ├── mainDashboard.tsx
│   │   └── patientAlerts.tsx
│   ├── types/             # Definições de tipos TypeScript
│   ├── App.tsx            # Componente raiz da aplicação
│   ├── index.css          # Estilos globais
│   ├── main.tsx           # Ponto de entrada do React
│   └── vite-env.d.ts      # Tipos específicos do Vite
├── .gitignore             # Arquivos ignorados pelo Git
├── README.md              # Este arquivo
├── eslint.config.js       # Configuração do ESLint
├── index.html             # Template HTML principal
├── package-lock.json      # Dependências travadas
├── package.json           # Dependências e scripts
├── tsconfig.app.json      # Config. TypeScript (app)
├── tsconfig.json          # Config. TypeScript (base)
├── tsconfig.node.json     # Config. TypeScript (node)
├── vercel.json            # Configuração de deploy (Vercel)
└── vite.config.ts         # Configuração do Vite
```

## Instalação e Configuração

### Pré-requisitos

  - Node.js 16+
  - npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone https://github.com/camiexemplar/SPRINT-04-FRONT-END.git

# Acesse o diretório
cd SPRINT-04-FRONT-END

# Instale as dependências
npm install

# Execute em modo desenvolvimento
npm run dev
```

### Build para Produção

```bash
npm run build
```

## Sistema de Autenticação

A aplicação utiliza rotas públicas e protegidas:

  - **Rotas públicas:** Home, FAQ, Contato, Integrantes
  - **Rotas protegidas:** Dashboard, Importar, Validação, Histórico, Alertas

Após login, o usuário é redirecionado automaticamente para `/dashboard`.

## Links Importantes

  - **Deploy (Vercel):** [Acessar Plataforma](https://cgl-carelink-git-main-camis-projects-0e0b3eb8.vercel.app)
  - **GitHub do Projeto:** [Repositório](https://github.com/camiexemplar/SPRINT-04-FRONT-END)
  - **Vídeo de Apresentação (YouTube):** [Assista aqui](https://www.youtube.com/watch?v=mrlOoM2rou8&pp=2AYC)

## Licença

Este projeto foi desenvolvido para o Hospital das Clínicas.
**CGL HealthTech – Uso institucional.**
