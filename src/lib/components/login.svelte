<script>
  import { createEventDispatcher } from "svelte";
  import { onMount } from "svelte";
  const dispatch = createEventDispatcher();
  let username = "";
  let showModal = true;

  onMount(() => {
    // Check if user is already logged in
    const user = localStorage.getItem("user");
    if (user) {
      showModal = false; // Prevent modal from showing
    }
  });

  const login = () => {
    localStorage.setItem("user", JSON.stringify({ name: username })); // Corrected line
    showModal = false;
    // Optionally, you can emit a close event to the parent if needed
    dispatch("close"); // Uncomment if you want to use events

    window.location.reload();

    // Refresh to update navbar
  };

  const loginLater = () => {
    showModal = false;
  };
</script>

{#if showModal}
  <div
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="bg-white p-4 rounded shadow">
      <h2 class="text-lg font-bold">Login</h2>
      <input
        bind:value={username}
        placeholder="Username"
        class="border p-2 mb-2 w-full"
      />
      <button on:click={login} class="bg-green-600 text-white p-2 rounded"
        >Login</button
      >
      <button on:click={loginLater} class="ml-2">Login Later</button>
    </div>
  </div>
{/if}
