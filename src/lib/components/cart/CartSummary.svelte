<script>
  import { browser } from "$app/environment";
  import Icon from "@iconify/svelte";

  let cart = [];

  if (browser) {
    cart = JSON.parse(localStorage.getItem("cart")) || [];
  }

  export let totalPrice = 0;

  // Calculate totalPrice based on cart items
  $: totalPrice = cart.reduce(
    (sum, item) => sum + parseFloat(item.extprice || 0),
    0
  );
</script>

<div class="my-10 md:my-0">
  <div class="px-8 py-4 rounded bg-white border shadow">
    <h2
      class="text-md sm:text-md md:text-lg lg:text-lg my-2 text-heading font-bold"
    >
      Cart Summary
    </h2>
    <div
      class="flex items-center justify-between text-md sm:text-md md:text-lg lg:text-lg my-2"
    >
      <p class="text-description text-base">Subtotal</p>
      <p class="font-medium text-description text-base">
        ₹{totalPrice.toFixed(2)}
      </p>
    </div>

    <div
      class={"flex items-center justify-between text-md sm:text-md md:text-lg lg:text-lg my-2"}
    >
      <p class="text-description text-base">Shipping</p>
      <p class="text-description font-medium text-base">FREE</p>
    </div>
    <hr class="my-2" />

    <div
      class="flex justify-between text-md sm:text-md md:text-lg lg:text-lg font-bold my-2"
    >
      <p class="text-description text-base">Total</p>
      <div class="flex flex-col items-end">
        <p class="text-description text-base">₹{totalPrice.toFixed(2)}</p>
        <p
          class="text-xs sm:text-md md:text-md lg:text-md font-normal text-right"
        >
          Estimates
        </p>
      </div>
    </div>

    <button
      class="bg-primary-600 hover:bg-primary-800 text-white w-full text-sm sm:text-base md:text-base lg:text-base py-2 rounded-3xl"
      >Proceed to Checkout</button
    >
  </div>
</div>
