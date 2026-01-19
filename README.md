
# 🚀 CaixaMaster - Gestão de Checklist Operacional

O **CaixaMaster** é uma plataforma robusta e inteligente projetada para otimizar as rotinas de abertura e fechamento de caixa. O sistema garante conformidade operacional através de checklists interativos, autenticação de identidade no envio e análise de dados alimentada por Inteligência Artificial (Google Gemini).

## 📋 Índice
- [Funcionalidades](#-funcionalidades)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Configuração do Banco de Dados (Supabase)](#-configuração-do-banco-de-dados-supabase)
- [Variáveis de Ambiente (.env)](#-variáveis-de-ambiente-env)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Como Iniciar](#-como-iniciar)

---

## ✨ Funcionalidades

### 👤 Perfil: Colaborador
- **Checklist Interativo**: Lista completa de 20 itens essenciais para abertura e fechamento.
- **Seleção Inteligente**: Botão "Selecionar Todos" para agilizar o preenchimento de seções concluídas.
- **Verificação de Identidade**: Exigência de senha individual para confirmar o envio dos dados, garantindo que o colaborador logado é quem realmente realizou a tarefa.
- **Observações**: Campo para relatar intercorrências ou detalhes específicos do dia.

### 🔑 Perfil: Administrador
- **Dashboard em Tempo Real**: Visualização imediata de novos envios através do Realtime do Supabase.
- **Gestão de Usuários**: Cadastro, edição e exclusão de colaboradores com definição de senhas.
- **Gráficos de Atividade**: Monitoramento da frequência de envios nos últimos 7 dias via Recharts.
- **Insights com IA**: Análise automática dos dados de fechamento usando **Google Gemini**, gerando recomendações estratégicas para o gerente.
- **Histórico Completo**: Auditoria de todos os checklists enviados, com filtros e status de conformidade.

---

## 🛠 Tecnologias Utilizadas

- **Frontend**: React 19 + TypeScript.
- **Estilização**: Tailwind CSS (Design moderno e responsivo).
- **Banco de Dados & Auth**: Supabase (PostgreSQL + Realtime).
- **Inteligência Artificial**: Google Gemini API (Modelo `gemini-3-flash-preview`).
- **Gráficos**: Recharts.
- **Iconografia**: Lucide Icons (SVG).

---

## 🗄 Configuração do Banco de Dados (Supabase)

Para o funcionamento correto, execute o seguinte script no **SQL Editor** do seu projeto Supabase:

```sql
-- 1. Tabela de Usuários
CREATE TABLE public.staff_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('ADMIN', 'COLLABORATOR')),
    password TEXT NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Tabela de Submissions (Checklists)
CREATE TABLE public.submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.staff_users(id) ON DELETE SET NULL,
    user_name TEXT NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    completed_items INTEGER[] NOT NULL,
    is_full_complete BOOLEAN NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Habilitar Realtime para o Dashboard
ALTER PUBLICATION supabase_realtime ADD TABLE public.submissions;

-- 4. Inserir Admin Padrão (Altere após o primeiro login)
INSERT INTO public.staff_users (name, email, role, password)
VALUES ('Administrador Master', 'admin@caixamaster.com', 'ADMIN', 'admin123');
```

---

## 🌐 Variáveis de Ambiente (.env)

Crie um arquivo `.env` na raiz do projeto com as seguintes chaves:

```env
# Google Gemini API (Para os insights do Dashboard)
API_KEY=sua_chave_do_google_gemini_aqui

# Supabase Configuration
# (As chaves abaixo já estão integradas no código para este ambiente específico)
SUPABASE_URL=https://vtujzqzgbwmgwdupseyx.supabase.co
SUPABASE_ANON_KEY=sb_publishable_VZhadAXlsVtHNH2Pdcyhjw_MYbd_0jF
```

---

## 📁 Estrutura do Projeto

- `App.tsx`: Gerenciador de estado global, rotas e conexões Supabase.
- `supabaseClient.ts`: Inicialização do SDK do Supabase.
- `geminiService.ts`: Lógica de integração com a IA do Google.
- `types.ts`: Definições de interfaces TypeScript e itens do checklist.
- `views/`:
    - `Login.tsx`: Tela de seleção de usuário.
    - `AdminDashboard.tsx`: Painel de controle do gerente.
    - `CollaboratorChecklist.tsx`: Interface de preenchimento do funcionário.

---

## 🚀 Como Iniciar

1. Clone o repositório.
2. Instale as dependências com `npm install`.
3. Certifique-se de que a tabela do Supabase foi criada conforme o script SQL acima.
4. Adicione sua `API_KEY` do Gemini no ambiente.
5. Execute `npm start` ou utilize o preview do editor.

---
Desenvolvido com foco em eficiência operacional e segurança de dados.
