import React from "react";

export default function RoadmapsGenerate() {
  const [isFetching, setIsFetching] = React.useState(false);
  const [responseMessage, setResponseMessage] = React.useState<{
    status: "none" | "success" | "error";
    data: string;
  }>({
    status: "none",
    data: "",
  });

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsFetching(true);

      const formData = new FormData(e.target as HTMLFormElement);
      const response = await fetch("/api/ai/roadmaps", {
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
          <label htmlFor="model">Model</label>
          <br />
          <select name="model" required>
            <option value="old">Old</option>
            <option value="new">New</option>
          </select>
          <br />
          <label htmlFor="technology">Technology</label>
          <br />
          <input type="text" id="technology" name="technology" required />
        </div>
        <br />
        <button className="btn btn-primary" disabled={isFetching}>
          Submit {isFetching && "..."}
        </button>
      </form>
      <br />
      <br />
      {isFetching && "Loading..."}
      {!isFetching ? (
        responseMessage.status === "success" ? (
          // <Markdown
          //   remarkPlugins={[remarkGfm]}
          //   rehypePlugins={[rehypeRaw]}
          //   components={{
          //     code({ node, inline, className, children, ...props }: any) {
          //       const match = /language-(\w+)/.exec(className || "");

          //       return !inline && match ? (
          //         <SyntaxHighlighter
          //           style={dracula}
          //           PreTag="div"
          //           language={match[1]}
          //           {...props}
          //         >
          //           {String(children).replace(/\n$/, "")}
          //         </SyntaxHighlighter>
          //       ) : (
          //         <code className={className} {...props}>
          //           {children}
          //         </code>
          //       );
          //     },
          //   }}
          // >
          //   {responseMessage.data}
          // </Markdown>
          <code>{JSON.stringify(responseMessage.data)}</code>
        ) : responseMessage.status === "none" ? null : (
          <p>Ocorreram erros ao processar o pedido! Tente novamente.</p>
        )
      ) : null}
    </>
  );
}
