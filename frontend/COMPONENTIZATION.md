# 🌿 Cannabis Cultivator - Estrutura Componentizada

## 📁 Estrutura de Arquivos

```
frontend/src/
├── app/
│   └── game/
│       └── page.tsx                 # 🎯 Orquestrador (81 linhas - antes: 392 linhas)
│
├── components/game/
│   ├── layout/
│   │   ├── GameLayout.tsx          # Layout geral (sidebar + main)
│   │   ├── GameSidebar.tsx         # Sidebar de navegação
│   │   ├── GameHeader.tsx          # Header com recursos/EXP
│   │   └── PlayerInfo.tsx          # Info do jogador
│   │
│   ├── resources/
│   │   ├── ResourceDisplay.tsx     # Display de recurso individual
│   │   ├── ExperienceBar.tsx       # Barra de EXP
│   │   └── SkillLevel.tsx          # Nível de habilidade
│   │
│   ├── actions/
│   │   ├── ActionCard.tsx          # Card de ação (árvore, pesca, etc)
│   │   ├── ActionGrid.tsx          # Grid de cards de ação
│   │   └── ActionProgress.tsx      # Barra de progresso de ação
│   │
│   ├── tabs/
│   │   ├── CultivoTab.tsx          # Aba de Corte de Lenha
│   │   ├── AgriculturaTab.tsx      # Aba de Agricultura
│   │   ├── MunicipioTab.tsx        # Aba de Município
│   │   └── LojaTab.tsx             # Aba de Loja
│   │
│   └── common/
│       ├── LoadingScreen.tsx       # Tela de carregamento
│       ├── EmptyState.tsx          # Estado vazio/em desenvolvimento
│       └── LockIndicator.tsx       # Indicador de bloqueio
│
├── hooks/
│   ├── usePlayerData.ts            # Hook para dados do jogador
│   ├── useGameActions.ts           # Hook para ações do jogo
│   └── usePassiveIncome.ts         # Hook para geração passiva
│
├── types/
│   └── game.types.ts               # Tipos TypeScript do jogo
│
└── constants/
    └── actions.ts                  # Dados de ações (árvores, etc)
```

---

## 🎯 Benefícios da Componentização

### ✅ **Antes vs Depois**

| Métrica | Antes | Depois |
|---------|-------|--------|
| Linhas no page.tsx | **392 linhas** | **81 linhas** (-79.3%) |
| Componentes | **1 arquivo monolítico** | **22 componentes modulares** |
| Hooks | **Inline useEffect/useState** | **3 hooks customizados** |
| Manutenibilidade | ⚠️ Difícil | ✅ Fácil |
| Reutilização | ❌ Impossível | ✅ Total |
| Testabilidade | ⚠️ Complexa | ✅ Simples |

---

## 🔧 Como Funciona

### **1. Orquestrador Principal** (`page.tsx`)
```tsx
// Apenas gerencia estado global e coordena componentes
export default function GamePage() {
  const { player, isLoading } = usePlayerData();
  const { handleAction } = useGameActions();
  
  return (
    <GameLayout>
      <CultivoTab onAction={handleAction} />
    </GameLayout>
  );
}
```

### **2. Custom Hooks**

#### `usePlayerData()`
- Carrega dados do jogador
- Gerencia localStorage
- Sincroniza com API

#### `useGameActions()`
- Gerencia ações (cortar árvore, etc)
- Controla progresso/animação
- Atualiza recompensas

#### `usePassiveIncome()`
- Geração passiva de recursos
- Sincroniza com backend

### **3. Componentes Reutilizáveis**

#### `ActionCard`
```tsx
// Pode ser usado para árvores, pesca, mineração, etc
<ActionCard
  action={treeData}
  isActive={activeAction === 'tree'}
  progress={75}
  onAction={handleAction}
/>
```

#### `EmptyState`
```tsx
// Estado padrão para features em desenvolvimento
<EmptyState 
  icon="🚧"
  title="Em Desenvolvimento"
  description="Disponível em breve!"
/>
```

---

## 📦 Componentes por Categoria

### **Layout (4 componentes)**
- `GameLayout` - Container principal
- `GameSidebar` - Menu de navegação
- `GameHeader` - Recursos + EXP
- `PlayerInfo` - Info do jogador + logout

### **Recursos (3 componentes)**
- `ResourceDisplay` - Display de recurso único
- `ExperienceBar` - Barra de experiência
- `SkillLevel` - Nível de habilidade

### **Ações (3 componentes)**
- `ActionCard` - Card de ação individual
- `ActionGrid` - Grid de cards
- `ActionProgress` - Barra de progresso

### **Tabs (4 componentes)**
- `CultivoTab` - Corte de lenha
- `AgriculturaTab` - Agricultura
- `MunicipioTab` - Município
- `LojaTab` - Loja de strains

### **Comuns (3 componentes)**
- `LoadingScreen` - Tela de loading
- `EmptyState` - Estado vazio
- `LockIndicator` - Indicador de bloqueio

---

## 🚀 Próximos Passos

### **Fácil de Adicionar:**

#### Nova Habilidade (ex: Pesca)
1. Adicionar constantes em `constants/fishing.ts`
2. Criar `FishingTab.tsx` (copiar de CultivoTab)
3. Reusar `ActionGrid` e `ActionCard`
4. Adicionar ao menu no `GameSidebar`

#### Novo Recurso (ex: Sementes)
1. Adicionar tipo em `game.types.ts`
2. Usar `ResourceDisplay` no header
3. Integrar com backend

#### Nova Mecânica
1. Criar hook customizado (ex: `useCrafting.ts`)
2. Criar componentes específicos
3. Integrar no layout existente

---

## 🎨 Design System

### **Cores (Melvor-Inspired)**
```css
--bg-primary: #1a1d29
--bg-secondary: #252836
--bg-tertiary: #2d3142
--accent-green: #22c55e
--accent-yellow: #fbbf24
--text-primary: #ffffff
--text-secondary: #9ca3af
```

### **Componentes Padrão**
- Cards: `bg-[#2d3142] border-2 rounded-lg`
- Botões: `hover:bg-gray-700 transition-colors`
- Progress: `bg-gray-700 h-3 rounded-full`

---

## 📝 Convenções de Código

### **Nomenclatura**
- Componentes: PascalCase (`ActionCard.tsx`)
- Hooks: camelCase com prefixo `use` (`usePlayerData.ts`)
- Tipos: PascalCase com sufixo (`ActionData`, `TabType`)

### **Props**
- Sempre tipar com interface
- Usar destructuring
- Valores opcionais com `?`

### **Estrutura de Arquivo**
```tsx
// 1. Imports
import { Component } from 'library';

// 2. Interfaces
interface Props { }

// 3. Componente
export const Component = ({ props }: Props) => {
  // Lógica
  return <div>JSX</div>;
};
```

---

## ✅ Checklist de Qualidade

- [x] Todos componentes tipados com TypeScript
- [x] Separação de responsabilidades clara
- [x] Hooks customizados para lógica reutilizável
- [x] Constantes separadas em arquivos
- [x] Props documentadas com interfaces
- [x] Componentes pequenos (<100 linhas)
- [x] Nomenclatura consistente
- [x] Design system unificado

---

## 🎓 Aprendizados

### **Antes:**
❌ 392 linhas em um arquivo  
❌ Lógica misturada com UI  
❌ Difícil de testar  
❌ Impossível reutilizar  

### **Depois:**
✅ 22 componentes modulares  
✅ Separação clara de responsabilidades  
✅ Fácil de testar individualmente  
✅ Componentes reutilizáveis  
✅ Escalável para novas features  

---

**Documentação gerada automaticamente após componentização completa**  
*Cannabis Cultivator - Idle Game Inspired by Melvor Idle*
