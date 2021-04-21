<template>
  <div class="card">
    <!-- v-for="(item, index) in animation"
      :key="index" -->
    <card-list :animation-item="animation"></card-list>
  </div>
</template>

<script>
import CardList from "./CardList";

export default {
  name: "Card",
  components: {
    CardList,
  },
  props: {
    animation: {
      type: Array,
      default() {
        return [];
      },
    },
  },
};
</script>

<style scoped>
</style>