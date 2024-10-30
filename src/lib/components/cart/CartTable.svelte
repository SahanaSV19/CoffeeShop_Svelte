<script>
  import UploadFile from "./UploadFile.svelte";

  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  export let cart = [];
  export let updateCart;
  let message = "";
  let component = null;
  let canDelete = false;
  let isChecked = {};
  let quantity = "";
  let partNumber = "";
  let canAddToCart = false;
  let customerReference = "";
  let totalPrice = 0;
  let cleanedString = 0;
  function convertToNumber(num) {
    if (typeof num === "string") {
      cleanedString = num.replace(/[^\d]/g, "");
    } else if (typeof num === "number") {
      cleanedString = num;
    }

    return cleanedString ? parseFloat(cleanedString, 10) : null;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    let formData = {
      quantity: quantity,
      partNumber: partNumber,
    };
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItemIndex = cart.findIndex(
      (item) => item.partNumber === partNumber
    );
    if (existingItemIndex !== -1) {
      // Update the existing item
      const addedQuantity =
        Number(formData.quantity) + Number(cart[existingItemIndex].quantity);

      formData = {
        quantity: addedQuantity,
        partNumber: partNumber,
      };

      const response = await fetch("/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        // console.log('************************');
        // console.log('****************__________)(((((((((((((((((((((');
        // console.log(data.record);
        if (data.record != null) {
          // const previousQuantity = cart[existingItemIndex].quantity;
          cart[existingItemIndex].quantity = formData.quantity;
          cart[existingItemIndex].extprice =
            convertToNumber(cart[existingItemIndex].quantity) *
            convertToNumber(cart[existingItemIndex].unitprice); // Update the extended price
        }
        partNumber = "";
        quantity = "";
        updateLocalStorage(cart);
        updateCart(cart);
        alert("Quantity updated successfully!");
      } else {
        const errorData = await response.json();
        console.error("Failed to add to cart", errorData.error);
        alert(errorData.error);
      }
    } else {
      const response = await fetch("/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        // console.log('************************');
        // console.log('****************__________)(((((((((((((((((((((');

        // console.log(data.record);

        let AddedCartDetails = JSON.parse(localStorage.getItem("cart") || []);
        if (data.record != null) {
          AddedCartDetails.push(data.record);
          updateLocalStorage(AddedCartDetails);

          dispatch("addItem", data.record);

          dispatch("update", { message: data.message, component: data.record });
        }
        partNumber = "";
        quantity = "";
        alert("Product added to cart successfully!");
      } else {
        const errorData = await response.json();
        console.error("Failed to add to cart", errorData.error);
        alert(errorData.error);
      }
    }
  }

  const calculateTotalPrice = (cart) => {
    return cart.reduce(
      (total, item) => convertToNumber(total) + convertToNumber(item.extprice),
      0
    );
  };

  function handleAddItem(event) {
    console.log(event);
    let storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    // message = event.detail.message;
    component = event.detail.component;
    // console.log('I am from Shopping Cart' + component);
    if (component) {
      storedCart.push(component);
      localStorage.setItem("cart", JSON.stringify(storedCart));
    }
  }

  function handleUpdate(event) {
    message = event.detail.message;
    component = event.detail.component;
  }

  const updateLocalStorage = (updatedCart) => {
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    const newTotalPrice = calculateTotalPrice(updatedCart);
    localStorage.setItem("totalPrice", newTotalPrice);
  };

  const deleteSelected = () => {
    cart = cart.filter((item) => !isChecked[item.id]);
    updateLocalStorage(cart);
    updateCart(cart);
    resetCheckboxes();
  };

  const handleCheckboxChange = (id, e) => {
    isChecked[id] = e.target.checked;
    canDelete = updateDeleteButtonState(cart);

    isChecked = { ...isChecked };
  };

  const updateDeleteButtonState = (updatedCart) => {
    return updatedCart.some((item) => isChecked[item.id]);
  };

  const handleQtyChange = (e, id) => {
    const quantity = parseInt(e.target.value) || 0;
    const updatedCart = cart.map((item) => {
      if (item.id === id) {
        item.quantity = convertToNumber(quantity);
        item.extprice =
          convertToNumber(quantity) * convertToNumber(item.unitprice);
      }
      return item;
    });

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    updateLocalStorage(updatedCart);
    updateCart(updatedCart);
    dispatch("update", { message, component });
  };

  const handleInput = () => {
    canAddToCart = quantity && partNumber;
  };

  const resetCheckboxes = () => {
    isChecked = {};
    canDelete = false;
  };

  canDelete = updateDeleteButtonState(cart);
  $: totalPrice = calculateTotalPrice(cart);

  const downloadCSV = () => {
    const csvContent = [
      [
        "Product Name",
        "Part Number",
        "Manufacturer",
        "Quantity",
        "Unit Price",
        "Extended Price",
      ],
      ...cart.map((item) => [
        item.productName,
        item.partNumber,
        item.manufacturer,
        item.quantity,
        item.unitprice,
        item.extprice.toFixed(2),
      ]),
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "cart_details.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  let isOpen = false;

  const toggleDropdown = () => {
    isOpen = !isOpen;
  };

  const closeDropdown = () => {
    isOpen = false;
  };
</script>

<div class="flex justify-between items-end p-2">
  <div class="relative inline-block text-left -mt-20">
    <div>
      <button
        on:click={toggleDropdown}
        class="inline-flex justify-center w-full rounded-lg border bg-primary-500 shadow-sm px-4 py-2 p-2 text-xs text-white hover:bg-primary-900"
      >
        Add Parts from
      </button>
    </div>

    {#if isOpen}
      <div
        class="absolute left-0 z-10 mt-2 w-50 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 border border-black"
      >
        <div
          class="pb-1"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <a
            href="/cart"
            on:click={closeDropdown}
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-500 hover:text-white text-nowrap"
            role="menuitem">Carts & Orders</a
          >
          <a
            href="/quickquote"
            on:click={closeDropdown}
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-500 hover:text-white"
            role="menuitem">Quote</a
          >
          <a
            href="/lists"
            on:click={closeDropdown}
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-500 hover:text-white"
            role="menuitem">Lists</a
          >
        </div>
      </div>
    {/if}
  </div>

  <button
    on:click={downloadCSV}
    class="flex items-center rounded-lg border bg-primary-500 text-white p-2 text-xs hover:bg-primary-900 justify-end"
  >
    Download
  </button>
</div>

<div
  class="overflow-x-auto mx-auto bg-white border border-gray-200 rounded-lg shadow-sm"
>
  <table
    class="w-full text-xs bg-white border border-gray-200 rounded-lg shadow-sm hidden lg:table"
  >
    <thead>
      <tr class="bg-gray-100">
        <th class="p-4">
          <input
            type="checkbox"
            on:change={(e) => {
              const checked = e.target.checked;
              cart.forEach((item) => {
                isChecked[item.id] = checked;
              });
              canDelete = checked;

              isChecked = { ...isChecked };
            }}
            class="outline-none text-black focus:hidden"
          />
        </th>
        <th class="p-4 text-left">Product Details</th>
        <th class="p-4 text-left">Quantity</th>
        <th class="p-4 text-left">Availability</th>
        <th class="p-4 text-left text-nowrap">Unit Price</th>
        <th class="p-4 text-left text-nowrap">Extended Price</th>
      </tr>
    </thead>
    <tbody>
      {#each cart as item (item.id)}
        <tr class="border-b">
          <td class="p-4">
            <input
              type="checkbox"
              data-id={item.id}
              checked={isChecked[item.id] || false}
              on:change={(e) => handleCheckboxChange(item.id, e)}
              class="checkbox outline-none text-black"
            />
          </td>
          <td class="p-8 w-2/3 lg:flex lg:flex-col">
            <div class="flex items-center gap-5">
              <img
                src={item.productImg}
                class="w-16 h-16 border"
                alt={item.productName}
              />
              <div>
                <h3 class="my-1 font-medium">{item.productName}</h3>
                <p class="my-1">{item.partNumber}</p>
                <p class="my-1">{item.manufacturer}</p>
              </div>
            </div>
          </td>
          <td class="p-4 hidden lg:table-cell">
            <input
              type="number"
              class="p-1.5 rounded text-xs w-20"
              on:input={(e) => handleQtyChange(e, item.id)}
              value={item.quantity}
              min="0"
            />
          </td>
          <td class="p-4 hidden lg:table-cell">Immediate</td>
          <td class="p-4 hidden lg:table-cell">₹{item.unitprice}</td>
          <td class="p-4 hidden lg:table-cell">₹{item.extprice?.toFixed(2)}</td>
        </tr>
      {/each}
    </tbody>
  </table>

  <div class="lg:hidden overflow-auto">
    {#each cart as item (item.id)}
      <div class="border-b p-4 flex items-center justify-between space-x-5">
        <div class="flex items-center space-x-5">
          <input
            type="checkbox"
            data-id={item.id}
            checked={isChecked[item.id] || false}
            on:change={(e) => handleCheckboxChange(item.id, e)}
            class="checkbox outline-none text-black"
          />
          <div class="flex flex-col items-center">
            <img
              src={item.productImg}
              class="border"
              alt={item.productName}
              style="width:64px; height: 64px; object-fit: cover;"
            />
            <div class="flex flex-col items-start mt-2">
              <h3 class="font-medium text-xs">{item.productName}</h3>
              <p class="text-xs">{item.partNumber}</p>
              <p class="text-xs">{item.manufacturer}</p>
            </div>
          </div>
        </div>

        <div class="flex flex-col items-start space-y-1">
          <label for={`quantity-${item.id}`} class="text-xs font-semibold"
            >Quantity:</label
          >
          <input
            type="number"
            id={`quantity-${item.id}`}
            class="rounded text-xs w-20"
            on:input={(e) => handleQtyChange(e, item.id)}
            value={item.quantity}
            min="0"
          />
          <p class="text-xs font-semibold py-2">
            Unit Price :<br /><span class="font-normal">
              ₹{item.unitprice}</span
            >
          </p>
          <p class="text-xs font-semibold">
            Extended Price:<br /><span class="font-normal">
              ₹{item.extprice?.toFixed(2)}</span
            >
          </p>
        </div>
      </div>
    {/each}
  </div>
</div>

<div class="flex justify-end p-2">
  <button
    on:click={deleteSelected}
    class="rounded-lg border bg-primary-500 text-white p-2 text-xs hover:bg-primary-900 w-20"
    disabled={!canDelete}
  >
    Delete
  </button>
</div>

<div
  class="w-full text-xs bg-white border border-gray-200 rounded-lg shadow-sm my-3"
>
  <form on:submit|preventDefault={handleSubmit}>
    <div class="flex items-center justify-between p-2 flex-col lg:flex-row">
      <span class="text-black text-sm font-semibold">Manual Entry</span>
      <input
        type="number"
        name="quantity"
        placeholder="Quantity"
        bind:value={quantity}
        on:input={handleInput}
        class="w-full lg:w-1/6 text-xs bg-white border border-gray-200 rounded-lg shadow-sm p-2 my-1 lg:my-0 text-center"
        required
      />
      <input
        type="text"
        name="partNumber"
        placeholder="Part number"
        bind:value={partNumber}
        on:input={handleInput}
        class="w-full lg:w-1/6 text-xs bg-white border border-gray-200 rounded-lg shadow-sm p-2 my-1 lg:my-0 text-center"
        required
      />
      <input
        type="text"
        name="customerReference"
        placeholder="Customer reference"
        bind:value={customerReference}
        class="w-full lg:w-1/6 text-xs bg-white border border-gray-200 rounded-lg shadow-sm p-2 my-1 lg:my-0 text-center"
      />
      <button
        type="submit"
        class="w-1/2 lg:w-auto rounded-lg border bg-primary-500 text-white p-2 text-xs hover:bg-primary-900 my-1 lg:my-0"
        disabled={!canAddToCart}
      >
        Add to cart
      </button>
      <!-- {#if message}
				<p class="text-red-500 text-sm">{message}</p>
			{/if} -->
    </div>
  </form>
  <UploadFile
    {updateCart}
    {updateLocalStorage}
    on:addItem={handleAddItem}
    on:update={handleUpdate}
  />
</div>
