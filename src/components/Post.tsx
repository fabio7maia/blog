import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { LoggerHelper } from "../helpers/logger";
import { PostInfo } from "./PostInfo";

const { log } = LoggerHelper.factory("components/post", "Post");

export default function Post(props: any) {
  const { content, children } = props;

  log({
    ...props,
  });

  return (
    <article>
      <div className="flex flex-col justify-center items-center">
        <PostInfo {...props} />

        <div className="divider" />

        <div className="prose pt-8 w-full">
          {children ? (
            children
          ) : (
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
          )}
        </div>
      </div>
    </article>
  );
}
