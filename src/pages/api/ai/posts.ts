import type { APIRoute } from "astro";
import { z } from "zod";
import { LoggerHelper } from "../../../helpers/logger";
import { openai } from "../../../lib/openai";
import { supabase } from "../../../lib/supabase";

const postSchema = z.object({
  post: z.object({
    content: z.string(),
    tags: z.string().optional(),
    timeToRead: z.number().optional(),
  }),
});

const { log, error } = LoggerHelper.factory(
  "pages/api/ai/posts",
  "POST [/api/ai/posts]"
);

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const fdModel = formData.get("model");

    const model =
      fdModel === "new" ? "gpt-4-1106-preview" : "gpt-3.5-turbo-1106";

    const { data, error }: any = await supabase
      .from("roadmaps")
      .select()
      .eq("status", "CREATED");

    if (error) {
      return new Response(
        JSON.stringify({
          status: "error",
          data: error,
        })
      );
    }

    const roadmaps = data || [];
    const size = roadmaps.length || 0;
    let totalPosts = 0;

    log("roadmaps", {
      size,
      error,
      roadmaps,
    });

    const promises: Array<Promise<void>> = [];

    for (let i = 0; i < size; i++) {
      const roadmap = roadmaps?.[i];

      const roadmapId = roadmap?.id;
      const roadmapContent = roadmap?.roadmap
        ? JSON.parse(roadmap?.roadmap)
        : undefined;
      const technology = roadmap?.technology;

      const topicsSize = roadmapContent.length;

      log("roadmaps > loop", {
        size,
        roadmap,
        topicsSize,
      });

      for (let j = 0; j < topicsSize; j++) {
        totalPosts++;

        promises.push(
          new Promise(async (resolve, reject) => {
            const roadmapTopic = roadmapContent[j];

            const topic = roadmapTopic.topic;
            const description = roadmapTopic.description;

            log("roadmaps topics", {
              technology,
              size,
              i,
              topic,
              description,
              roadmapContent,
            });

            const postRes = await openai.chat.completions.create({
              messages: [
                {
                  role: "user",
                  content:
                    "Considera que és um especialista em novas tecnologias, adoras escrever e passar conhecimentos aos outros",
                },
                {
                  role: "user",
                  content: `O objetivo do conteúdo que vais produzir é servir de base para a construção de um blog sobre tecnologias inovadoras, onde os cibernautas possam sem grandes conhecimentos tecnológicos aprender do zero uma nova tecnologia`,
                },
                {
                  role: "user",
                  content: `Gera-me um post sobre o tópico ${topic} - ${description} para a tecnologia ${technology}. O tempo de leitura deve ser entre 5 e 30 min de leitura e deve ter exemplos práticos de forma a ser mais fácil de assimilar os conhecimentos`,
                },
                {
                  role: "user",
                  content: `O conteúdo deve ser de leitura simples, cómico e um pouco sarcástico, com o objetivo de ser educativo, mas também acolhedor para agarrar o utilizador e o fazer voltar`,
                },
                {
                  role: "user",
                  content: `O formato de resposta deve seguir o template {post: {content: string, com o markdown do conteúdo do post; tags: string, com as várias tags separadas por o carácter ";"; timeToRead: number, com o tempo de leitura do post em minutos; }}, exemplo {post: {content: '# Componentes', tags: 'componentes; props;', timeToRead: 10}} em json`,
                },
              ],
              model: model,
              response_format: { type: "json_object" },
            });

            const postString = postRes?.choices?.[0]?.message?.content;
            const postJson = postString ? JSON.parse(postString) : undefined;

            log("post", {
              postString,
            });

            const { success } = postSchema.safeParse(postJson);

            if (success) {
              const { content, tags, timeToRead } = postJson.post;

              await supabase.from("posts").insert({
                roadmapId: roadmapId,
                title: `${technology} - ${topic}`,
                content,
                tags,
                timeToRead,
                technology,
                author: "AI",
                model,
                status: "CREATED",
              });

              if (j === topicsSize - 1) {
                const { error, count } = await supabase
                  .from("roadmaps")
                  .update({
                    status: "POSTS_CREATED",
                  })
                  .match({ id: roadmapId });

                log("post > update roadmap", {
                  roadmapId,
                  count,
                });

                if (error) {
                  throw new Error(error?.message);
                }
              }
            }

            resolve();
          })
        );
      }
    }

    log("post", {
      promises,
      size,
    });

    await Promise.all(promises);

    return new Response(
      JSON.stringify({ status: "success", data: { count: totalPosts } })
    );
  } catch (err) {
    error(err);

    return new Response(
      JSON.stringify({
        status: "error",
        data: err,
      })
    );
  }
};
