import { CalendarIcon, ClockIcon } from "@heroicons/react/24/solid";
import { FormattedDate } from "./FormattedDate";

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

export const PostInfo = ({
  image,
  created_at,
  timeToRead,
  tags,
  title,
  mode = "post",
}: any) => {
  const isPostPage = mode === "post";
  const isListPostsPage = mode === "list";
  const isAnotherPage = !(isPostPage || isListPostsPage);

  return (
    <div className="flex flex-col justify-center items-center py-4">
      <div
        className={`w-3/4 mask ${
          MASKS[Math.floor(Math.random() * MASKS.length)]
        }`}
      >
        <img
          src={
            image
              ? isAnotherPage
                ? image
                : `https://mkyplcxzkcdafyrdcqnp.supabase.co/storage/v1/object/public/post-images/${image}`
              : "/blog-placeholder-image.jpeg"
          }
          alt="post-image"
        />
      </div>
      <div className="pt-8 prose">
        <h1
          className={`${
            isListPostsPage ? undefined : "font-black text-5xl"
          } text-primary break-all sm:break-normal`}
        >
          {title}
        </h1>

        {!isAnotherPage && (
          <div
            className={`flex ${
              isListPostsPage ? "justify-center" : "justify-between"
            }`}
          >
            {created_at && (
              <div className="flex items-center justify-center text-accent">
                <CalendarIcon height={32} className="pr-2" />
                <FormattedDate date={new Date(created_at)} />
              </div>
            )}
            {isPostPage && timeToRead && (
              <div className="flex items-center justify-center text-accent">
                {timeToRead} min
                <ClockIcon height={32} className="pl-2" />
              </div>
            )}
          </div>
        )}

        {isPostPage && tags && (
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
    </div>
  );
};
