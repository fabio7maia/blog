import React from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";
import rehypeRaw from "rehype-raw";

export default function DailyHint() {
  const [isFetching, setIsFetching] = React.useState(false);
  const [responseMessage, setResponseMessage] = React.useState<{
    status: "success" | "error";
    data: string;
  }>({
    status: "success",
    data: "",
  });

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsFetching(true);

      const formData = new FormData(e.target as HTMLFormElement);
      const response = await fetch("/api/ai/daily-hint", {
        method: "POST",
        body: formData,
      });
      const { data, status } = await response.json();

      setResponseMessage({ status, data });
    } catch (err: any) {
      setResponseMessage({ status: "error", data: err });
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <>
      <form onSubmit={handleOnSubmit}>
        <div>
          <label htmlFor="term">Term</label>
          <input type="text" id="term" name="term" required />
        </div>
        <button disabled={isFetching}>Submit {isFetching && "..."}</button>
      </form>
      <br />
      <br />
      {isFetching && "Loading..."}
      {!isFetching ? (
        responseMessage.status === "success" ? (
          <Markdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              code({ node, inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || "");

                return !inline && match ? (
                  <SyntaxHighlighter
                    style={dracula}
                    PreTag="div"
                    language={match[1]}
                    {...props}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {responseMessage.data}
          </Markdown>
        ) : (
          <p>Ocorreram erros ao processar o pedido! Tente novamente.</p>
        )
      ) : null}
    </>
  );
}
