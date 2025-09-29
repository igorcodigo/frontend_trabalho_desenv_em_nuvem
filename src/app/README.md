# Estruturando Rotas no Next.js App Directory

Este documento descreve as convenções para a criação de rotas no diretório `app` do Next.js, abordando a diferença entre o uso de pastas aninhadas e nomes de pastas com hífen.

## Pastas Aninhadas (Nested Routes)

Use pastas aninhadas quando cada segmento da URL representa uma entidade ou agrupamento distinto, e cada palavra tem valor semântico por si só.

**Resultado:** Cria rotas aninhadas.

- **URL Gerada:** `/meus/produtos`
- **Estrutura de Arquivos:**

  ```text
  app/
  └── meus/
      └── produtos/
          └── page.tsx
  ```

## Nomes Compostos com Hífen (Kebab-case)

Use nomes de pasta com hífen (kebab-case) quando as palavras juntas formam um único conceito ou rota. Esta é a convenção recomendada pelo Next.js para nomes de arquivos e pastas com múltiplas palavras.

**Resultado:** Cria uma rota única.

- **URL Gerada:** `/meus-produtos`
- **Estrutura de Arquivos:**

  ```text
  app/
  └── meus-produtos/
      └── page.tsx
  ```

---

## Resumo

- **`/meus/produtos`**: Ideal para cenários como "ver os `produtos` que pertencem a `meus`". A estrutura é hierárquica.
- **`/meus-produtos`**: Ideal para uma página chamada "Meus Produtos". A estrutura é plana.
