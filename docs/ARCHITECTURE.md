# Architecture.md — Clean Architecture para MindEase

Este documento define a **arquitetura do projeto MindEase** com base em **Clean Architecture**, adaptado para aplicações React/React Native e módulos compartilhados. O objetivo é **separar responsabilidades, reduzir acoplamento e facilitar testabilidade, manutenção e evolução da plataforma**.

---

## 📌 1. Visão Geral

Clean Architecture promove uma organização do código em **camadas concêntricas**, onde:

- **Camadas internas** nunca dependem de camadas externas;
- As **dependências fluem de fora para dentro** (do interface para a lógica de negócio);
- Cada camada tem responsabilidades bem definidas, com abstrações e implementações desacopladas. :contentReference[oaicite:0]{index=0}

Aplicado ao frontend React/React Native, teremos:

presentation → layer de UI (React/React Native)
application → lógica de casos de uso
domain → regras de negócio e entidades
infrastructure→ integração com APIs/serviços externos

---

## 🧱 2. Camadas da Arquitetura

### 🔹 2.1 Domain (Domínio)

**Função:**  
Contém as entidades, regras e modelos de negócio que representam a essência da aplicação.  
Essa camada **não depende de nenhuma tecnologia específica (React, DB, API, etc.)** — é o núcleo do seu sistema. :contentReference[oaicite:1]{index=1}

**O que colocar aqui:**

- Entidades (tipos/objetos de negócio)
- Interfaces de Repositórios e Use Cases
- Regras de validação, invariantes e lógica de domínio

**Importante:**  
Nunca importar módulos externos ou dependências de UI/infra.

---

### 🔹 2.2 Application (Casos de Uso)

**Função:**  
Orquestra os fluxos da aplicação: coordena chamadas da UI para o domínio, manipula respostas e aplica regras específicas de aplicação. Essa camada **depende apenas do Domain**. :contentReference[oaicite:2]{index=2}

**O que colocar aqui:**

- Casos de uso (UseCases)
- Serviços de aplicação que implementam lógica de interação
- Interfaces que expõem ações do domínio para camadas externas

---

### 🔹 2.3 Presentation (Apresentação)

**Função:**  
Responsável por tudo que é relacionado à **interface do usuário (UI)** — páginas, layouts, hooks que lidam com estado de UI, componentes visuais. :contentReference[oaicite:3]{index=3}

**O que colocar aqui:**

- Componentes React/React Native
- Páginas e rotas
- Hooks que fazem integração com UseCases
- Estilos, temas e lógica de navegação

**Regras principais:**

- Esta camada **pode chamar** `Application` e _conhecer_ `Domain` —
  mas **nunca** o contrário.
- Não deve conter lógica de regras de negócio — apenas apresentação e orquestração.

---

### 🔹 2.4 Infrastructure (Infra)

**Função:**  
Implementa integrações externas: comunicação com APIs, armazenamento, serviços HTTP, adapters e adaptadores concretos. :contentReference[oaicite:4]{index=4}

**O que colocar aqui:**

- Clientes de API (fetch/axios)
- Adaptadores de armazenamento (localStorage, async storage)
- Serviços de integração com backend (SDKs, auth, etc.)

---

## 📁 3. Organização de Pastas (Exemplo Proposto)

Uma forma clara de organizar seu monorepo MindEase é:

/src
|── domain/
| ├── entities/
| ├── interfaces/
| └── valueObjects/
|
|── application/
| ├── useCases/
| ├── services/
| └── dtos/
|
|── infrastructure/
| ├── api/
| │ ├── clients/
| │ └── endpoints/
| └── adapters/
|
|── presentation/
| ├── components/
| ├── pages/
| └── hooks/
|
|── shared/
├── ui/ ← Biblioteca UI compartilhada
├── hooks/ ← Hooks reutilizáveis
└── utils/

### 📌 Sobre `shared/ui`

Este pacote _UI_ deve conter apenas **componentes puros e reutilizáveis**, independentemente da lógica de negócio:

- Botões, inputs, modais, tipografia, grids, tokens de design
- Componentes atômicos ou molecular
- Componentes que não dependem de lógica de caso de uso

A lógica que manipula dados específicos do MindEase **não deve estar aqui** — ela fica nos componentes da camada de _presentation_ ou nos _UseCases_. :contentReference[oaicite:5]{index=5}

---

## 🔁 4. Regras de Dependência

Seguindo Clean Architecture:

presentation → application → domain
infrastructure → application/domain

### Regras claras

1. **Domain**: nunca depende de Application, Presentation ou Infra.
2. **Application**: depende de Domain, mas não de Presentation ou Infra.
3. **Presentation**: depende de Application e/or Domain.
4. **Infrastructure**: implementa interfaces, mas não referencia Presentation. :contentReference[oaicite:6]{index=6}

---

## 📌 5. Boas Práticas

✔️ **Inversão de dependências:** Use interfaces em `Domain/Application` e implemente em `Infrastructure`.  
✔️ **Testes:**

- Testes de unidade para `Domain` e `Application`.
- Testes de integração para interações com `Infrastructure` e UI.  
  ✔️ **Separação de responsabilidade:** Evite lógica de negocio dentro de componentes React — centralize em _use cases_ ou serviços de aplicação.

---

## 🧪 6. Exemplos de Módulos

### Use Case (exemplo)

src/application/useCases/auth/LoginUseCase.ts

### Infra Adapter

src/infrastructure/api/authApi.ts

### UI Component

---

## 📌 Benefícios Esperados

- **Manutenibilidade:** mudanças no framework não impactam o core.
- **Testabilidade:** regras de negócio isoladas tornam testes confiáveis.
- **Escalabilidade:** novas features podem ser adicionadas modularmente.
- **Desacoplamento:** partes externas (UI/Infra) não contaminam o núcleo.
