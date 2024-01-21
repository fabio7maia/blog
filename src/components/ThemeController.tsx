import React from "react";
import { StorageHelper } from "../helpers/storage";

const THEMES = [
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
  "dim",
  "nord",
  "sunset",
];

export const ThemeController = () => {
  const formRef = React.useRef<HTMLFormElement>();
  const inputThemeRef = React.useRef<HTMLInputElement>();
  const inputRedirectUrlRef = React.useRef<HTMLInputElement>();

  const handleOnClickThemeItem = (theme: string) => (evt: any) => {
    evt.preventDefault();
    evt.stopPropagation();

    StorageHelper.set({ theme });

    if (inputThemeRef.current && inputRedirectUrlRef.current) {
      inputThemeRef.current.value = theme;
      inputRedirectUrlRef.current.value = window.location.href;
      formRef.current?.submit();
    }
  };

  return (
    <form ref={formRef as any} action="/api/cookies" method="POST">
      <div className="dropdown">
        <div tabIndex={0} role="button" className="btn m-1">
          Theme
          <svg
            width="12px"
            height="12px"
            className="h-2 w-2 fill-current opacity-60 inline-block"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 2048 2048"
          >
            <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
          </svg>
        </div>
        <ul
          tabIndex={0}
          className="menu dropdown-content z-[1] p-2 shadow-2xl bg-base-300 rounded-box w-52"
        >
          {THEMES.map((theme) => (
            <li key={theme} onClick={handleOnClickThemeItem(theme)}>
              <a>{theme}</a>
            </li>
          ))}
        </ul>
        <input type="hidden" name="theme" ref={inputThemeRef as any} />
        <input
          type="hidden"
          name="redirectUrl"
          ref={inputRedirectUrlRef as any}
        />
      </div>
    </form>
  );
};
