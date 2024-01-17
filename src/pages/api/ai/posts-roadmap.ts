import type { APIRoute } from "astro";
import type {
  ChatCompletion,
  ImagesResponse,
} from "openai/resources/index.mjs";
import { openai } from "../../../lib/openai";
import { supabase } from "../../../lib/supabase";

const MAX_IMAGES = 5;

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const technology = formData.get("technology");

  // console.log("POST [/api/ai/posts-roadmap] > start", { technology });

  try {
    const { data, error }: any = await supabase
      .from("roadmaps")
      .select()
      .limit(1)
      .filter("technology", "ilike", technology);

    if (error) {
      return new Response(
        JSON.stringify({
          status: "error",
          data: error,
        })
      );
    }

    const roadmap = data?.[0]?.roadmap
      ? JSON.parse(data?.[0]?.roadmap)
      : undefined;
    const size = roadmap?.roadmap.length || 0;

    // console.log("POST [/api/ai/posts-roadmap] > roadmaps", {
    //   technology,
    //   size,
    //   data,
    //   error,
    //   roadmap,
    // });

    const promises: Array<Promise<void>> = [];

    for (let i = 0; i < size; i++) {
      promises.push(
        new Promise(async (resolve, reject) => {
          // console.log("POST [/api/ai/posts-roadmap] > roadmaps points", {
          //   technology,
          //   size,
          //   i,
          // });

          const roadmapContent = roadmap.roadmap[i];

          const term = roadmapContent.term;
          const description = roadmapContent.description;

          // console.log("POST [/api/ai/posts-roadmap] > roadmaps points", {
          //   technology,
          //   size,
          //   i,
          //   term,
          //   description,
          //   roadmapContent,
          // });

          const promises: any = [
            openai.chat.completions.create({
              messages: [
                {
                  role: "user",
                  content: `Estou a construir um blog sobre tecnologias inovadoras`,
                },
                {
                  role: "user",
                  content: `O seu objetivo é que cibernautas possam sem grandes conhecimentos aprender do zero uma nova tecnologia`,
                },
                {
                  role: "user",
                  content: `Gera-me um post acerca do tópico ${term} - ${description} para a tecnologia ${technology}`,
                },
                {
                  role: "user",
                  content: `O conteúdo do post deve ser em markdown`,
                },
              ],
              model: "gpt-3.5-turbo-1106",
            }),
          ];

          if (i < MAX_IMAGES) {
            promises.push(
              openai.images.generate({
                prompt: `Imagem para colocar num blog que permita expressar o tópico ${term} - ${description} da tecnologia ${technology}`,
                model: "dall-e-2",
                n: 1,
              })
            );
          }

          const [postRes, imageRes] = (await Promise.all(promises)) as [
            ChatCompletion,
            ImagesResponse
          ];

          const post = postRes?.choices?.[0]?.message?.content;
          const image = imageRes ? imageRes?.data?.[0].url : undefined;

          console.log("POST [/api/ai/posts-roadmap] > post", {
            technology,
            size,
            i,
            term,
            description,
            post,
            image,
          });

          await supabase.from("posts").insert({
            roadmapId: roadmap.id,
            title: `${technology} - ${term}`,
            content: post,
            technology,
            author: "AI",
            status: "CREATED",
            image: image,
          });

          resolve();
        })
      );
    }

    // console.log("POST [/api/ai/posts-roadmap] > post", {
    //   promises,
    //   size,
    // });

    await Promise.all(promises);

    return new Response(
      JSON.stringify({ status: "success", data: { count: size } })
    );
  } catch (err) {
    console.error(err);

    return new Response(
      JSON.stringify({
        status: "error",
        data: err,
      })
    );
  }
};
