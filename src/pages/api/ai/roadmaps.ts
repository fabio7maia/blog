import type { APIRoute } from "astro";
import { z } from "zod";
import { LoggerHelper } from "../../../helpers/logger";
import { openai } from "../../../lib/openai";
import { supabase } from "../../../lib/supabase";

const roadmapSchema = z.object({
  roadmap: z.array(
    z.object({
      topic: z.string(),
      description: z.string().optional(),
    })
  ),
});

const { log, error } = LoggerHelper.factory(
  "pages/api/ai/roadmaps",
  "POST [/api/ai/roadmaps]"
);

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const fdTechnology = formData.get("technology");
    const fdModel = formData.get("model");

    const technology = fdTechnology;
    const model =
      fdModel === "new" ? "gpt-4-1106-preview" : "gpt-3.5-turbo-1106";

    log("technology", { technology });

    if (!technology) {
      throw new Error("The technology is required!");
    }

    const roadmapRes = await openai.chat.completions.create({
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
          content: `Gera-me um plano dos principais tópicos que são importantes para aprender ou consolidar conhecimentos acerca da tecnologia ${technology}`,
        },
        {
          role: "user",
          content: `O formato de resposta deve seguir o template {roadmap: [{topic:string, com o respetivo tópico;description: string, breve descrição acerca do tópico;}]}, exemplo {roadmap: [{topic: 'Componentes', description: 'Componentes'}, {topic: 'State', description: 'State'}]} em json`,
        },
      ],
      model: model,
      response_format: { type: "json_object" },
    });

    const roadmapString = roadmapRes?.choices?.[0]?.message?.content;
    const roadmapJson = roadmapString ? JSON.parse(roadmapString) : undefined;

    const { success } = roadmapSchema.safeParse(roadmapJson);

    log("roadmap", { ...roadmapJson, success });

    if (success) {
      await supabase.from("roadmaps").insert({
        technology,
        roadmap: JSON.stringify(roadmapJson.roadmap),
        model,
        status: "CREATED",
      });
    }

    return new Response(
      JSON.stringify({ status: "success", data: roadmapJson })
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
