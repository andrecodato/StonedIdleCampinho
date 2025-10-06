# 🌿 Skill de Cultivo - Documentação Completa

## 📋 Visão Geral

A skill de **Cultivo de Cannabis** é o primeiro sistema completo de gameplay implementado no Stoner Idle, inspirado nos sistemas de farming do Melvor Idle e Runescape.

---

## 🎮 Mecânicas Implementadas

### **1. Sistema de Plantio**
- **Slots de Cultivo**: Começa com 3 slots, pode expandir com upgrades
- **Strains Variadas**: 10 tipos diferentes, de comum a lendário
- **Progressão em Tempo Real**: Plantas crescem em tempo real com múltiplos estágios

### **2. Estágios de Crescimento**
Cada planta passa por 6 estágios:
1. 🌱 **Semente** (30s)
2. 🌿 **Broto** (60s)
3. 🍀 **Vegetativo** (90s)
4. 🌸 **Floração** (120s)
5. 🌺 **Madura** (90s)
6. ✨ **Pronta** (colheita!)

### **3. Sistema de Rega**
- Plantas precisam ser regadas periodicamente
- Intervalo de rega varia por strain (60-240s)
- **Planta murcha** se não regar em 2x o intervalo
- **Sem recompensa** se a planta murchar

### **4. Strains Disponíveis**

| Strain | Raridade | Nível | Tempo | Rendimento | Preço Semente |
|--------|----------|-------|-------|------------|---------------|
| 🌱 Bag Seed | Comum | 1 | 5 min | 1-3 | GRÁTIS |
| 💎 Northern Lights | Incomum | 5 | 8 min | 3-6 | 50 |
| ❄️ White Widow | Incomum | 10 | 9 min | 4-8 | 100 |
| 🫐 Blueberry | Raro | 15 | 10 min | 6-12 | 200 |
| ⚡ Sour Diesel | Raro | 20 | 11 min | 8-15 | 350 |
| 🍪 Girl Scout Cookies | Épico | 30 | 12 min | 10-20 | 600 |
| 🦍 Gorilla Glue | Épico | 40 | 13 min | 12-25 | 900 |
| 🌈 Zkittlez | Lendário | 50 | 15 min | 15-35 | 1500 |
| 🎂 Wedding Cake | Lendário | 60 | 16 min | 20-45 | 2500 |
| 🍬 Runtz | Lendário | 75 | 18 min | 25-60 | 4000 |

### **5. Sistema de Upgrades**

#### **Expansão de Slots**
- 🏠 **Estufa Pequena**: +1 slot (100 buds)
- 🏡 **Estufa Média**: +2 slots (500 buds)
- 🏘️ **Estufa Grande**: +3 slots (2000 buds)

#### **Melhorias de Produção**
- 💊 **Fertilizante Premium**: +10% rendimento/nível (máx 5 níveis)
- 💡 **Luz UV Potente**: +5% velocidade/nível (máx 10 níveis)
- 🌡️ **Controle de Clima**: +5% chance de colheita perfeita/nível (máx 5 níveis)

#### **Automação**
- 💧 **Sistema de Irrigação**: Rega automática a cada 2 min (1000 buds)

### **6. Sistema de Estatísticas**
- 📊 **Colheitas Totais**: Quantas vezes você colheu
- 🌿 **Buds Colhidos**: Total de buds ganhos
- ⭐ **Colheitas Perfeitas**: Colheitas no timing exato
- 💀 **Plantas Murchas**: Plantas que você deixou murchar
- 🏆 **Melhor Strain**: Sua strain mais lucrativa

---

## 🏗️ Arquitetura de Código

### **Componentes Criados**

```
components/game/cultivo/
├── PlantSlotCard.tsx         # Card individual de slot de plantio
├── StrainSelector.tsx        # Seletor de strains para plantar
├── CultivoUpgrades.tsx       # Lista de upgrades disponíveis
└── CultivoStatsDisplay.tsx   # Display de estatísticas
```

### **Hooks**

```typescript
// hooks/useCultivo.ts
const {
  slots,                    // Array de slots de plantio
  availableStrains,         // Strains desbloqueadas
  selectedStrain,           // Strain selecionada
  setSelectedStrain,        // Selecionar strain
  upgrades,                 // Upgrades disponíveis
  stats,                    // Estatísticas de cultivo
  handlePlant,              // Plantar em um slot
  handleWater,              // Regar uma planta
  handleHarvest,            // Colher planta
  handlePurchaseUpgrade,    // Comprar upgrade
} = useCultivo(playerLevel, playerBuds, onUpdateBuds);
```

### **Tipos**

```typescript
// types/cultivo.types.ts
- PlantStage          // Estágio de crescimento
- Strain              // Dados de uma strain
- PlantSlot           // Slot de plantio
- CultivoUpgrade      // Upgrade de cultivo
- CultivoStats        // Estatísticas
```

### **Constantes**

```typescript
// constants/cultivo.ts
- PLANT_STAGES        // 6 estágios de crescimento
- STRAINS             // 10 strains diferentes
- CULTIVO_UPGRADES    // 7 upgrades disponíveis
- RARITY_COLORS       // Cores por raridade
- RARITY_GLOW         // Efeitos visuais
```

---

## 🎨 Design System

### **Cores por Raridade**
- **Comum**: Cinza (`#9ca3af`)
- **Incomum**: Verde (`#22c55e`)
- **Raro**: Azul (`#3b82f6`)
- **Épico**: Roxo (`#a855f7`)
- **Lendário**: Amarelo (`#fbbf24`) com pulse

### **Estados Visuais**
- 🟢 **Pronta para colheita**: Border verde pulsante
- 🟡 **Precisa de água**: Border amarelo
- 🔴 **Murcha**: Border vermelho
- ⚫ **Vazio**: Border cinza

---

## 🚀 Como Jogar

### **Passo 1: Selecionar Strain**
1. Veja as strains disponíveis no seletor
2. Strains bloqueadas mostram nível necessário (🔒)
3. Clique na strain desejada

### **Passo 2: Plantar**
1. Com uma strain selecionada, clique em "Plantar" em um slot vazio
2. O custo da semente será deduzido automaticamente
3. A planta começa a crescer imediatamente

### **Passo 3: Regar**
1. Fique de olho no alerta 💧 "Precisa de água!"
2. Clique em "Regar" quando necessário
3. **Importante**: Não deixe passar de 2x o intervalo ou a planta murcha!

### **Passo 4: Colher**
1. Quando a planta atingir 100% (✨), clique em "Colher"
2. Ganhe buds conforme o rendimento da strain
3. Colheitas perfeitas (exatamente 100%) dão bônus!

### **Passo 5: Upgrades**
1. Use seus buds para comprar upgrades
2. Comece com **Estufa Pequena** (+1 slot)
3. Invista em **Fertilizante** para mais rendimento
4. **Sistema de Irrigação** automatiza a rega!

---

## 🎯 Estratégias

### **Iniciante (Níveis 1-10)**
1. Plante **Bag Seed** (grátis) para começar
2. Compre **Estufa Pequena** logo que possível
3. Desbloqueie **Northern Lights** (nível 5)

### **Intermediário (Níveis 10-30)**
1. Foque em **White Widow** e **Blueberry**
2. Invista em **Fertilizante Premium** (nível 3-4)
3. Compre **Estufa Média** para +2 slots

### **Avançado (Níveis 30+)**
1. Cultive strains épicas (**Girl Scout Cookies**, **Gorilla Glue**)
2. Maximize **Luz UV** (10 níveis) para velocidade
3. Compre **Sistema de Irrigação** para automação
4. Invista na **Estufa Grande** (+3 slots)

### **Endgame (Níveis 50+)**
1. Cultive apenas strains lendárias
2. Maximize todos os upgrades
3. Foque em colheitas perfeitas
4. **Runtz** (nível 75) é a melhor strain do jogo!

---

## 📊 Fórmulas de Cálculo

### **Rendimento**
```typescript
baseYield = random(strain.yield.min, strain.yield.max)
bonusYield = baseYield * (yieldBonus / 100)
totalYield = baseYield + bonusYield
```

### **Velocidade de Crescimento**
```typescript
totalTime = strain.plantTime * (1 - speedBonus / 100)
progress = (elapsed / totalTime) * 100
```

### **Custo de Upgrade**
```typescript
upgradeCost = baseCost * Math.pow(1.5, currentLevel)
```

---

## 🔮 Próximas Features

### **Planejado**
- [ ] Sistema de níveis e experiência
- [ ] Eventos aleatórios (pragas, clima)
- [ ] Cruzamento de strains (breeding)
- [ ] Qualidade de colheita (normal, boa, perfeita, lendária)
- [ ] Conquistas e desafios
- [ ] Mercado para vender/comprar strains
- [ ] Hobbies que dão bônus passivos

### **Ideias Futuras**
- [ ] Estações do ano afetando crescimento
- [ ] NPCs que pedem strains específicas
- [ ] Mini-games durante o cultivo
- [ ] Competições de cultivo
- [ ] Sistema de prestígio/rebirth

---

## 🐛 Bugs Conhecidos

- [x] ✅ **RESOLVIDO**: Campo `level` adicionado ao Player no backend
- [x] ✅ **RESOLVIDO**: Slots de plantio agora persistem no banco de dados
- [x] ✅ **RESOLVIDO**: Upgrades e estatísticas agora persistem corretamente

---

## 📝 Notas do Desenvolvedor

Esta página foi criada como prova de conceito do sistema de skills do Stoner Idle. A arquitetura foi desenhada para ser:

- ✅ **Modular**: Componentes reutilizáveis
- ✅ **Escalável**: Fácil adicionar novas strains/upgrades
- ✅ **Performática**: Otimizações com useCallback e intervalos
- ✅ **Extensível**: Base para outras skills (Culinária, Artesanato, etc)

O código serve como template para criar as próximas skills seguindo o mesmo padrão!

---

**Desenvolvido com 🌿 para a comunidade stoner**
