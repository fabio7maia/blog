import React from "react";
import { LoggerHelper } from "../helpers/logger";

const { log, error } = LoggerHelper.factory("components/suggestionsForm");

export const SuggestionsForm = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const success = urlParams.get("success");
  const hasFeedback = success !== undefined && success !== null;
  const isSuccessFeedback = success === "true";
  const isErrorFeedback = success === "false";
  const starsValue = Number(urlParams.get("stars")) || 3;
  const suggestionValue = urlParams.get("suggestion") || "";
  const formRef = React.useRef<HTMLFormElement>();

  log({
    success,
    hasFeedback,
    isErrorFeedback,
    isSuccessFeedback,
    starsValue,
    suggestionValue,
  });

  React.useEffect(() => {
    hasFeedback && formRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <form
      action="/api/suggestions"
      method="post"
      className="flex flex-col text-start"
      ref={formRef as any}
    >
      {isSuccessFeedback && (
        <div role="alert" className="alert alert-success mb-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Sugestão guardada com sucesso 😊</span>
        </div>
      )}
      {isErrorFeedback && (
        <div role="alert" className="alert alert-error mb-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>
            Ocorreram erros ao tentar guardar a sugestão, pedimos que tente
            novamente. Obrigado 😊
          </span>
        </div>
      )}
      <div className="mb-4">
        <label className="font-bold mb-4">Avaliação</label>
      </div>
      <div className="rating gap-1 mb-8">
        <input
          type="radio"
          name="stars"
          value="1"
          className="mask mask-heart bg-red-400"
          defaultChecked={starsValue === 1}
        />
        <input
          type="radio"
          name="stars"
          value="2"
          className="mask mask-heart bg-orange-400"
          defaultChecked={starsValue === 2}
        />
        <input
          type="radio"
          name="stars"
          value="3"
          className="mask mask-heart bg-yellow-400"
          defaultChecked={starsValue === 3}
        />
        <input
          type="radio"
          name="stars"
          value="4"
          className="mask mask-heart bg-lime-400"
          defaultChecked={starsValue === 4}
        />
        <input
          type="radio"
          name="stars"
          value="5"
          className="mask mask-heart bg-green-400"
          defaultChecked={starsValue === 5}
        />
      </div>

      <div className="mb-4">
        <label className="font-bold mb-4">Sugestões</label>
      </div>
      <textarea
        name="suggestion"
        placeholder="O que lhe vai na alma ..."
        className="textarea textarea-bordered textarea-lg w-full"
        required
        defaultValue={suggestionValue}
      ></textarea>
      <button className="btn btn-primary mt-8">Enviar</button>
    </form>
  );
};
