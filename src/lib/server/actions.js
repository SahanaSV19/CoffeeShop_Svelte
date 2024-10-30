import { DB_URL, DB_USER, DB_PASS } from "$env/static/private";
import PocketBase from "pocketbase";

const pb = new PocketBase(`${DB_URL}`);

let finalNumber = 0;
function convertToNumber(num) {
  // to remove unwanted characters including spaces, newlines, etc....
  if (typeof num === "string") {
    finalNumber = num.replace(/[^\d]/g, "");
  } else if (typeof num === "number") {
    finalNumber = num;
  }

  return finalNumber ? parseFloat(finalNumber, 10) : 0;
}
export const checkStock = async (formData) => {
  let product = formData.product;
  let quantity = formData.quantity;

  let message = "";
  let component = null;
  quantity = convertToNumber(quantity);
  try {
    await pb.admins.authWithPassword(DB_USER, DB_PASS);

    console.log("checking stock for product number", product);

    const componentResult = await pb
      .collection("ProductsMain")
      .getFirstListItem(`product = "${product}"`);

    if (!componentResult) {
      message = "Products not found.";
      return { success: false, error: message };
    } else {
      const stockResult = await pb
        .collection("Stocks")
        .getFirstListItem(`product.product= "${product}"`, {
          expand: "product", // Expand the product field
        });

      const stockQuantity = convertToNumber(stockResult.stockQuantity);
      // console.log("*******************************************");
      console.log(stockQuantity);
      if (stockQuantity < quantity) {
        message = "Insufficient stock.";
        return { success: false, error: message };
      } else {
        message = `Added ${quantity} of ${componentResult.product} to cart.`;
        component = {
          id: componentResult.id,
          productImg: componentResult.images[0] || "",
          productName: componentResult.productName || "Unknown Product",
          product: componentResult.product,
          quantity,
          unitprice: convertToNumber(componentResult.price) || 0,
          extprice: quantity * (convertToNumber(componentResult.price) || 0),
        };
        const record = { message, component };
        // console.log(record);
        return { success: true, record };
      }
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    message = "An error occurred while checking stock. Please try again.";
    return { success: false, error: error.message };
  }
};
