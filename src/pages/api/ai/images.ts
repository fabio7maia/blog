import type { APIRoute } from "astro";
import { decode } from "base64-arraybuffer";
import { LoggerHelper } from "../../../helpers/logger";
import { TextHelper } from "../../../helpers/text";
import { openai } from "../../../lib/openai";
import { supabase } from "../../../lib/supabase";

const MAX_IMAGES = 5;

const { log, error } = LoggerHelper.factory(
  "pages/api/ai/images",
  "POST [/api/ai/images]"
);

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    let fdModel = formData.get("model");

    const model = fdModel === "new" ? "dall-e-3" : "dall-e-2";

    const { data, error }: any = await supabase
      .from("posts")
      .select()
      .eq("status", "CREATED")
      .limit(MAX_IMAGES);

    if (error) {
      return new Response(
        JSON.stringify({
          status: "error",
          data: error,
        })
      );
    }

    const posts = data || [];
    const size = posts.length;

    log(" > images", {
      size,
      data,
    });

    const promises: Array<Promise<void>> = [];

    for (let i = 0; i < size; i++) {
      promises.push(
        new Promise(async (resolve, reject) => {
          log("images loop", {
            size,
            data,
            i,
          });

          const post = posts[i];

          const id = post.id;
          const title = post.title;
          const technology = post.technology;
          const roadmapId = post.roadmapId;

          const imageRes = await openai.images.generate({
            prompt: `Considera que és um especialista em novas tecnologias, adoras escrever e passar conhecimentos aos outros. Gera uma imagem para utilizar num blog sobre tecnologias inovadoras que permita expressar de forma inovadora e atraente o tópico ${title} da tecnologia ${technology}`,
            model: model,
            n: 1,
            response_format: "b64_json",
          });

          log("images generate", {
            size,
            data,
            i,
            id,
            title,
            technology,
            roadmapId,
            imageRes,
          });

          const image = imageRes ? imageRes?.data?.[0].b64_json : undefined;
          const imageName = TextHelper.transformToUrl(
            `public/${technology}/post-image-${roadmapId}-${title}`
          );

          const imageUploadRes = image
            ? await supabase.storage
                .from("post-images")
                .upload(imageName, decode(image), {
                  contentType: "image/png",
                  upsert: true,
                })
            : undefined;

          log("images store", {
            size,
            data,
            i,
            id,
            title,
            technology,
            roadmapId,
            imageRes,
            imageUploadRes,
          });

          if (imageUploadRes) {
            await supabase
              .from("posts")
              .update({
                image: imageUploadRes?.data?.path,
                status: "IMAGE_CREATED",
              })
              .eq("id", id);
          }

          resolve();
        })
      );
    }

    log("POST [/api/ai/posts-roadmap] > post", {
      promises,
      size,
    });

    await Promise.all(promises);

    return new Response(
      JSON.stringify({ status: "success", data: { count: size } })
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
