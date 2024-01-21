import type { APIRoute } from "astro";
import { LoggerHelper } from "../../helpers/logger";
import { supabase } from "../../lib/supabase";

const { log, error } = LoggerHelper.factory(
  "pages/api/suggestions",
  "POST [/api/suggestions]"
);

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const stars = Number(formData.get("stars"));
  const suggestion = formData.get("suggestion");

  try {
    log({
      stars,
      suggestion,
    });

    await supabase.from("suggestions").insert({
      stars,
      suggestion,
    });

    const headers = new Headers();

    headers.append("Location", "/suggestions?success=true");

    return new Response("", {
      headers,
      status: 302,
    });
  } catch (err) {
    error(err);

    const headers = new Headers();

    headers.append(
      "Location",
      `/suggestions?success=false&stars=${stars}&suggestion=${suggestion}`
    );

    return new Response("", {
      headers,
      status: 302,
    });
  }
};
