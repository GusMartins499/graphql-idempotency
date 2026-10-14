# graphql-idempotency

[English](README.md) | Português

API GraphQL de estudo para entender **chaves de idempotência**: como garantir que
repetir a mesma requisição (clique duplo, retry após timeout, rede instável) não
crie o mesmo recurso duas vezes.

## Stack

- Node.js 24+ (TypeScript executado direto, sem build)
- [GraphQL Yoga](https://the-guild.dev/graphql/yoga-server) com schema code-first (`graphql-js`)
- [Drizzle ORM](https://orm.drizzle.team/) + SQLite (`node:sqlite`)
- Testes com `node:test`, sem bibliotecas externas

## Como rodar

```bash
npm install
cp .env.example .env
npm run db:migrate
npm run dev
```

A API sobe em `http://localhost:3333/graphql`, com o GraphiQL disponível no navegador.

## Como funciona aqui

A mutation `createProduct` exige o header `Idempotency-Key`. Tudo acontece dentro
de uma única transação:

| Situação | Resultado |
|---|---|
| Sem o header | erro `IDEMPOTENCY_KEY_REQUIRED`, nada é criado |
| Chave nova | cria o produto e grava a chave |
| Chave já usada, mesmo input | devolve o produto criado na primeira vez |
| Chave já usada, input diferente | erro `IDEMPOTENCY_KEY_REUSED` |

## Testando no GraphiQL

Abra `http://localhost:3333/graphql` e, na aba **Headers**, informe:

```json
{ "idempotency-key": "minha-chave-1" }
```

Execute várias vezes:

```graphql
mutation {
  createProduct(input: { name: "Mug", priceCents: 2990 }) {
    id
    name
    priceCents
  }
}
```

- O `id` volta sempre o mesmo.
- Troque a chave: um produto novo é criado.
- Mantenha a chave e mude o `priceCents`: erro `IDEMPOTENCY_KEY_REUSED`.
- Remova o header: erro `IDEMPOTENCY_KEY_REQUIRED`.

## Estrutura

```
src/
  db/
    schemas/            tabelas do drizzle (products, idempotency_keys)
    migrations/         migrations geradas pelo drizzle-kit
  modules/
    product/
      type.ts           tipo GraphQL Product
      resolvers/        uma operação GraphQL por arquivo
      repositories/     um acesso ao banco por arquivo
    idempotency/
      repositories/     leitura e gravação das chaves
      hash-request.ts   hash do input
      errors.ts         erros IDEMPOTENCY_KEY_*
  schema/               Query, Mutation e o schema final
test/                   espelha src/, com os testes de cada módulo
```

## Limitações conscientes

Simplificações feitas para manter o foco no conceito, e o que mudaria num
sistema em produção:

- **Um único processo.** A proteção contra concorrência depende da transação
  síncrona do SQLite. Com várias instâncias e um banco como Postgres, duas
  requisições poderiam ler "chave não existe" ao mesmo tempo. A chave primária
  impediria a duplicata, mas a segunda receberia um erro de unique em vez da
  resposta repetida. A solução usual é gravar a chave antes, com status
  `in_progress`, e tratar o conflito.
- **A resposta repetida reflete o estado atual.** A tabela guarda só o `id` do
  produto criado, não uma cópia da resposta original.
- **Chaves não expiram.** Em produção, costumam ser removidas após 24h ou alguns
  dias.
