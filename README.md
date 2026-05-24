# PEX - Plataforma Inteligente de Simulação e Avaliação de Atendimento

Protótipo avançado em React/Vite para treinamento de operadores de call center com simulação de cliente por IA, controle de acesso individual, chat, pontuação, feedback, histórico e relatórios.

## Rodar localmente

```bash
npm install
npm run dev
```

URL local padrão:

```text
http://localhost:5173/
```

## Acessos de demonstração

- Organizador: botão **Entrar com Google**
- Operador: código **PEX-TEC-2048**
- Outros códigos carregados na base inicial: **PEX-FIN-1930**, **PEX-OFR-4431**, **PEX-RET-7106**, **PEX-REL-0061**

Para reiniciar os dados salvos no navegador:

```text
http://localhost:5173/?resetDemo=1
```

## Escopo do protótipo

- OAuth Google, IA, exportação PDF/planilha e voz estão representados como fluxo de interface e lógica local.
- Dados ficam em `localStorage` para permitir navegação e persistência de demo sem backend.
- A arquitetura visual prevê integração futura com Google OAuth, API LLM, backend Node/Python, PostgreSQL, Speech-to-Text e Text-to-Speech.
