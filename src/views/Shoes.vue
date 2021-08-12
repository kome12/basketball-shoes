<template>
  <div>
    <h2>Basketball Shoes</h2>
    <div v-if="hasError">
      <span>Error loading data!</span>
    </div>
    <div v-else class="shoes-wrapper">
      <div class="shoe" v-for="shoe in shoes" :key="shoe.id">
        <router-link :to="{ name: 'Shoe', params: { id: shoe.id } }">
          <div>
            <h3>{{ shoe.name }}</h3>
            <p>¥{{ formatPrice(shoe.price) }}</p>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
const axios = require("axios");

export default {
  name: "Shoes",
  data: () => ({
    shoes: [],
    hasError: false,
  }),
  methods: {
    async getShoes() {
      try {
        const res = await axios.get("http://localhost:3000/api/shoes");
        this.shoes = res.data;
      } catch (err) {
        console.error("Error getting shoes!", err);
        this.hasError = true;
      }
    },
    formatPrice(price) {
      return price.toLocaleString("ja-JP");
    },
  },
  created() {
    this.getShoes();
  },
};
</script>

<style lang="scss">
.shoes-wrapper {
  display: flex;
  flex-wrap: wrap;

  .shoe {
    flex: 45%;
    border: 1px solid black;
    margin: 8px;
    padding: 8px;
  }
}
</style>
