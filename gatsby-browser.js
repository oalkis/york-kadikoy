/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

import React from "react";

import {
  GlobalState,
  GlobalStateForMenu,
} from "./src/components/globalState.js";

export const wrapPageElement = ({ element }) => {
  var pathname = window.location.pathname;
  console.log(pathname);
  if (pathname.includes("/menu"))
    return <GlobalStateForMenu>{element}</GlobalStateForMenu>;
  else return <GlobalState>{element}</GlobalState>;
};
