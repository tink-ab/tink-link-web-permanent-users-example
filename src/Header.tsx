import React from "react";
import { Logo } from "./images/Logo";

export const Header = () => {
  return (
    <div className="display-flex justify-between p-32 mb-40">
      <a href="/">
        <Logo />
      </a>

      <a
        className="link"
        href="https://docs.tink.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Visit the docs
      </a>
    </div>
  );
};
