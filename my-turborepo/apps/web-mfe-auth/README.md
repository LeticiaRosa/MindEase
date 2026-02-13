# Web MFE Auth - Autenticação com Supabase

Microfrontend de autenticação usando Supabase, React Query e Module Federation.

## 🚀 Funcionalidades

- ✅ Login de usuários
- ✅ Cadastro de novos usuários
- ✅ Integração com Supabase Auth
- ✅ Gerenciamento de estado com React Query
- ✅ Validação de formulários
- ✅ Feedback visual de erros e sucesso
- ✅ Proteção de dados com Row Level Security (RLS)

## 📋 Pré-requisitos

- Node.js >= 18
- pnpm 9.0.0

## 🔧 Configuração

1. **Clone o repositório e instale as dependências:**

```bash
pnpm install
```

2. **Configure as variáveis de ambiente:**

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

As credenciais do Supabase já estão configuradas no arquivo `.env` criado automaticamente.

## 🏃 Execução

```bash
# Desenvolvimento (porta 3001)
pnpm dev

# Build de produção
pnpm build

# Lint
pnpm lint
```

## 🗄️ Banco de Dados

O projeto usa Supabase com as seguintes tabelas:

### `profiles`

- `id` (UUID) - Referência para auth.users
- `full_name` (TEXT) - Nome completo do usuário
- `avatar_url` (TEXT) - URL do avatar
- `created_at` (TIMESTAMPTZ) - Data de criação
- `updated_at` (TIMESTAMPTZ) - Data de atualização

### Políticas RLS (Row Level Security)

- Usuários podem visualizar apenas seu próprio perfil
- Usuários podem atualizar apenas seu próprio perfil
- Usuários podem inserir apenas seu próprio perfil

### Triggers

- **on_auth_user_created**: Cria automaticamente um perfil quando um novo usuário se registra
- **on_profile_updated**: Atualiza automaticamente o campo `updated_at`

## 🧩 Estrutura de Arquivos

```
src/
├── components/
│   ├── LoginForm.tsx       # Componente principal de login/cadastro
│   └── LoginForm.css       # Estilos do formulário
├── hooks/
│   └── userAuth.ts         # Hook customizado para autenticação
├── utils/
│   ├── supabase.ts         # Cliente Supabase
│   └── database.types.ts   # Tipos TypeScript
├── App.tsx                 # Componente raiz com QueryClientProvider
├── main.tsx                # Entry point
└── index.css               # Estilos globais
```

## 🎨 Componentes UI

O projeto usa componentes compartilhados do pacote `@repo/ui`:

- `Button` - Botão estilizável
- `Input` - Campo de entrada com label e mensagens de erro
- `Card` - Componente de card (não usado no login)

## 🔐 Autenticação

O hook `useAuth()` fornece:

```typescript
const {
  user, // Usuário atual (User | null)
  loading, // Estado de carregamento
  error, // Erros de autenticação
  signIn, // Função de login
  signUp, // Função de cadastro
  signOut, // Função de logout
} = useAuth();
```

### Exemplo de uso:

```typescript
// Login
const result = await signIn("email@example.com", "password");
if (result.success) {
  console.log("Login bem-sucedido!", result.user);
}

// Cadastro
const result = await signUp("email@example.com", "password", "Nome Completo");
if (result.success) {
  console.log("Conta criada!", result.user);
}

// Logout
await signOut();
```

## 🌐 Integração com Module Federation

Este microfrontend está configurado para ser consumido por outras aplicações através do Module Federation.

## 📝 Scripts Disponíveis

- `pnpm dev` - Inicia o servidor de desenvolvimento
- `pnpm build` - Cria build de produção
- `pnpm lint` - Executa o linter
- `pnpm preview` - Preview do build de produção

## 🐛 Troubleshooting

### Erro de conexão com Supabase

Verifique se as variáveis de ambiente no `.env` estão corretas:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY`

### Erro ao criar conta

Certifique-se de que:

- O email é válido
- A senha tem no mínimo 6 caracteres
- O Supabase Auth está habilitado no projeto

## 📚 Documentação

- [Supabase Docs](https://supabase.com/docs)
- [React Query](https://tanstack.com/query/latest)
- [Vite](https://vite.dev/)
- [Module Federation](https://module-federation.io/)

## 🔄 Migrações do Banco de Dados

As seguintes migrações foram aplicadas:

1. **create_profiles_table** - Cria tabela de perfis e configura RLS
2. **fix_function_search_path** - Corrige search_path das funções de segurança

Para visualizar as migrações, use o Supabase CLI ou acesse o dashboard do Supabase.
