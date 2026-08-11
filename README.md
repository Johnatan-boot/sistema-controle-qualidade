<img width="905" height="654" alt="Captura de tela 2026-08-11 174342" src="https://github.com/user-attachments/assets/08324a02-a5a3-4af9-b058-fe4b81c820f3" />
<img width="1440" height="900" alt="Captura de tela 2026-08-11 173313" src="https://github.com/user-attachments/assets/9e095098-39bd-461f-802d-091b3b883171" />
<img width="1440" height="900" alt="Captura de tela 2026-08-11 173305" src="https://github.com/user-attachments/assets/235594ff-19e4-4e60-908b-a1f81c435396" />
<img width="1440" height="900" alt="Captura de tela 2026-08-11 173255" src="https://github.com/user-attachments/assets/a0eb2bc8-8473-4d06-9928-80a63b1f757a" />
<img width="1440" height="900" alt="Captura de tela 2026-08-11 173245" src="https://github.com/user-attachments/assets/b94fd6e0-30e1-48e8-b1a0-7c239ced1bb7" />
<img width="1440" height="900" alt="Captura de tela 2026-08-11 173234" src="https://github.com/user-attachments/assets/20f6557e-490a-4172-9df9-bbacdce4dff2" />
<img width="1440" height="900" alt="Captura de tela 2026-08-11 173224" src="https://github.com/user-attachments/assets/46ed8e5b-b344-4d6b-b0c8-4901c0cc96da" />
<img width="1440" height="900" alt="Captura de tela 2026-08-11 173120" src="https://github.com/user-attachments/assets/63cb276d-fd80-4219-b822-798bbded482a" />

# 🚀 Sistema de Controle de Qualidade

Sistema web para **registro, acompanhamento, avaliação e correção de divergências de qualidade**, desenvolvido com arquitetura moderna e separação entre frontend e backend.

O projeto foi pensado para permitir que equipes de qualidade registrem ocorrências, acompanhem seus status, identifiquem divergências e documentem as ações corretivas realizadas.

---

## 📌 Status do Projeto

> 🟢 **Backend publicado e funcionando**
>
> 🟡 **Frontend em desenvolvimento**
>
> 🟡 **Integração frontend + API em andamento**

### Backend

🌐 API em produção:

[https://sistema-controle-qualidade.onrender.com](https://sistema-controle-qualidade.onrender.com)

Health Check:

```http
GET /health
```

Resposta esperada:

```json
{
  "status": "ok",
  "message": "Backend Controle de Qualidade funcionando!"
}
```

---

# 🎯 Objetivo

O Sistema de Controle de Qualidade tem como objetivo centralizar o processo de:

* Registro de divergências
* Classificação de ocorrências
* Acompanhamento de status
* Identificação de setores responsáveis
* Controle de produtos
* Controle de fornecedores
* Registro de ações corretivas
* Acompanhamento de prazos
* Análise dos indicadores de qualidade

A aplicação deverá fornecer uma interface simples e intuitiva para operação diária e, posteriormente, recursos analíticos para gestão.

---

# 🏗️ Arquitetura

A aplicação utiliza uma arquitetura desacoplada:

```text
┌──────────────────────────────┐
│          FRONTEND            │
│                              │
│ React / TypeScript           │
│ Dashboard                   │
│ CRUD                        │
│ Formulários                 │
│ Filtros                     │
│ Indicadores                 │
└──────────────┬───────────────┘
               │
               │ HTTP / REST
               ▼
┌──────────────────────────────┐
│           BACKEND            │
│                              │
│ Node.js                     │
│ Fastify                     │
│ TypeScript                  │
│ REST API                    │
└──────────────┬───────────────┘
               │
               │ MySQL
               ▼
┌──────────────────────────────┐
│        MYSQL DATABASE        │
│                              │
│ Clever Cloud                │
└──────────────────────────────┘
```

---

# 🧰 Tecnologias

## Backend

* Node.js
* TypeScript
* Fastify
* MySQL
* mysql2
* dotenv
* tsx
* TypeScript Compiler

## Frontend

Planejado/Em desenvolvimento:

* React
* TypeScript
* Vite
* HTML5
* CSS
* API REST
* Componentização
* Design responsivo

---

# 📂 Estrutura do Backend

```text
backend/
│
├── database/
│   ├── schema-deploy.sql
│   ├── seed.sql
│   ├── seed-db.ts
│   └── init-db.ts
│
├── src/
│   │
│   ├── app.ts
│   ├── server.ts
│   │
│   ├── config/
│   │   ├── database.ts
│   │   └── env.ts
│   │
│   └── modules/
│       │
│       ├── quality/
│       │   ├── quality.controller.ts
│       │   ├── quality.repository.ts
│       │   ├── quality.routes.ts
│       │   ├── quality.schema.ts
│       │   ├── quality.service.ts
│       │   └── quality.types.ts
│       │
│       └── quality-records/
│           ├── quality-records.controller.ts
│           ├── quality-records.repository.ts
│           ├── quality-records.routes.ts
│           ├── quality-records.schema.ts
│           ├── quality-records.service.ts
│           └── quality-records.types.ts
│
├── package.json
├── package-lock.json
├── tsconfig.json
├── Dockerfile
└── .env
```

---

# 🗄️ Banco de Dados

O banco utilizado é **MySQL**, hospedado no **Clever Cloud**.

O schema principal possui as seguintes entidades:

```text
sectors
   │
   ├──────────────┐
   │              │
statuses      quality_records
                  │
        ┌─────────┼─────────┐
        │         │         │
 products    suppliers   divergence_types
```

## Tabelas

### `sectors`

Setores responsáveis pelos registros.

Principais campos:

```text
id
name
active
created_at
updated_at
```

### `statuses`

Status dos registros de qualidade.

```text
id
name
active
created_at
updated_at
```

### `divergence_types`

Tipos de divergência encontrados.

```text
id
code
name
active
created_at
updated_at
```

### `suppliers`

Fornecedores relacionados aos registros.

```text
id
name
active
created_at
updated_at
```

### `products`

Produtos envolvidos nas ocorrências.

```text
id
sku
description
supplier_id
active
created_at
updated_at
```

### `quality_records`

Tabela principal do sistema.

```text
id
sector_id
status_id
divergence_type_id
product_id
supplier_id
quantity
observation
correction_action
observation_date
correction_date
responsible
created_at
updated_at
```

---


<img width="905" height="654" alt="Captura de tela 2026-08-11 174342" src="https://github.com/user-attachments/assets/3da7e460-8e78-450d-bf56-6620e43a2c68" />


# 🔌 API REST

Base URL:

```text
https://sistema-controle-qualidade.onrender.com/api
```

---

## Health Check

```http
GET /health
```

Exemplo:

```bash
curl https://sistema-controle-qualidade.onrender.com/health
```

---

# 📋 Quality Records

## Listar registros

```http
GET /api/quality
```

Resposta:

```json
{
  "success": true,
  "data": []
}
```

---

## Buscar registro

```http
GET /api/quality/:id
```

Exemplo:

```http
GET /api/quality/1
```

---

## Criar registro

```http
POST /api/quality
```

Exemplo:

```json
{
  "sector_id": 1,
  "status_id": 1,
  "divergence_type_id": 1,
  "product_id": 1,
  "supplier_id": 1,
  "quantity": 10,
  "observation": "Divergência encontrada durante inspeção.",
  "correction_action": "Realizar conferência do material.",
  "observation_date": "2026-08-11",
  "correction_date": null,
  "responsible": "Responsável pela qualidade"
}
```

---

## Atualizar registro

```http
PUT /api/quality/:id
```

Exemplo:

```http
PUT /api/quality/1
```

---

## Excluir registro

```http
DELETE /api/quality/:id
```

---

# 📚 Catálogos

O frontend deve utilizar os catálogos fornecidos pela API.

## Setores

```http
GET /api/catalogs/sectors
```

## Status

```http
GET /api/catalogs/statuses
```

## Tipos de divergência

```http
GET /api/catalogs/divergence-types
```

## Fornecedores

```http
GET /api/catalogs/suppliers
```

## Produtos

```http
GET /api/catalogs/products
```

> ⚠️ O frontend não deve utilizar dados fictícios ou listas hardcoded quando os dados puderem ser obtidos através da API.

---

# 🖥️ Frontend

O frontend será responsável pela experiência do usuário.

## Principais telas

### Dashboard

Deverá apresentar:

* Total de registros
* Registros pendentes
* Registros corrigidos
* Registros por setor
* Registros por status
* Registros por tipo de divergência
* Indicadores de qualidade
* Gráficos
* Resumos operacionais

---

### Registros de Qualidade

Funcionalidades:

* Listagem
* Pesquisa
* Filtros
* Ordenação
* Paginação
* Visualização
* Criação
* Edição
* Exclusão

---

### Novo Registro

Formulário com:

* Setor
* Status
* Tipo de divergência
* Produto
* Fornecedor
* Quantidade
* Observação
* Ação corretiva
* Data da observação
* Data da correção
* Responsável

---

# 🎨 Requisitos de UX/UI

O frontend deve seguir princípios de aplicação profissional.

### Responsividade

A aplicação deverá funcionar em:

* Desktop
* Notebook
* Tablet
* Smartphone

### Estados da aplicação

Toda operação que depender da API deve possuir:

```text
Loading
Success
Empty
Error
```

Exemplo:

```text
Carregando registros...

Nenhum registro encontrado.

Erro ao carregar registros.

Registros carregados com sucesso.
```

---

# ♿ Acessibilidade

O frontend deve seguir boas práticas de acessibilidade.

Priorizar:

* HTML semântico
* Labels associados aos inputs
* Navegação por teclado
* Foco visível
* Contraste adequado
* `aria-label` quando necessário
* Mensagens de erro acessíveis
* Botões semanticamente corretos
* Estados de loading comunicáveis
* Compatibilidade com leitores de tela

---

# 🔐 Variáveis de Ambiente

A URL da API não deve ficar espalhada pelo código.

Exemplo:

```env
VITE_API_URL=https://sistema-controle-qualidade.onrender.com/api
```

No frontend:

```typescript
const API_URL = import.meta.env.VITE_API_URL;
```

---

# 🧪 Validação do Backend

Antes de desenvolver funcionalidades no frontend, a API pode ser validada através do `curl`.

### Health

```bash
curl https://sistema-controle-qualidade.onrender.com/health
```

### Status

```bash
curl https://sistema-controle-qualidade.onrender.com/api/catalogs/statuses
```

### Setores

```bash
curl https://sistema-controle-qualidade.onrender.com/api/catalogs/sectors
```

### Tipos de divergência

```bash
curl https://sistema-controle-qualidade.onrender.com/api/catalogs/divergence-types
```

### Fornecedores

```bash
curl https://sistema-controle-qualidade.onrender.com/api/catalogs/suppliers
```

### Produtos

```bash
curl https://sistema-controle-qualidade.onrender.com/api/catalogs/products
```

---

# 🚀 Deploy

## Backend

O backend está hospedado no:

```text
Render
```

URL:

```text
https://sistema-controle-qualidade.onrender.com
```

## Banco

Banco MySQL hospedado no:

```text
Clever Cloud
```

---

# 🔄 Fluxo de Deploy

```text
Desenvolvimento
      │
      ▼
Git
      │
      ▼
GitHub
      │
      ├───────────────┐
      ▼               ▼
   Render         Frontend
      │               │
      ▼               ▼
 Backend API       Deploy Frontend
      │
      ▼
Clever Cloud
   MySQL
```

---

# 📋 Roadmap

## 🔴 Fase 1 — Backend

* [x] Estrutura Fastify
* [x] TypeScript
* [x] Configuração MySQL
* [x] Schema do banco
* [x] Seed
* [x] CRUD de qualidade
* [x] API de catálogos
* [x] Health Check
* [x] Build TypeScript
* [x] Deploy no Render
* [x] Conexão com Clever Cloud

---

## 🟠 Fase 2 — Frontend

* [ ] Estrutura React
* [ ] Configuração TypeScript
* [ ] Configuração da API
* [ ] Layout principal
* [ ] Sidebar
* [ ] Header
* [ ] Dashboard
* [ ] Listagem de registros
* [ ] Formulário de criação
* [ ] Formulário de edição
* [ ] Exclusão
* [ ] Filtros
* [ ] Busca
* [ ] Catálogos
* [ ] Loading states
* [ ] Empty states
* [ ] Error states
* [ ] Responsividade
* [ ] Acessibilidade

---

## 🟡 Fase 3 — Integração

* [ ] Integrar GET
* [ ] Integrar POST
* [ ] Integrar PUT
* [ ] Integrar DELETE
* [ ] Integrar setores
* [ ] Integrar status
* [ ] Integrar tipos de divergência
* [ ] Integrar fornecedores
* [ ] Integrar produtos
* [ ] Tratamento global de erros
* [ ] Feedback das operações

---

## 🟢 Fase 4 — Evolução

Possíveis funcionalidades futuras:

* [ ] Autenticação
* [ ] Controle de usuários
* [ ] Permissões
* [ ] Auditoria
* [ ] Histórico de alterações
* [ ] Exportação Excel
* [ ] Exportação PDF
* [ ] Dashboard avançado
* [ ] Indicadores por período
* [ ] Relatórios
* [ ] Notificações
* [ ] Anexos/evidências fotográficas
* [ ] Workflow de aprovação
* [ ] Score de qualidade

---

# 📊 Fluxo Principal

```text
Usuário
   │
   ▼
Dashboard
   │
   ├── Consultar indicadores
   │
   └── Registros
          │
          ├── Listar
          ├── Filtrar
          ├── Visualizar
          ├── Criar
          ├── Editar
          └── Excluir
                 │
                 ▼
              REST API
                 │
                 ▼
               MySQL
```

---

# 🧱 Princípios do Projeto

O desenvolvimento deve priorizar:

* Clean Code
* SOLID
* Separação de responsabilidades
* Componentização
* Reutilização
* Tipagem forte
* Segurança
* Acessibilidade
* Responsividade
* Manutenibilidade
* Escalabilidade
* Código simples e legível

---

# 👨‍💻 Desenvolvimento

Projeto desenvolvido para fins de **gestão e controle de qualidade**, com arquitetura preparada para evolução futura.

## Branch principal

```text
main
```

## Backend

```text
Node.js + Fastify + TypeScript + MySQL
```

## Frontend

```text
React + TypeScript
```

---

# 📌 Observações Importantes

### API

O frontend deve consumir exclusivamente a API publicada:

```text
https://sistema-controle-qualidade.onrender.com
```

### Banco

O frontend **não possui acesso direto ao MySQL**.

O fluxo correto é:

```text
Frontend
   ↓
REST API
   ↓
Backend
   ↓
MySQL
```

Nunca:

```text
Frontend
   ↓
MySQL
```

---

# 🏁 Objetivo Final

Entregar uma aplicação web profissional capaz de centralizar o processo de controle de qualidade, permitindo que a equipe:

> **Registre → Analise → Classifique → Corrija → Acompanhe → Meça**

todas as divergências de qualidade em um único sistema.

---

## 📄 Licença

Projeto em desenvolvimento.

Uso destinado ao projeto **Sistema de Controle de Qualidade**.
