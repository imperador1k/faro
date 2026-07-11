# Clerk Email Templates — Faro Gamified Design

---

## Erro: Logo nao centrado

O partial `{{> app_logo}}` renderiza uma imagem inline que o `<re-text>` pode nao centrar corretamente.  
Solucao: colocar o logo dentro de `<re-block align="center">` em vez de `<re-text>`.

Aplicado em todos os templates abaixo.

---

## Design Gamificado

Cada template segue esta estrutura visual:

```
┌──────────────────────────────────┐
│           [LOGO FARO]            │  ← header
├──────────────────────────────────┤
│  ██████████████████████████████  │  ← barra verde (accent)
│                                  │
│         TITULO GRANDE            │  ← heading
│                                  │
│  Texto de apoio com espacamento  │  ← body
│  generoso para ler descansado.   │
│                                  │
│        ┌──────────────┐          │
│        │    BOTAO      │          │  ← CTA verde Faro
│        └──────────────┘          │
│                                  │
│  ──────────────────────────────  │  ← divider
│                                  │
│  Metadata do pedido              │  ← small text
│  A equipa Faro                   │
└──────────────────────────────────┘
```

| Elemento | Valor |
|---|---|
| Fundo pagina | `#f8fafc` |
| Card | `#ffffff` com padding 48px |
| Barra accent | `#58cc02` 6px height |
| Titulo | `#0f172a` 24px bold |
| Corpo | `#475569` 15px |
| CTA | `#58cc02` com radius 16px |
| Divider | `#e2e8f0` |
| Footer | `#94a3b8` 12px |

---

### 1. Email link — Sign In

```html
<re-html>
    <re-head>
        <re-title>
            Link de acesso — {{app.name}}
        </re-title>
    </re-head>
    <re-body background-color="#f1f5f9" padding="40px 20px">
        <re-preheader>
            Link de acesso para {{app.name}}
        </re-preheader>
        <re-header padding="32px 32px 16px 32px" align="center">
            <re-block align="center" padding="0px">
                {{> app_logo}}
            </re-block>
        </re-header>
        <re-main background-color="#f1f5f9">
            <re-block background-color="#ffffff" padding="0px" align="center" border-radius="24px" border="2px solid #e2e8f0" border-bottom="8px solid #cbd5e1" overflow="hidden">
                <re-block background-color="#58cc02" padding="8px 0px" align="center">
                </re-block>
                <re-block padding="48px 40px 40px 40px" align="center">
                    <re-heading level="h1" align="center" color="#1e293b" font-weight="bold" font-size="32px" line-height="34px" margin="0px">
                        Link de acesso
                    </re-heading>
                    <re-text font-size="16px" line-height="24px" color="#475569" align="center" margin="16px 0px 36px 0px">
        				Olá! Clica no botão abaixo para iniciares sessão na tua conta Faro.
        			</re-text>
        			<re-button href="{{magic_link}}" background-color="#58cc02" border-radius="16px" border-bottom="5px solid #46a302" padding="18px 44px" align="center" font-size="18px" font-weight="bold" color="#ffffff">
        			    Iniciar sessão
        			</re-button>
        			<re-text font-size="13px" color="#94a3b8" align="center" margin="28px 0px 0px 0px">
        				Este link expira em {{ttl_minutes}} minutos.
        			</re-text>
        			<re-divider background-color="#e2e8f0" height="1px" margin="36px 0px 24px 0px"></re-divider>
        			<re-text font-size="13px" color="#94a3b8" font-weight="500" align="center" margin="0px">
        				Pedido de {{requested_from}} às {{requested_at}}.
        			</re-text>
        			<re-text font-size="13px" color="#94a3b8" font-weight="500" align="center" margin="8px 0px 0px 0px">
        				A equipa Faro
        			</re-text>
                </re-block>
            </re-block>
        </re-main>
        <re-footer padding="24px 32px 40px">
            <re-divider background-color="#e2e8f0" height="1px" margin="0px 0px 16px 0px"></re-divider>
            <re-text font-size="13px" color="#94a3b8" font-weight="500" align="center" margin="0px">
                {{app.name}} - A Lighthouse for Language Learners
            </re-text>
            <re-text font-size="13px" color="#94a3b8" font-weight="500" align="center" margin="4px 0px 0px 0px">
                (c) {{current_year}} {{app.name}}
            </re-text>
        </re-footer>
    </re-body>
</re-html>
```

**Subject:** `Link de acesso à {{app.name}}`

---

### 2. Email link — Sign Up

```html
<re-html>
    <re-head>
        <re-title>
            Bem-vindo à {{app.name}} - confirma o teu email
        </re-title>
    </re-head>
    <re-body background-color="#f1f5f9" padding="40px 20px">
        <re-preheader>
            Confirma o teu email na {{app.name}}
        </re-preheader>
        <re-header padding="32px 32px 16px 32px" align="center">
            <re-block align="center" padding="0px">
                {{> app_logo}}
            </re-block>
        </re-header>
        <re-main background-color="#f1f5f9">
            <re-block background-color="#ffffff" padding="0px" align="center" border-radius="24px" border="2px solid #e2e8f0" border-bottom="8px solid #cbd5e1" overflow="hidden">
                <re-block background-color="#58cc02" padding="8px 0px" align="center">
                </re-block>
                <re-block padding="48px 40px 40px 40px" align="center">
                    <re-heading level="h1" align="center" color="#1e293b" font-weight="bold" font-size="32px" line-height="34px" margin="0px">
                        Bem-vindo à Faro
                    </re-heading>
                    <re-text font-size="16px" line-height="24px" color="#475569" align="center" margin="16px 0px 36px 0px">
        				Clica no botão abaixo para confirmares o teu email e ativares a tua conta. A tua jornada está prestes a começar.
        			</re-text>
        			<re-button href="{{magic_link}}" background-color="#58cc02" border-radius="16px" border-bottom="5px solid #46a302" padding="18px 44px" align="center" font-size="18px" font-weight="bold" color="#ffffff">
        			    Ativar conta
        			</re-button>
        			<re-text font-size="13px" color="#94a3b8" align="center" margin="28px 0px 0px 0px">
        				Este link expira em {{ttl_minutes}} minutos.
        			</re-text>
        			<re-divider background-color="#e2e8f0" height="1px" margin="36px 0px 24px 0px"></re-divider>
        			<re-text font-size="13px" color="#94a3b8" font-weight="500" align="center" margin="0px">
        				Pedido de {{requested_from}} às {{requested_at}}.
        			</re-text>
        			<re-text font-size="13px" color="#94a3b8" font-weight="500" align="center" margin="8px 0px 0px 0px">
        				A equipa Faro
        			</re-text>
                </re-block>
            </re-block>
        </re-main>
        <re-footer padding="24px 32px 40px">
            <re-divider background-color="#e2e8f0" height="1px" margin="0px 0px 16px 0px"></re-divider>
            <re-text font-size="13px" color="#94a3b8" font-weight="500" align="center" margin="0px">
                {{app.name}} - A Lighthouse for Language Learners
            </re-text>
            <re-text font-size="13px" color="#94a3b8" font-weight="500" align="center" margin="4px 0px 0px 0px">
                (c) {{current_year}} {{app.name}}
            </re-text>
        </re-footer>
    </re-body>
</re-html>
```

**Subject:** `Bem-vindo à {{app.name}} - confirma o teu email`

---

### 3. Email link — Verify Email

```html
<re-html>
    <re-head>
        <re-title>
            Verifica o teu email — {{app.name}}
        </re-title>
    </re-head>
    <re-body background-color="#f1f5f9" padding="40px 20px">
        <re-preheader>
            Verifica o teu email na {{app.name}}
        </re-preheader>
        <re-header padding="32px 32px 16px 32px" align="center">
            <re-block align="center" padding="0px">
                {{> app_logo}}
            </re-block>
        </re-header>
        <re-main background-color="#f1f5f9">
            <re-block background-color="#ffffff" padding="0px" align="center" border-radius="24px" border="2px solid #e2e8f0" border-bottom="8px solid #cbd5e1" overflow="hidden">
                <re-block background-color="#58cc02" padding="8px 0px" align="center">
                </re-block>
                <re-block padding="48px 40px 40px 40px" align="center">
                    <re-heading level="h1" align="center" color="#1e293b" font-weight="bold" font-size="32px" line-height="34px" margin="0px">
                        Confirma o teu email
                    </re-heading>
                    <re-text font-size="16px" line-height="24px" color="#475569" align="center" margin="16px 0px 36px 0px">
        				Clica no botão abaixo para verificares o teu endereço de email e manteres a tua conta segura.
        			</re-text>
        			<re-button href="{{magic_link}}" background-color="#58cc02" border-radius="16px" border-bottom="5px solid #46a302" padding="18px 44px" align="center" font-size="18px" font-weight="bold" color="#ffffff">
        			    Verificar email
        			</re-button>
        			<re-text font-size="13px" color="#94a3b8" align="center" margin="28px 0px 0px 0px">
        				Este link expira em {{ttl_minutes}} minutos.
        			</re-text>
        			<re-divider background-color="#e2e8f0" height="1px" margin="36px 0px 24px 0px"></re-divider>
        			<re-text font-size="13px" color="#94a3b8" font-weight="500" align="center" margin="0px">
        				Pedido de {{requested_from}} às {{requested_at}}.
        			</re-text>
        			<re-text font-size="13px" color="#94a3b8" font-weight="500" align="center" margin="8px 0px 0px 0px">
        				A equipa Faro
        			</re-text>
                </re-block>
            </re-block>
        </re-main>
        <re-footer padding="24px 32px 40px">
            <re-divider background-color="#e2e8f0" height="1px" margin="0px 0px 16px 0px"></re-divider>
            <re-text font-size="13px" color="#94a3b8" font-weight="500" align="center" margin="0px">
                {{app.name}} - A Lighthouse for Language Learners
            </re-text>
            <re-text font-size="13px" color="#94a3b8" font-weight="500" align="center" margin="4px 0px 0px 0px">
                (c) {{current_year}} {{app.name}}
            </re-text>
        </re-footer>
    </re-body>
</re-html>
```

**Subject:** `Verifica o teu email em {{app.name}}`

---

### 4. Invitation

```html
<re-html>
    <re-head>
        <re-title>
            {{inviter.name}} convidou-te para a {{app.name}}
        </re-title>
    </re-head>
    <re-body background-color="#f1f5f9" padding="40px 20px">
        <re-preheader>
            {{inviter.name}} convidou-te para a {{app.name}}
        </re-preheader>
        <re-header padding="32px 32px 16px 32px" align="center">
            <re-block align="center" padding="0px">
                {{> app_logo}}
            </re-block>
        </re-header>
        <re-main background-color="#f1f5f9">
            <re-block background-color="#ffffff" padding="0px" align="center" border-radius="24px" border="2px solid #e2e8f0" border-bottom="8px solid #cbd5e1" overflow="hidden">
                <re-block background-color="#58cc02" padding="8px 0px" align="center">
                </re-block>
                <re-block padding="48px 40px 40px 40px" align="center">
                    <re-heading level="h1" align="center" color="#1e293b" font-weight="bold" font-size="32px" line-height="34px" margin="0px">
                        Convite
                    </re-heading>
                    <re-text font-size="16px" line-height="24px" color="#475569" align="center" margin="16px 0px 6px 0px">
        				<b>{{inviter.name}}</b> ({{inviter.email}})
        			</re-text>
        			<re-text font-size="16px" line-height="24px" color="#475569" align="center" margin="0px 0px 36px 0px">
        				Convidou-te para aprender idiomas na {{app.name}}. Desafia os teus amigos e constrói a tua streak diária.
        			</re-text>
        			<re-button href="{{action_url}}" background-color="#58cc02" border-radius="16px" border-bottom="5px solid #46a302" padding="18px 44px" align="center" font-size="18px" font-weight="bold" color="#ffffff">
        			    Aceitar convite
        			</re-button>
        			<re-text font-size="13px" color="#94a3b8" align="center" margin="28px 0px 0px 0px">
        				Se não conheces {{inviter.name}}, ignora este email.
        			</re-text>
        			<re-divider background-color="#e2e8f0" height="1px" margin="36px 0px 24px 0px"></re-divider>
        			<re-text font-size="13px" color="#94a3b8" font-weight="500" align="center" margin="0px">
        				A equipa Faro
        			</re-text>
                </re-block>
            </re-block>
        </re-main>
        <re-footer padding="24px 32px 40px">
            <re-divider background-color="#e2e8f0" height="1px" margin="0px 0px 16px 0px"></re-divider>
            <re-text font-size="13px" color="#94a3b8" font-weight="500" align="center" margin="0px">
                {{app.name}} - A Lighthouse for Language Learners
            </re-text>
            <re-text font-size="13px" color="#94a3b8" font-weight="500" align="center" margin="4px 0px 0px 0px">
                (c) {{current_year}} {{app.name}}
            </re-text>
        </re-footer>
    </re-body>
</re-html>
```

**Subject:** `{{inviter.name}} convidou-te para a {{app.name}}`

---

### 5. Verification Code

```html
<re-html>
    <re-head>
        <re-title>
            {{otp_code}} é o teu código de verificação {{app.name}}
        </re-title>
    </re-head>
    <re-body background-color="#f1f5f9" padding="40px 20px">
        <re-preheader>
            Código de verificação {{app.name}}: {{otp_code}}
        </re-preheader>
        <re-header padding="32px 32px 16px 32px" align="center">
            <re-block align="center" padding="0px">
                {{> app_logo}}
            </re-block>
        </re-header>
        <re-main background-color="#f1f5f9">
            <re-block background-color="#ffffff" padding="0px" align="center" border-radius="24px" border="2px solid #e2e8f0" border-bottom="8px solid #cbd5e1" overflow="hidden">
                <re-block background-color="#58cc02" padding="8px 0px" align="center">
                </re-block>
                <re-block padding="48px 40px 40px 40px" align="center">
                    <re-heading level="h1" align="center" color="#1e293b" font-weight="bold" font-size="32px" line-height="34px" margin="0px">
                        Código de verificação
                    </re-heading>
                    <re-text font-size="16px" line-height="24px" color="#475569" align="center" margin="16px 0px 32px 0px">
        				Usa o código abaixo para verificar o teu email na {{app.name}}.
        			</re-text>
        			<re-block background-color="#f0f8e2" padding="32px 48px" align="center" border-radius="20px" border="2px solid #c7ebb1" border-bottom="6px solid #c7ebb1">
        			    <re-text font-size="48px" letter-spacing="4px" color="#58cc02" align="center" font-weight="bold">
        			        {{otp_code}}
        			    </re-text>
        			</re-block>
        			<re-text font-size="13px" color="#94a3b8" align="center" margin="28px 0px 0px 0px">
        				Este código expira em 10 minutos. Não o partilhes com ninguém.
        			</re-text>
        			<re-divider background-color="#e2e8f0" height="1px" margin="36px 0px 24px 0px"></re-divider>
        			<re-text font-size="13px" color="#94a3b8" font-weight="500" align="center" margin="0px">
        				Pedido de {{requested_from}} às {{requested_at}}.
        			</re-text>
        			<re-text font-size="13px" color="#94a3b8" font-weight="500" align="center" margin="8px 0px 0px 0px">
        				A equipa Faro
        			</re-text>
                </re-block>
            </re-block>
        </re-main>
        <re-footer padding="24px 32px 40px">
            <re-divider background-color="#e2e8f0" height="1px" margin="0px 0px 16px 0px"></re-divider>
            <re-text font-size="13px" color="#94a3b8" font-weight="500" align="center" margin="0px">
                {{app.name}} - A Lighthouse for Language Learners
            </re-text>
            <re-text font-size="13px" color="#94a3b8" font-weight="500" align="center" margin="4px 0px 0px 0px">
                (c) {{current_year}} {{app.name}}
            </re-text>
        </re-footer>
    </re-body>
</re-html>
```

**Subject:** `{{otp_code}} é o teu código de verificação {{app.name}}`

---

### 6. Account Locked

```html
<re-html>
    <re-head>
        <re-title>
            Conta bloqueada — {{app.name}}
        </re-title>
    </re-head>
    <re-body background-color="#f1f5f9" padding="40px 20px">
        <re-preheader>
            Conta bloqueada por segurança
        </re-preheader>
        <re-header padding="32px 32px 16px 32px" align="center">
            <re-block align="center" padding="0px">
                {{> app_logo}}
            </re-block>
        </re-header>
        <re-main background-color="#f1f5f9">
            <re-block background-color="#ffffff" padding="0px" align="center" border-radius="24px" border="2px solid #e2e8f0" border-bottom="8px solid #cbd5e1" overflow="hidden">
                <re-block background-color="#ff4b4b" padding="8px 0px" align="center">
                </re-block>
                <re-block padding="48px 40px 40px 40px" align="center">
                    <re-heading level="h1" align="center" color="#1e293b" font-weight="bold" font-size="32px" line-height="34px" margin="0px">
                        Conta bloqueada
                    </re-heading>
                    <re-text font-size="16px" line-height="24px" color="#475569" align="center" margin="16px 0px 20px 0px">
                        A tua conta foi temporariamente bloqueada devido a múltiplas tentativas de acesso falhadas.
                    </re-text>
                    <re-text font-size="16px" line-height="24px" color="#475569" align="center" margin="0px 0px 0px 0px">
                        Redefine a tua password ou aguarda alguns minutos. Se não reconheces esta atividade, contacta o suporte.
                    </re-text>
                    <re-divider background-color="#e2e8f0" height="1px" margin="36px 0px 24px 0px"></re-divider>
                    <re-text font-size="13px" color="#94a3b8" font-weight="500" align="center" margin="0px">
                        Tentativas de {{requested_from}} às {{requested_at}}.
                    </re-text>
                    <re-text font-size="13px" color="#94a3b8" font-weight="500" align="center" margin="8px 0px 0px 0px">
                        A equipa Faro
                    </re-text>
                </re-block>
            </re-block>
        </re-main>
        <re-footer padding="24px 32px 40px">
            <re-divider background-color="#e2e8f0" height="1px" margin="0px 0px 16px 0px"></re-divider>
            <re-text font-size="13px" color="#94a3b8" font-weight="500" align="center" margin="0px">
                {{app.name}} - A Lighthouse for Language Learners
            </re-text>
            <re-text font-size="13px" color="#94a3b8" font-weight="500" align="center" margin="4px 0px 0px 0px">
                (c) {{current_year}} {{app.name}}
            </re-text>
        </re-footer>
    </re-body>
</re-html>
```

**Subject:** `Conta bloqueada - {{app.name}}`

---

### 7. Password Changed

```html
<re-html>
    <re-head>
        <re-title>
            Password alterada — {{app.name}}
        </re-title>
    </re-head>
    <re-body background-color="#f1f5f9" padding="40px 20px">
        <re-preheader>
            Password alterada com sucesso
        </re-preheader>
        <re-header padding="32px 32px 16px 32px" align="center">
            <re-block align="center" padding="0px">
                {{> app_logo}}
            </re-block>
        </re-header>
        <re-main background-color="#f1f5f9">
            <re-block background-color="#ffffff" padding="0px" align="center" border-radius="24px" border="2px solid #e2e8f0" border-bottom="8px solid #cbd5e1" overflow="hidden">
                <re-block background-color="#58cc02" padding="8px 0px" align="center">
                </re-block>
                <re-block padding="48px 40px 40px 40px" align="center">
                    <re-heading level="h1" align="center" color="#1e293b" font-weight="bold" font-size="32px" line-height="34px" margin="0px">
                        Password alterada
                    </re-heading>
                    <re-text font-size="16px" line-height="24px" color="#475569" align="center" margin="16px 0px 20px 0px">
                        A tua password para a conta <b>{{primary_email_address}}</b> foi alterada com sucesso. Se foste tu, ignora este email.
                    </re-text>
                    <re-text font-size="16px" line-height="24px" color="#475569" align="center" margin="0px 0px 0px 0px">
                        Se não reconheces esta alteração, recupera o acesso à tua conta imediatamente.
                    </re-text>
                    <re-divider background-color="#e2e8f0" height="1px" margin="36px 0px 24px 0px"></re-divider>
                    <re-text font-size="13px" color="#94a3b8" font-weight="500" align="center" margin="0px">
                        Alteração de {{requested_from}} às {{requested_at}}.
                    </re-text>
                    <re-text font-size="13px" color="#94a3b8" font-weight="500" align="center" margin="8px 0px 0px 0px">
                        A equipa Faro
                    </re-text>
                </re-block>
            </re-block>
        </re-main>
        <re-footer padding="24px 32px 40px">
            <re-divider background-color="#e2e8f0" height="1px" margin="0px 0px 16px 0px"></re-divider>
            <re-text font-size="13px" color="#94a3b8" font-weight="500" align="center" margin="0px">
                {{app.name}} - A Lighthouse for Language Learners
            </re-text>
            <re-text font-size="13px" color="#94a3b8" font-weight="500" align="center" margin="4px 0px 0px 0px">
                (c) {{current_year}} {{app.name}}
            </re-text>
        </re-footer>
    </re-body>
</re-html>
```

**Subject:** `Password alterada - {{app.name}}`

---

### 8. Password Removed

```html
<re-html>
    <re-head>
        <re-title>
            Password removida — {{app.name}}
        </re-title>
    </re-head>
    <re-body background-color="#f1f5f9" padding="40px 20px">
        <re-preheader>
            Password removida da tua conta
        </re-preheader>
        <re-header padding="32px 32px 16px 32px" align="center">
            <re-block align="center" padding="0px">
                {{> app_logo}}
            </re-block>
        </re-header>
        <re-main background-color="#f1f5f9">
            <re-block background-color="#ffffff" padding="0px" align="center" border-radius="24px" border="2px solid #e2e8f0" border-bottom="8px solid #cbd5e1" overflow="hidden">
                <re-block background-color="#58cc02" padding="8px 0px" align="center">
                </re-block>
                <re-block padding="48px 40px 40px 40px" align="center">
                    <re-heading level="h1" align="center" color="#1e293b" font-weight="bold" font-size="32px" line-height="34px" margin="0px">
                        Password removida
                    </re-heading>
                    <re-text font-size="16px" line-height="24px" color="#475569" align="center" margin="16px 0px 20px 0px">
                        A password da tua conta associada a <b>{{primary_email_address}}</b> foi removida. Passaste a usar autenticação sem password (magic links ou redes sociais).
                    </re-text>
                    <re-text font-size="16px" line-height="24px" color="#475569" align="center" margin="0px 0px 0px 0px">
                        Se não fizeste esta alteração, adiciona uma nova password nas definições da tua conta.
                    </re-text>
                    <re-divider background-color="#e2e8f0" height="1px" margin="36px 0px 24px 0px"></re-divider>
                    <re-text font-size="13px" color="#94a3b8" font-weight="500" align="center" margin="0px">
                        Alteração de {{requested_from}} às {{requested_at}}.
                    </re-text>
                    <re-text font-size="13px" color="#94a3b8" font-weight="500" align="center" margin="8px 0px 0px 0px">
                        A equipa Faro
                    </re-text>
                </re-block>
            </re-block>
        </re-main>
        <re-footer padding="24px 32px 40px">
            <re-divider background-color="#e2e8f0" height="1px" margin="0px 0px 16px 0px"></re-divider>
            <re-text font-size="13px" color="#94a3b8" font-weight="500" align="center" margin="0px">
                {{app.name}} - A Lighthouse for Language Learners
            </re-text>
            <re-text font-size="13px" color="#94a3b8" font-weight="500" align="center" margin="4px 0px 0px 0px">
                (c) {{current_year}} {{app.name}}
            </re-text>
        </re-footer>
    </re-body>
</re-html>
```

**Subject:** `Password removida - {{app.name}}`

---

### 9. Primary Email Address Changed

```html
<re-html>
    <re-head>
        <re-title>
            Email principal alterado — {{app.name}}
        </re-title>
    </re-head>
    <re-body background-color="#f1f5f9" padding="40px 20px">
        <re-preheader>
            Email principal alterado
        </re-preheader>
        <re-header padding="32px 32px 16px 32px" align="center">
            <re-block align="center" padding="0px">
                {{> app_logo}}
            </re-block>
        </re-header>
        <re-main background-color="#f1f5f9">
            <re-block background-color="#ffffff" padding="0px" align="center" border-radius="24px" border="2px solid #e2e8f0" border-bottom="8px solid #cbd5e1" overflow="hidden">
                <re-block background-color="#58cc02" padding="8px 0px" align="center">
                </re-block>
                <re-block padding="48px 40px 40px 40px" align="center">
                    <re-heading level="h1" align="center" color="#1e293b" font-weight="bold" font-size="32px" line-height="34px" margin="0px">
                        Email atualizado
                    </re-heading>
                    <re-text font-size="16px" line-height="24px" color="#475569" align="center" margin="16px 0px 24px 0px">
                        O email principal da tua conta foi alterado para:
                    </re-text>
                    <re-text font-size="18px" color="#58cc02" align="center" font-weight="bold" margin="0px 0px 24px 0px">
                        {{new_email_address}}
                    </re-text>
                    <re-text font-size="16px" line-height="24px" color="#475569" align="center" margin="0px 0px 0px 0px">
                        Se não fizeste esta alteração, contacta o suporte imediatamente.
                    </re-text>
                    <re-divider background-color="#e2e8f0" height="1px" margin="36px 0px 24px 0px"></re-divider>
                    <re-text font-size="13px" color="#94a3b8" font-weight="500" align="center" margin="0px">
                        Alteração de {{requested_from}} às {{requested_at}}.
                    </re-text>
                    <re-text font-size="13px" color="#94a3b8" font-weight="500" align="center" margin="8px 0px 0px 0px">
                        A equipa Faro
                    </re-text>
                </re-block>
            </re-block>
        </re-main>
        <re-footer padding="24px 32px 40px">
            <re-divider background-color="#e2e8f0" height="1px" margin="0px 0px 16px 0px"></re-divider>
            <re-text font-size="13px" color="#94a3b8" font-weight="500" align="center" margin="0px">
                {{app.name}} - A Lighthouse for Language Learners
            </re-text>
            <re-text font-size="13px" color="#94a3b8" font-weight="500" align="center" margin="4px 0px 0px 0px">
                (c) {{current_year}} {{app.name}}
            </re-text>
        </re-footer>
    </re-body>
</re-html>
```

**Subject:** `Email principal alterado - {{app.name}}`

---

### 10. Reset Password Code

```html
<re-html>
    <re-head>
        <re-title>
            {{otp_code}} é o teu código de redefinição de password
        </re-title>
    </re-head>
    <re-body background-color="#f1f5f9" padding="40px 20px">
        <re-preheader>
            Código de redefinição de password {{app.name}}
        </re-preheader>
        <re-header padding="32px 32px 16px 32px" align="center">
            <re-block align="center" padding="0px">
                {{> app_logo}}
            </re-block>
        </re-header>
        <re-main background-color="#f1f5f9">
            <re-block background-color="#ffffff" padding="0px" align="center" border-radius="24px" border="2px solid #e2e8f0" border-bottom="8px solid #cbd5e1" overflow="hidden">
                <re-block background-color="#58cc02" padding="8px 0px" align="center">
                </re-block>
                <re-block padding="48px 40px 40px 40px" align="center">
                    <re-heading level="h1" align="center" color="#1e293b" font-weight="bold" font-size="32px" line-height="34px" margin="0px">
                        Redefinir password
                    </re-heading>
                    <re-text font-size="16px" line-height="24px" color="#475569" align="center" margin="16px 0px 32px 0px">
                        Usa o código abaixo para redefinires a tua password na {{app.name}}.
                    </re-text>
                    <re-block background-color="#f0f8e2" padding="32px 48px" align="center" border-radius="20px" border="2px solid #c7ebb1" border-bottom="6px solid #c7ebb1">
                        <re-text font-size="48px" letter-spacing="4px" color="#58cc02" align="center" font-weight="bold">
                            {{otp_code}}
                        </re-text>
                    </re-block>
                    <re-text font-size="13px" color="#94a3b8" align="center" margin="28px 0px 0px 0px">
                        Este código expira em 10 minutos. Se não pediste redefinição, ignora este email.
                    </re-text>
                    <re-divider background-color="#e2e8f0" height="1px" margin="36px 0px 24px 0px"></re-divider>
                    <re-text font-size="13px" color="#94a3b8" font-weight="500" align="center" margin="0px">
                        Pedido de {{requested_from}} às {{requested_at}}.
                    </re-text>
                    <re-text font-size="13px" color="#94a3b8" font-weight="500" align="center" margin="8px 0px 0px 0px">
                        A equipa Faro
                    </re-text>
                </re-block>
            </re-block>
        </re-main>
        <re-footer padding="24px 32px 40px">
            <re-divider background-color="#e2e8f0" height="1px" margin="0px 0px 16px 0px"></re-divider>
            <re-text font-size="13px" color="#94a3b8" font-weight="500" align="center" margin="0px">
                {{app.name}} - A Lighthouse for Language Learners
            </re-text>
            <re-text font-size="13px" color="#94a3b8" font-weight="500" align="center" margin="4px 0px 0px 0px">
                (c) {{current_year}} {{app.name}}
            </re-text>
        </re-footer>
    </re-body>
</re-html>
```

**Subject:** `{{otp_code}} - código de redefinição de password {{app.name}}`

---

### 11. Sign In from New Device

```html
<re-html>
    <re-head>
        <re-title>
            Novo acesso à tua conta — {{app.name}}
        </re-title>
    </re-head>
    <re-body background-color="#f1f5f9" padding="40px 20px">
        <re-preheader>
            Novo acesso detetado na tua conta
        </re-preheader>
        <re-header padding="32px 32px 16px 32px" align="center">
            <re-block align="center" padding="0px">
                {{> app_logo}}
            </re-block>
        </re-header>
        <re-main background-color="#f1f5f9">
            <re-block background-color="#ffffff" padding="0px" align="center" border-radius="24px" border="2px solid #e2e8f0" border-bottom="8px solid #cbd5e1" overflow="hidden">
                <re-block background-color="#ff4b4b" padding="8px 0px" align="center">
                </re-block>
                <re-block padding="48px 40px 40px 40px" align="center">
                    <re-heading level="h1" align="center" color="#1e293b" font-weight="bold" font-size="32px" line-height="34px" margin="0px">
                        Novo dispositivo
                    </re-heading>
                    <re-text font-size="16px" line-height="24px" color="#475569" align="center" margin="16px 0px 20px 0px">
                        Detetámos um novo acesso à tua conta a partir de um dispositivo ou localização diferente do habitual.
                    </re-text>
                    <re-text font-size="16px" line-height="24px" color="#475569" align="center" margin="0px 0px 0px 0px">
                        Se foste tu, não precisas de fazer nada. Se não reconheces esta atividade, altera a tua password.
                    </re-text>
                    <re-divider background-color="#e2e8f0" height="1px" margin="36px 0px 24px 0px"></re-divider>
                    <re-text font-size="13px" color="#94a3b8" font-weight="500" align="center" margin="0px">
                        Acesso de {{requested_from}} às {{requested_at}}.
                    </re-text>
                    <re-text font-size="13px" color="#94a3b8" font-weight="500" align="center" margin="8px 0px 0px 0px">
                        A equipa Faro
                    </re-text>
                </re-block>
            </re-block>
        </re-main>
        <re-footer padding="24px 32px 40px">
            <re-divider background-color="#e2e8f0" height="1px" margin="0px 0px 16px 0px"></re-divider>
            <re-text font-size="13px" color="#94a3b8" font-weight="500" align="center" margin="0px">
                {{app.name}} - A Lighthouse for Language Learners
            </re-text>
            <re-text font-size="13px" color="#94a3b8" font-weight="500" align="center" margin="4px 0px 0px 0px">
                (c) {{current_year}} {{app.name}}
            </re-text>
        </re-footer>
    </re-body>
</re-html>
```

**Subject:** `Novo acesso à tua conta {{app.name}}`

---

## Sistema de Idioma Unico (ja implementado)

Criei o sistema completo de webhook que interceciona os emails do Clerk e envia via Resend com o idioma correto de cada utilizador.

### O que foi criado

| Ficheiro | Funcao |
|---|---|
| `src/app/api/webhooks/clerk/route.ts` | Endpoint que recebe o evento `email.created` do Clerk |
| `src/lib/clerk-emails.ts` | Biblioteca com templates HTML localizados (PT e EN) para cada tipo de email |
| `.env.example` | Variavel `CLERK_WEBHOOK_SECRET` e `RESEND_FROM_EMAIL` adicionadas |

### Como funciona

```
Utilizador faz acao na app
       |
       v
Clerk gera email com template re-* (mantens "Delivered by Clerk" DESLIGADO)
       |
       v
Clerk dispara webhook email.created para /api/webhooks/clerk
       |
       v
API verifica assinatura Svix, le o template_name e o user_id
       |
       v
API busca o nativeLanguage do user na BD (user_progress)
       |
       v
API gera HTML bonito com o design Faro no idioma do user (PT ou EN)
       |
       v
API envia o email via Resend
```

### Setup no Clerk Dashboard

1. Abre https://dashboard.clerk.com → Your App → **Webhooks**
2. Clica **Add Endpoint**
3. **Endpoint URL:** `https://teu-dominio.vercel.app/api/webhooks/clerk`
4. Selecione o evento: **email.created**
5. Clica **Create**
6. Copia o **Signing Secret** (comeca por `whsec_...`)
7. Adiciona ao `.env.local`:
   ```
   CLERK_WEBHOOK_SECRET=whsec_...
   RESEND_FROM_EMAIL="Faro <noreply@teudominio.com>"
   ```

### Variaveis de ambiente necessarias

```
# .env.local
CLERK_WEBHOOK_SECRET=whsec_...       # do Clerk Dashboard > Webhooks
RESEND_API_KEY=re_...                # ja deves ter
RESEND_FROM_EMAIL="Faro <noreply@teudominio.com>"   # dominio verificado no Resend
```

### Templates disponiveis atualmente

- **PT** (completo) — todos os 11 tipos
- **EN** (completo) — todos os 11 tipos

Para adicionar mais idiomas (ES, FR, DE, etc.), edita `src/lib/clerk-emails.ts` e adiciona as entradas no mapa `LOCALES`.

### Os templates Clerk (re-*) ainda sao necessarios?

**Sim.** Mantem-nos em PT como estao. O Clerk precisa deles para renderizar as variaveis (`{{magic_link}}`, `{{otp_code}}`, etc.) e disparar o webhook. Nosso sistema extrai essas variaveis do HTML renderizado pelo Clerk, gera HTML proprio e envia via Resend.

**Importante:** Mantem **"Delivered by Clerk" DESLIGADO** em todos os templates (como ja fizeste). Senao o Clerk envia o template PT basico E nos enviamos o nosso, resultando em emails duplicados.
