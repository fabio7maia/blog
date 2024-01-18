import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { FormattedDate } from "./FormattedDate";

export default function Post({ image, title, content, created_at }: any) {
  const pubDate = new Date(created_at);
  const updatedDate = undefined;

  // console.log("Post", {
  //   image,
  //   title,
  //   content,
  //   created_at,
  //   pubDate,
  //   updatedDate,
  // });

  return (
    <main>
      <article>
        <div className="hero-image">
          {image && (
            <img
              width={1020}
              height={510}
              src={`https://mkyplcxzkcdafyrdcqnp.supabase.co/storage/v1/object/public/post-images/${image}`}
              alt="post-image"
            />
          )}
        </div>
        <div className="prose">
          <div className="title">
            <div className="date">
              <FormattedDate date={pubDate} />
              {updatedDate && (
                <div className="last-updated-on">
                  Last updated on <FormattedDate date={updatedDate} />
                </div>
              )}
            </div>
            <h1>{title}</h1>
            <hr />
          </div>
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
            {content}
          </Markdown>
        </div>
      </article>
    </main>
  );
}
