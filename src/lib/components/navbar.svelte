<script>
  import { onMount } from "svelte";
  import LoginModal from "./login.svelte"; // Ensure to import the modal component

  let user = null;
  let showModal = false; // Declare the showModal variable

  onMount(() => {
    user = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null;
  });

  const logout = () => {
    localStorage.removeItem("user");
    user = null;
  };
</script>

<nav class="flex justify-between p-4 bg-green-600 text-white">
  <div class="text-xl">Coffee Shop</div>
  <div class="flex items-center">
    <a href="/cart" class="mr-4">🛒</a>
    {#if user}
      <div
        class="rounded-full bg-white text-green-600 w-8 h-8 flex items-center justify-center"
      >
        {user.name[0]}
      </div>
      <button on:click={logout} class="ml-4">Logout</button>
    {:else}
      <button on:click={() => (showModal = true)}>Login</button>
    {/if}
  </div>
</nav>

{#if showModal}
  <LoginModal on:close={() => (showModal = false)} />
{/if}
