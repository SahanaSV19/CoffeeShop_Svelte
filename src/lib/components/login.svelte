<script>
  import { createEventDispatcher } from "svelte";
  import { onMount } from "svelte";
  const dispatch = createEventDispatcher();
  let username = "";
  let showModal = true;
  let email = "";
  let phoneNumber = "";
  onMount(() => {
    // Check if user is already logged in
    const user = localStorage.getItem("user");
    if (user) {
      showModal = false; // Prevent modal from showing
    }
  });

  async function handleSubmit(event) {
    console.log(event);
    event.preventDefault();

    const formdata = new FormData();
    formdata.append(username);
    formdata.append(email);
    formdata.append(phoneNumber);

    console.log(formdata.toString());
  }

  const login = () => {
    localStorage.setItem(
      "user",
      JSON.stringify({ name: username, email: email })
    ); // Corrected line
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
    <form on:submit={handleSubmit()}>
      <div class="bg-white p-4 rounded shadow">
        <h2 class="text-lg font-bold pb-2">Login</h2>
        <input
          required
          bind:value={username}
          placeholder="*Username"
          class="border p-2 mb-2 w-full"
        />
        <input
          required
          type="email"
          bind:value={email}
          placeholder="*email"
          class="border p-2 mb-2 w-full"
        />
        <input
          required
          type="number"
          bind:value={phoneNumber}
          placeholder="*Phone Number"
          class="border p-2 mb-2 w-full"
        />
        <div class="flex justify-between w-full">
          <button
            on:click={login}
            class="bg-green-600 text-white p-2 px-8 rounded">Login</button
          >
          <button
            on:click={loginLater}
            class="ml-2 bg-white text-green-600 hover:bg-green-600 hover:text-white p-2 rounded"
            >Login Later</button
          >
        </div>
      </div>
    </form>
  </div>
{/if}
