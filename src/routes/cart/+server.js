import { checkStock } from "$lib/server/actions";

export async function POST({ request }) {
  const formData = await request.json();
  console.log("Received product data:", formData);

  const response = await checkStock(formData);
  console.log(
    "*************(((((((((*******************)))))))))))))))))))))))))**************"
  );

  console.log(response);
  console.log(response.success);

  if (response.success) {
    return new Response(
      JSON.stringify({
        message: response.record.message,
        record: response.record.component,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } else {
    return new Response(JSON.stringify({ error: response.error }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
