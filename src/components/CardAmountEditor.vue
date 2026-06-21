<script>
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {useForestsStore} from "@/stores/forests-store.js";
import {event} from "vue-gtag"
import {useGameStore} from "@/stores/game-store.js";
import {cardItselfMatchesSearch, normalizeCardSearchText, paramMatchesSearch} from "@/utils/card-search.js";

export default {
  name: "CardAmountEditor",
  components: {FontAwesomeIcon},
  props: {
    card: Object,
    forest: Object,
    searchQuery: {
      type: String,
      default: ''
    }
  },
  computed: {
    playerName() {
      return this.forest.playerName
    },
    distributedScoring() {
      return useGameStore().distributedScoring
    },
    activeCardSearch() {
      return normalizeCardSearchText(this.searchQuery).length > 0
    },
    cardItselfMatchesSearch() {
      return cardItselfMatchesSearch(this.card, this.searchQuery, key => this.$t(key))
    },
    visibleParams() {
      if (!this.activeCardSearch || this.cardItselfMatchesSearch)
        return this.card.params || []

      return (this.card.params || [])
          .filter(param => paramMatchesSearch(param, this.searchQuery, key => this.$t(key)))
    }
  },
  methods: {
    addCard() {
      useForestsStore().addCard(this.playerName, this.card.name)
      const cardNameEnglish = this.$t(this.card.name, 'en')
      event('cardAdded', {card: cardNameEnglish})
    },
    removeCard() {
      useForestsStore().removeCard(this.playerName, this.card.name)
    },
    paramAdd(param) {
      if (param.type === 'number')
        useForestsStore().addParam(this.playerName, this.card.name, param.name)
      else if (param.type === 'type')
        useForestsStore().addSymbolCount(this.playerName, param.symbol)
      else if (param.type === 'boolean')
        useForestsStore().toggleParam(this.playerName, this.card.name, param.name)
    },
    paramSub(param) {
      if (param.type === 'number')
        useForestsStore().subParam(this.playerName, this.card.name, param.name)
      else if (param.type === 'type')
        useForestsStore().subSymbolCount(this.playerName, param.symbol)
    }
  }
}
</script>

<template>
  <div class="card-editor-row mt-2">
    <div class="fw-bold count-cell">
      <span v-if="card.count > 0">{{ card.count }}&times;</span>
    </div>
    <div class="action-cell">
      <button @click="addCard"
              :class="'btn-' + card.symbols[0]"
              class="card-action-button w-100 btn btn-primary btn-sm text-start">
        <img v-for="(symbol, idx) in card.symbols" :src="'./img/symbols/' + symbol + '.png'" height="20"
             :class="{'ms-1': idx > 0}"/>
        <img v-if="card.name.startsWith('roe')" :src="'./img/symbols/' + card.type + '.png'" height="20"
             class="ms-1"/>
        <span class="card-action-label ms-2">{{ $t(card.name) }}</span>
      </button>
    </div>
    <div class="remove-cell">
      <button class="remove-button btn btn-outline-danger btn-sm" @click="removeCard">&times;</button>
    </div>
    <div class="points-cell text-start text-nowrap">
      <span v-if="card.count > 0 && card.symbols.indexOf('butterfly') < 0 ">{{ card.points }}</span>
    </div>
  </div>
  <div v-for="(param, idx) in visibleParams" :key="param.name">
    <div v-if="!param.distributed || distributedScoring"
         class="param-editor-row mt-1"
         :class="{'mb-3': visibleParams.length === idx+1}">
      <div class="fw-bold param-count-cell d-flex align-items-center">
        <span v-if="card.count > 0 && param.type === 'number'">{{ param.value }}</span>
        <span v-if="card.count > 0 && param.type === 'type'">{{ forest[param.symbol + 'Count'] }}</span>
        <span v-if="card.count > 0 && param.type === 'boolean'">
          <span v-if='param.value' class="text-success"><font-awesome-icon icon="check" size="lg"/></span>
         <span v-else class="text-danger"><font-awesome-icon icon="xmark" size="lg"/></span>
        </span>
      </div>
      <div class="action-cell">
        <button @click="paramAdd(param)" :class="'btn-' + card.symbols[0]"
                class="card-action-button btn btn-sm btn-primary text-start w-100">
          <img v-if="param.type === 'type'" :src="'./img/symbols/' + param.symbol + '.png'" :alt="$t(param.symbol)"
               height="20"/>
          <span class="card-action-label ps-2">{{ $t(param.name) }}</span>
        </button>
      </div>
      <div class="remove-cell">
        <button v-if="param.type !== 'boolean'" class="remove-button btn btn-outline-danger btn-sm" @click="paramSub(param)">
          &times;
        </button>
      </div>
      <div class="points-cell"></div>
    </div>
  </div>
</template>

<style scoped>
.card-editor-row,
.param-editor-row {
  --count-column: minmax(2rem, 3.5rem);
  --remove-column: 2.3rem;
  --points-column: minmax(2rem, 3rem);
  display: grid;
  align-items: center;
  column-gap: 0.25rem;
  grid-template-columns: var(--count-column) minmax(0, 1fr) var(--remove-column) var(--points-column);
}

.param-count-cell {
  grid-column: 1;
}

.count-cell,
.param-count-cell {
  min-width: 0;
  text-align: end;
}

.param-count-cell {
  justify-content: flex-end;
}

.param-editor-row .action-cell {
  grid-column: 2;
}

.param-editor-row .remove-cell {
  grid-column: 3;
}

.param-editor-row .points-cell {
  grid-column: 4;
}

.action-cell {
  box-sizing: border-box;
  min-width: 0;
}

.param-editor-row .action-cell {
  padding-left: 2.5rem;
}
  
.card-action-button {
  display: flex;
  align-items: center;
  min-width: 0;
  overflow: hidden;
  padding-left: 0.45rem;
  padding-right: 0.45rem;
  white-space: nowrap;
}

.card-action-button img {
  flex: 0 0 auto;
}

.card-action-label {
  display: inline-block;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: bottom;
  white-space: nowrap;
}

.remove-cell {
  display: flex;
  justify-content: center;
  min-width: 0;
}

.remove-button {
  width: 2rem;
  padding-left: 0;
  padding-right: 0;
}

.points-cell {
  min-width: 0;
}

@media (max-width: 575.98px) {
  .card-editor-row,
  .param-editor-row {
    --count-column: 1.6rem;
    --remove-column: 1.9rem;
    --points-column: 1.6rem;
    column-gap: 0.1rem;
  }

  .count-cell,
  .param-count-cell,
  .points-cell {
    font-size: 0.95rem;
  }

  .card-action-button {
    padding-left: 0.3rem;
    padding-right: 0.3rem;
  }

  .param-editor-row .action-cell {
    padding-left: 1.5rem;
  }

  .card-action-label {
    margin-left: 0.25rem !important;
    padding-left: 0 !important;
  }

  .remove-button {
    width: 1.8rem;
  }
}

.btn-amphibian {
  background-color: #9d8683;
}

.btn-bat {
  background-color: #171513;
}

.btn-bird {
  background-color: #5188b6;
}

.btn-butterfly {
  background-color: #6a1674;
}

.btn-deer {
  background-color: #bf9e32;
}

.btn-insect {
  background-color: #4e756f;
}

.btn-mushroom {
  background-color: #632e26;
}

.btn-pawedAnimal {
  background-color: #672e25;
}

.btn-plant {
  background-color: #637d3d;
}

.btn-tree {
  background-color: #b5c01e;
}

.btn-clovenHoofedAnimal {
  background-color: #6a4332;
}

.btn-shrub {
  background-color: #6e884e;
}
</style>
