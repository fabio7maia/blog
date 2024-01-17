import type { APIRoute } from "astro";
import { z } from "zod";
import { openai } from "../../../lib/openai";
import { supabase } from "../../../lib/supabase";

const roadmapSchema = z.object({
  roadmap: z.array(
    z.object({
      term: z.string(),
      description: z.string().optional(),
    })
  ),
});

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const technology = formData.get("technology");

  // console.log("technology", { technology });

  try {
    const roadmapRes = await openai.chat.completions.create({
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
          content: `Gera-me um plano dos principais pontos acerca da tecnologia ${technology}, de forma a que possa criar posts para cada um dos termos`,
        },
        {
          role: "user",
          content: `O formato de resposta deve seguir o formato {roadmap:[{term:string, com o respetivo termo;description: string, breve descrição acerca do termo;}]}, exemplo {roadmap:[{term:'Componentes',description: 'Componentes'},{term:'State',description:'State'}]} em json`,
        },
      ],
      model: "gpt-3.5-turbo-1106",
      response_format: { type: "json_object" },
    });

    const roadmapString = roadmapRes?.choices?.[0]?.message?.content;
    const roadmapJson = roadmapString ? JSON.parse(roadmapString) : undefined;

    const { success } = roadmapSchema.safeParse(roadmapJson);

    // console.log("roadmap", { ...roadmapJson, success });

    if (success) {
      await supabase.from("roadmaps").insert({
        technology,
        roadmap: roadmapString,
      });
    }

    return new Response(
      JSON.stringify({ status: "success", data: roadmapJson })
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        status: "error",
        data: err,
      })
    );
  }
};
