import type { APIRoute } from "astro";
import { openai, supabase } from "../../../lib";
import type { ChatCompletion } from "openai/resources/index.mjs";
import type { PostgrestSingleResponse } from "@supabase/supabase-js";

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const term = formData.get("term");

  // console.log("term", term);

  const promises = [
    supabase.from("hints").select("*"),
    openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `I need some hint about ${term} with examples. The text is to be placed on a blog that uses markdown.`,
        },
      ],
      model: "gpt-3.5-turbo-1106",
      // response_format: { type: "json_object" },
    }),
  ];

  try {
    const [hintsSelect, AIRes] = await Promise.all(promises);

    // console.log("promises", { hintsSelect, AIRes });

    const hints = (hintsSelect as PostgrestSingleResponse<any[]>).data?.filter(
      (x) => x.term.indexOf(term) >= 0
    );
    let hint = (AIRes as ChatCompletion).choices[0].message.content;

    // console.log("promises", { hintsSelect, AIRes, hints, hint });

    await supabase.from("hints").insert({
      id:
        ((hintsSelect as PostgrestSingleResponse<any[]>).data?.length || 0) + 1,
      content: hint,
      term,
    });

    // console.log("promises", { hintsSelect, AIRes, hints });

    // console.log("Response", {
    //   res,
    // });

    const hintsSize = hints?.length || 0;

    if (hints && hintsSize > 0) {
      const randomHintIndex = Math.floor(Math.random() * hintsSize);

      hints?.push({ content: hint });

      hint = hints[randomHintIndex].content;
    }

    return new Response(JSON.stringify({ status: "success", data: hint }));
  } catch (err) {
    return new Response(
      JSON.stringify({
        status: "error",
        data: err,
      })
    );
  }
};
