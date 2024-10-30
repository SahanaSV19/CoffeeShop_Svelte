<script>
  import { browser } from "$app/environment";
  import { onMount } from "svelte";
  import CartSummary from "./CartSummary.svelte";
  import CartTable from "./CartTable.svelte";
  import Icon from "@iconify/svelte";
  let cart = [];
  let message = "";
  let component = null;
  // console.log('*******************');
  // console.log(message);
  // console.log(component);
  // console.log('**********************');

  let empty = false;
  let totalPrice = 0;

  // Dummy data
  const dummyData = [
    {
      id: 1,
      productImg:
        "https://cdn.pixabay.com/photo/2023/11/21/13/53/beetle-8403460_1280.jpg",
      productName: "Bug",
      partNumber: 12345,
      manufacturer: "Beetle",
      quantity: 2,
      unitprice: 12,
      extprice: 250000 * 12,
    },
    {
      id: 2,
      productImg:
        "https://cdn.pixabay.com/photo/2023/11/21/13/54/ant-8403462_1280.jpg",
      productName: "Ant",
      partNumber: 12346,
      manufacturer: "Ant Co.",
      quantity: 1,
      unitprice: 8,
      extprice: 150000 * 8,
    },
    {
      id: 3,
      productImg:
        "https://cdn.pixabay.com/photo/2019/09/16/18/43/viridissima-4481734_1280.jpg",
      productName: "Grasshopper",
      partNumber: 12347,
      manufacturer: "Grasshopper Inc.",
      quantity: 5,
      unitprice: 15,
      extprice: 50000 * 15,
    },
    {
      id: 4,
      productImg:
        "https://cdn.pixabay.com/photo/2018/01/04/19/43/rose-3061486_1280.jpg",
      productName: "Rose",
      partNumber: 12349,
      manufacturer: "Flora Inc.",
      quantity: 1,
      unitprice: 15,
      extprice: 150000 * 15,
    },
    {
      id: 5,
      productImg:
        "https://cdn.pixabay.com/photo/2023/11/20/13/48/butterfly-8401173_1280.jpg",
      productName: "Lily",
      partNumber: 12350,
      manufacturer: "Lily Co.",
      quantity: 1,
      unitprice: 20,
      extprice: 100000 * 20,
    },
  ];
  let cleanedString = 0;
  function convertToNumber(num) {
    // to remove unwanted characters including spaces, newlines, etc....
    if (typeof num === "string") {
      cleanedString = num.replace(/[^\d]/g, "");
    } else if (typeof num === "number") {
      cleanedString = num;
    }

    return cleanedString ? parseFloat(cleanedString, 10) : 0;
  }
  onMount(() => {
    if (browser) {
      let storedCart = JSON.parse(localStorage.getItem("cart")) || [];

      // Debugging: Log the current cart
      console.log("Stored Cart:", storedCart);

      if (storedCart.length === 0) {
        storedCart = dummyData;
        localStorage.setItem("cart", JSON.stringify(storedCart));
      }

      updateCart(storedCart);
    }
  });

  const updateCart = (storedCart) => {
    cart = storedCart;
    console.log(cart.total);
    console.log(cart.quantity);

    totalPrice = cart.reduce(
      (total, item) =>
        convertToNumber(total) +
        convertToNumber(item.quantity) * convertToNumber(item.unitprice),
      0
    );
    empty = cart.length === 0;
  };

  function handleAddItem(event) {
    console.log(event);
    let storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    // message = event.detail.message;
    component = event.detail.component;
    console.log("I am from Shopping Cart" + component);
    if (component) {
      storedCart.push(component);
      localStorage.setItem("cart", JSON.stringify(storedCart));
    }
  }

  function handleUpdate(event) {
    message = event.detail.message;
    component = event.detail.component;
  }
</script>

<div class="mx-auto w-full lg:max-w-7xl md:flex gap-6 my-5">
  {#if empty}
    <div class="w-full flex flex-col gap-4 items-center bg-white">
      <Icon icon="bi:cart-x-fill" class="text-6xl" />
      <h1 class="font-bold text-xl">Cart is empty</h1>
    </div>
  {:else}
    <div class="md:w-8/12 lg:w-9/12 mx-2 md:mx-0">
      <CartTable
        {cart}
        {updateCart}
        on:addItem={handleAddItem}
        on:update={handleUpdate}
        {message}
        {component}
      />
    </div>
    <div class="md:w-4/12 lg:w-3/12 mx-2 md:mx-0 lg:pt-12">
      <CartSummary {totalPrice} />
    </div>
  {/if}
</div>
