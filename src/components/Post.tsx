import { CalendarIcon, ClockIcon } from "@heroicons/react/24/solid";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { LoggerHelper } from "../helpers/logger";
import { FormattedDate } from "./FormattedDate";

const { log } = LoggerHelper.factory("components/post", "Post");

export const MASKS = [
  "mask-hexagon",
  "mask-decagon",
  "mask-square",
  "mask-circle",
  // "mask-pentagon",
  // "mask-parallelogram",
  // "mask-parallelogram-2",
  // "mask-parallelogram-3",
  // "mask-parallelogram-4",
];

export default function Post({
  image,
  title,
  content,
  created_at,
  tags,
  updatedDate,
  isAboutPage = false,
  children,
  timeToRead,
}: any) {
  log({
    image,
    title,
    content,
    created_at,
    updatedDate,
  });

  return (
    <article>
      <div className="flex flex-col justify-center items-center">
        <div
          className={`w-3/4 mask ${
            MASKS[Math.floor(Math.random() * MASKS.length)]
          }`}
        >
          <img
            src={
              image
                ? isAboutPage
                  ? image
                  : `https://mkyplcxzkcdafyrdcqnp.supabase.co/storage/v1/object/public/post-images/${image}`
                : "/blog-placeholder-image.jpeg"
            }
            alt="post-image"
          />
        </div>
        <div className="pt-8 prose">
          <h1 className="font-black text-5xl text-primary break-all sm:break-normal ">
            {title}
          </h1>

          <div className="flex justify-between">
            {created_at && (
              <div className="flex items-center justify-center text-accent">
                {created_at && (
                  <>
                    <CalendarIcon height={32} className="pr-2" />
                    <FormattedDate date={new Date(created_at)} />
                  </>
                )}
              </div>
            )}
            {timeToRead && (
              <div className="flex items-center justify-center text-accent">
                {created_at && (
                  <>
                    {timeToRead} min
                    <ClockIcon height={32} className="pl-2" />
                  </>
                )}
              </div>
            )}
          </div>

          {tags && (
            <p>
              {tags
                ?.split(";")
                .filter((x: string) => !!x)
                .map((tag: string) => (
                  <div className="badge badge-info badge-outline mx-1">
                    {tag.trim()}
                  </div>
                ))}
            </p>
          )}
        </div>

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
