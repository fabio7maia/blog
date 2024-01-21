import type { APIRoute } from "astro";
import { STORAGE_KEY } from "../../helpers/storage";

export const POST: APIRoute = async ({ request, url }) => {
  const formData = await request.formData();
  const theme = formData.get("theme");
  const redirectUrl = formData.get("redirectUrl");

  const headers = new Headers();
  headers.append(
    "Set-Cookie",
    `${STORAGE_KEY}=${JSON.stringify({
      theme,
    })}; HttpOnly;Domain=${url.hostname};Path=/;Max-Age=2592000;`
  );

  headers.append("Location", redirectUrl?.toString() || `${url.origin}/`);

  return new Response("", {
    headers,
    status: 302,
  });
};
