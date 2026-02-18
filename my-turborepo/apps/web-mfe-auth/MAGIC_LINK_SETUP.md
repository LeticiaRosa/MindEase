# Magic Link Authentication - Setup Guide

## 📧 O que é Magic Link?

Magic Link é um método de autenticação sem senha onde o usuário recebe um link único e temporário por email para fazer login. É mais seguro e conveniente do que senhas tradicionais.

## 🎯 Benefícios

- ✅ **Sem senhas**: Usuários não precisam lembrar senhas
- ✅ **Mais seguro**: Links expiram em 5 minutos
- ✅ **Melhor UX**: Login com um único clique no email
- ✅ **Reduz suporte**: Menos problemas com recuperação de senha

## 🔧 Configuração Realizada

### 1. Database Migration

Foi criada uma tabela para rastrear solicitações de magic link:

```sql
-- Tabela para rastrear magic links
CREATE TABLE public.magic_link_requests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  requested_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT (now() + interval '5 minutes'),
  used boolean DEFAULT false,
  used_at timestamptz,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);
```

### 2. Componentes Criados

#### `MagicLinkAuth.tsx`

Componente dedicado para autenticação com magic link que inclui:

- Formulário de email
- Validação com Zod
- Feedback visual quando o link é enviado
- Opção de reenviar link
- UI responsiva e acessível

### 3. Hook de Autenticação Atualizado

O hook `useAuth` foi atualizado com a função `signInWithMagicLink()`:

```typescript
const { signInWithMagicLink } = useAuth();

// Uso
const result = await signInWithMagicLink("usuario@email.com");
```

## 📋 Configuração do Supabase

### 1. Configurar Email Templates

1. Acesse o [Supabase Dashboard](https://app.supabase.com)
2. Vá em **Authentication > Email Templates**
3. Selecione **Magic Link**
4. Customize o template do email (opcional):

```html
<h2>Seu link de acesso</h2>
<p>Clique no botão abaixo para fazer login:</p>
<p><a href="{{ .ConfirmationURL }}">Fazer Login</a></p>
<p>Este link expira em 5 minutos.</p>
```

### 2. Configurar Redirect URLs

1. Vá em **Authentication > URL Configuration**
2. Adicione suas URLs permitidas em **Redirect URLs**:
   - `http://localhost:3001` (desenvolvimento)
   - `http://localhost:5173` (desenvolvimento Vite)
   - `https://seu-dominio.com` (produção)

### 3. Configurar Email Provider (Produção)

Por padrão, Supabase usa um serviço de email limitado. Para produção:

1. Vá em **Project Settings > Auth > SMTP Settings**
2. Configure seu provedor de email (SendGrid, AWS SES, etc.):

```
Host: smtp.sendgrid.net
Port: 587
Username: apikey
Password: [sua-api-key]
Sender email: noreply@seudominio.com
```

## 🚀 Como Usar

### No Componente

```tsx
import { MagicLinkAuth } from "./components/MagicLinkAuth";

function App() {
  return (
    <MagicLinkAuth
      onToggleMode={() => console.log("Switch to password login")}
      showToggle={true}
    />
  );
}
```

### Com o Hook

```tsx
import { useAuth } from "./hooks/userAuth";

function LoginComponent() {
  const { signInWithMagicLink, loading } = useAuth();

  const handleMagicLink = async (email: string) => {
    const result = await signInWithMagicLink(email);

    if (result.success) {
      toast.success("Link enviado! Verifique seu email");
    } else {
      toast.error(result.error?.message);
    }
  };

  return (
    <button onClick={() => handleMagicLink("user@email.com")}>
      Enviar Magic Link
    </button>
  );
}
```

## 🔐 Segurança

### Características de Segurança Implementadas

1. **Expiração**: Links expiram em 5 minutos
2. **Uso Único**: Cada link só pode ser usado uma vez
3. **Rastreamento**: Todas as solicitações são registradas
4. **RLS**: Row Level Security habilitado na tabela
5. **Rate Limiting**: Supabase limita tentativas por IP

### Cleanup Automático

Use a função para limpar links expirados:

```sql
-- Execute periodicamente (pode ser agendado com pg_cron)
SELECT cleanup_expired_magic_links();
```

## 📊 Monitoramento

### Verificar Solicitações Recentes

```sql
SELECT
  email,
  requested_at,
  expires_at,
  used,
  used_at
FROM public.magic_link_requests
WHERE requested_at > NOW() - INTERVAL '24 hours'
ORDER BY requested_at DESC;
```

### Analytics

```sql
-- Taxa de conversão (links enviados vs usados)
SELECT
  COUNT(*) FILTER (WHERE used = true) * 100.0 / COUNT(*) as conversion_rate,
  COUNT(*) as total_sent,
  COUNT(*) FILTER (WHERE used = true) as used_links
FROM public.magic_link_requests
WHERE requested_at > NOW() - INTERVAL '7 days';
```

## 🐛 Troubleshooting

### Email não chega

1. Verifique a caixa de spam
2. Confirme o email no Supabase Dashboard
3. Verifique SMTP settings (produção)
4. Veja os logs em **Logs > Auth Logs**

### Link não funciona

1. Verifique se expirou (5 minutos)
2. Confirme redirect URLs configuradas
3. Verifique console do navegador
4. Veja auth logs no Supabase

### Rate Limiting

Se muitos pedidos do mesmo IP:

1. Aguarde alguns minutos
2. Configure rate limits no Supabase
3. Implemente debounce no frontend

## 🎨 Customização

### Mudar tempo de expiração

Edite o trigger na migração:

```sql
ALTER TABLE public.magic_link_requests
ALTER COLUMN expires_at
SET DEFAULT (now() + interval '10 minutes');
```

### Personalizar Email

Customize o template no Supabase Dashboard ou use hooks do Supabase para enviar emails customizados.

## 📚 Referências

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Magic Link Best Practices](https://supabase.com/docs/guides/auth/auth-magic-link)
- [Email Templates](https://supabase.com/docs/guides/auth/auth-email-templates)

## ✅ Checklist de Implementação

- [x] Criar migration para tracking
- [x] Atualizar hook useAuth
- [x] Criar componente MagicLinkAuth
- [x] Integrar com componente Auth
- [ ] Configurar email templates no Supabase
- [ ] Adicionar redirect URLs
- [ ] Configurar SMTP para produção
- [ ] Testar fluxo completo
- [ ] Adicionar analytics/monitoring

## 🔄 Próximos Passos

1. Configure os templates de email no Supabase Dashboard
2. Adicione as redirect URLs permitidas
3. Teste o fluxo completo de login
4. Configure um provedor SMTP para produção
5. Implemente monitoramento de conversão
6. Adicione testes automatizados

---

**Nota**: Esta implementação segue as melhores práticas de segurança e UX. Para ambientes de produção, certifique-se de configurar um provedor de email confiável.
