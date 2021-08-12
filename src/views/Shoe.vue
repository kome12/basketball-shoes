<template>
  <div>
    <section v-if="showPurchaseResult">
      <h1>Purchase Result</h1>
      <div v-if="loading">
        <img src="../assets/loading.gif" />
      </div>
      <div v-else>
        <section
          v-if="
            purchaseResult.paymentSuccessful && purchaseResult.emailSuccessful
          "
        >
          <h2>Successfully bought the product</h2>
        </section>
        <section v-else-if="purchaseResult.paymentSuccessful">
          <h2>Purchase was successful but email was not sent</h2>
        </section>
        <section v-else>
          <h2>Purchase was not successful!</h2>
        </section>
      </div>
    </section>
    <section v-else>
      <section v-if="!notFound && shoe">
        <h1>{{ shoe.name }}</h1>
        <span>Price: ¥{{ formatPrice(shoe.price) }}</span>

        <form @submit="checkForm" novalidate="true" class="order-form">
          <div class="form-separator">
            <label for="email">Enter email address to purchase</label>
            <input type="email" v-model="email" name="email" />
          </div>
          <div v-if="errors.length">
            <b>Please correct the following error(s):</b>
            <ul class="errors">
              <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
            </ul>
          </div>
          <button type="submit" :disabled="email === ''" class="cta-button">
            Purchase
          </button>
        </form>
      </section>
      <section v-else-if="notFound">
        <h1>Could not find shoe!</h1>
      </section>
    </section>
  </div>
</template>

<script>
const axios = require("axios");

export default {
  name: "Shoe",
  data: () => ({
    shoe: null,
    notFound: false,
    email: "",
    errors: [],
    showPurchaseResult: false,
    purchaseResult: {
      paymentSuccessful: false,
      emailSuccessful: false,
      message: "",
    },
    loading: false,
  }),
  methods: {
    async getShoe() {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/shoes/${this.$route.params.id}`
        );
        if (res.data) {
          this.shoe = res.data;
        } else {
          this.notFound = true;
        }
      } catch (err) {
        console.error(
          `Error getting shoe with id ${this.$route.params.id}!`,
          err
        );
      }
    },
    async purchaseShoe() {
      const data = {
        shoeId: this.shoe.id,
        price: this.shoe.price,
        email: this.email,
        productName: this.shoe.name,
      };
      this.showPurchaseResult = true;
      this.loading = true;
      this.email = "";
      const res = await axios.post(`http://localhost:3000/api/purchases`, data);
      this.purchaseResult = {
        paymentSuccessful: res.data.PaymentSuccessful,
        emailSuccessful: res.data.EmailSuccessful,
        message: res.data.Message,
      };
      this.loading = false;
    },
    checkForm: function (e) {
      this.errors = [];

      if (!this.email) {
        this.errors.push("Email required.");
      } else if (!this.validEmail(this.email)) {
        this.errors.push("Valid email required.");
      }

      if (!this.errors.length) {
        this.purchaseShoe();
      }

      e.preventDefault();
    },
    validEmail: function (email) {
      var re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },
    formatPrice(price) {
      return price.toLocaleString("ja-JP");
    },
  },
  created() {
    this.getShoe();
  },
};
</script>

<style lang="scss">
.order-form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-separator {
  display: flex;
  flex-direction: column;
  padding: 8px;
}

.errors {
  color: red;
}

.cta-button {
  margin: 0px 8px;
  padding: 8px 16px;
}
</style>
