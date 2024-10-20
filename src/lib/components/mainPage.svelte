<script>
  import Login from "./login.svelte";
  import Navbar from "./navbar.svelte";
  let showModal = false;
  let items = [
    {
      id: 1,
      name: "Espresso",
      description: "Strong and bold coffee.",
      img: "https://cdn.pixabay.com/photo/2017/04/11/03/52/coffee-2220484_1280.jpg",
    },
    {
      id: 2,
      name: "Latte",
      description: "Smooth and creamy coffee.",
      img: "https://cdn.pixabay.com/photo/2013/11/16/18/03/coffee-211683_640.jpg",
    },
    {
      id: 3,
      name: "Cappuccino",
      description: "Rich and foamy coffee.",
      img: "https://cdn.pixabay.com/photo/2024/04/18/11/56/ai-generated-8704231_1280.png",
    },
    {
      id: 4,
      name: "Mocha",
      description: "Chocolatey and delicious coffee.",
      img: "https://cdn.pixabay.com/photo/2022/11/20/18/36/peppermint-mocha-7604928_640.jpg",
    },
    // Add more items as needed
  ];

  const addToCart = (item) => {
    const cart = JSON.parse(window.location.localStorage.getItem("cart")) || [];
    cart.push(item);
    window.location.localStorage.setItem("cart", JSON.stringify(cart));
  };

  let currentIndex = 0;

  const next = () => {
    currentIndex = (currentIndex + 1) % items.length;
  };

  const prev = () => {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
  };
</script>

<Navbar />
<Login on:close={() => (showModal = false)} />

<main class="p-4">
  <h1 class="text-2xl font-bold mb-4">Welcome to Our Coffee Shop</h1>

  <!-- Carousel -->
  <!-- <div class="relative mb-4">
    <div
      class="flex transition-transform duration-300"
      style="transform: translateX(-${currentIndex * 100}%);"
    >
      {#each items as item}
        <div class="w-full flex-shrink-0">
          <img
            src={item.img}
            alt={item.name}
            class="w-full h-64 object-cover mb-2"
          />
          <h2 class="text-lg font-semibold">{item.name}</h2>
          <p>{item.description}</p>
          <button
            on:click={() => addToCart(item)}
            class="bg-green-600 text-white p-2 rounded mt-2">Add to Cart</button
          >
        </div>
      {/each}
    </div>
    <button
      on:click={prev}
      class="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow"
      >❮</button
    >
    <button
      on:click={next}
      class="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow"
      >❯</button
    >
  </div> -->

  <div
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 gap-x-8 w-full"
  >
    {#each items as item}
      <div class="border rounded p-4 flex justify-center flex-col items-center">
        <img
          src={item.img}
          alt={item.name}
          class="w-full h-72 object-cover mb-2 rounded-lg"
        />
        <h2 class="text-lg font-semibold">{item.name}</h2>
        <p>{item.description}</p>
        <button
          on:click={() => addToCart(item)}
          class="bg-green-600 text-white p-2 rounded mt-2">Add to Cart</button
        >
      </div>
    {/each}
  </div>
</main>
