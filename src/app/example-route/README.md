# Organização de Componentes Específicos por Rota

Uma excelente pergunta que leva a uma estratégia de organização avançada!

A mesma lógica se aplica. Se você tem um componente que é específico de uma única página (e não será reutilizado em nenhum outro lugar), você deve colocá-lo em uma pasta `_components` dentro da pasta daquela rota específica.

Vamos usar um exemplo prático. Suponha que você está criando uma página de Dashboard do Usuário, acessível em `seusite.com/dashboard`. Essa página terá vários componentes complexos que não fazem sentido em nenhum outro lugar, como um `GraficoDeAtividades` e um `ResumoDePerfil`.

Aqui está o passo a passo de como você organizaria isso:

## Passo 1: Criar a Rota e a Página

Primeiro, você cria a nova página, como já aprendeu:

- Crie a pasta `src/app/dashboard`.
- Dentro dela, crie o arquivo `page.tsx`.

Sua estrutura fica assim:

```text
src
└── app
    ├── ...
    └── dashboard
        └── page.tsx
```

### Passo 2: Criar a Pasta de Componentes Locais para a Rota

Agora, para organizar os componentes que pertencem apenas à página de dashboard:

- Dentro da pasta `src/app/dashboard`, crie uma nova pasta chamada `_components`.

Sua estrutura agora é:

```text
src
└── app
    ├── ...
    └── dashboard
        ├── _components  <-- PASTA PARA COMPONENTES DO DASHBOARD
        └── page.tsx
```

### Passo 3: Criar os Componentes Específicos

Agora você pode criar seus componentes específicos dentro dessa nova pasta.

- Crie o arquivo `src/app/dashboard/_components/GraficoDeAtividades.tsx`.
- Crie o arquivo `src/app/dashboard/_components/ResumoDePerfil.tsx`.

Sua estrutura final e organizada:

```text
src
└── app
    ├── ...
    └── dashboard
        ├── _components
        │   ├── GraficoDeAtividades.tsx
        │   └── ResumoDePerfil.tsx
        └── page.tsx
```

### Passo 4: Usar os Componentes na Página

Finalmente, dentro do arquivo `src/app/dashboard/page.tsx`, você pode importar e usar esses componentes locais com um caminho relativo, o que deixa muito claro que eles pertencem a essa seção do seu site.

```typescript
// src/app/dashboard/page.tsx

// Importando os componentes locais da mesma pasta da rota
import GraficoDeAtividades from "./_components/GraficoDeAtividades";
import ResumoDePerfil from "./_components/ResumoDePerfil";

// Importando um componente GLOBAL, reutilizável
import Button from "@/components/Button"; // Note o caminho '@/' para a pasta global

export default function DashboardPage() {
  return (
    <main className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Seu Dashboard</h1>

      {/* Usando o componente local de resumo */}
      <ResumoDePerfil />

      {/* Usando o componente local de gráfico */}
      <GraficoDeAtividades />

      <div className="mt-8">
        {/* Usando um componente GLOBAL que veio de src/components */}
        <Button>Exportar Relatório</Button>
      </div>
    </main>
  );
}
```

## Vantagens dessa Abordagem

- **Organização (Colocation)**: Tudo relacionado à rota `/dashboard` está dentro da pasta `dashboard`. Se você decidir apagar essa funcionalidade, basta apagar a pasta inteira.
- **Clareza**: Fica óbvio que `GraficoDeAtividades` é um componente que só existe para o dashboard. Você não vai procurá-lo na pasta global `src/components`.
- **Manutenção**: Facilita muito encontrar e editar os arquivos, pois eles estão logicamente agrupados pela funcionalidade/rota a que pertencem.

## Resumo

A regra é simples e escalável:

- **Componente Global/Reutilizável?** Coloque em `src/components`.
- **Componente Específico de uma ÚNICA rota?** Crie uma pasta `_components` dentro da pasta da rota e coloque-o lá.
