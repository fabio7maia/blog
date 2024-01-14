import type { APIRoute } from "astro";
import { openai } from "../../../lib";

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  //   const auth = getAuth(app);

  //   /* Get token from request headers */
  //   const idToken = request.headers.get("Authorization")?.split("Bearer ")[1];
  //   if (!idToken) {
  //     return new Response("No token found", { status: 401 });
  //   }

  //   /* Verify id token */
  //   try {
  //     await auth.verifyIdToken(idToken);
  //   } catch (error) {
  //     return new Response("Invalid token", { status: 401 });
  //   }

  //   /* Create and set session cookie */
  //   const fiveDays = 60 * 60 * 24 * 5 * 1000;
  //   const sessionCookie = await auth.createSessionCookie(idToken, {
  //     expiresIn: fiveDays,
  //   });

  //   cookies.set("session", sessionCookie, {
  //     path: "/",
  //   });

  //   return redirect("/dashboard");

  //   const completion = await openai.chat.completions.create({
  //     messages: [
  //       {
  //         role: "user",
  //         content: "I need some content of react to create a blog",
  //       },
  //       { role: "user", content: "My objective is start by basic contents" },
  //       {
  //         role: "user",
  //         content: "Write a post of a basic context of react using markdown",
  //       },
  //     ],
  //     model: "gpt-4-1106-preview",
  //     // response_format: { type: "json_object" },
  //   });

  //   console.log(completion.choices[0].message.content);

  //   return new Response(JSON.stringify(completion.choices[0].message.content));
  return new Response(JSON.stringify({}));
};
