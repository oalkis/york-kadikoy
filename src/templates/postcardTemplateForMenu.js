import React from "react";
import { Helmet } from "react-helmet";
import { Link, navigate } from "gatsby";
import theme from "../theme.yaml";
import {
  FaTimesCircle,
  FaArrowLeft,
  FaArrowRight,
  FaExpand,
  FaCompress,
  // FaDownload,
} from "react-icons/fa";
import { GlobalStateContext } from "../components/globalState.js";
import { CornerCaseHandler } from "../components/cornerCaseHandler.js";
import { enterFullScreen, exitFullScreen } from "../util/fullScreenHelpers.js";

class PostcardTemplateForMenu extends React.Component {
  constructor(props) {
    super(props);

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.fullScreenChangeHandler = this.fullScreenChangeHandler.bind(this);
    this.enterFullScreenAndRender = this.enterFullScreenAndRender.bind(this);
    this.exitFullScreenAndRender = this.exitFullScreenAndRender.bind(this);
    this.currentImageLoaded = this.currentImageLoaded.bind(this);
    this.nextImageLoaded = this.nextImageLoaded.bind(this);
    this.prevImageLoaded = this.prevImageLoaded.bind(this);
    this.getStatePassForNext = this.getStatePassForNext.bind(this);
    this.getStatePassForPrev = this.getStatePassForPrev.bind(this);

    /* Magic numbers. */
    this.placeholderTransitionDuration = 1000;
    this.zIndexes = this.zIndexes();

    this.state = {
      pageContext: this.getFromPassedStateOrDefault(
        "pageContext",
        this.props.pageContext
      ) /* Explained in README. */,
      currentImageLoaded: this.getFromPassedStateOrDefault(
        "currentImageLoaded",
        false
      ),
      isFullScreen: this.getFromPassedStateOrDefault("isFullScreen", false),
      nextImageLoaded: this.getFromPassedStateOrDefault(
        "nextImageLoaded",
        false
      ),
      prevImageLoaded: this.getFromPassedStateOrDefault(
        "prevImageLoaded",
        false
      ),
    };
  }

  getFromPassedStateOrDefault(key, defaultVal = false) {
    if (
      !this.props.location ||
      !this.props.location.state ||
      !this.props.location.state[key]
    )
      return defaultVal;
    return this.props.location.state[key];
  }

  zIndexes() {
    /* Doing it like this to reduce hidden dependencies. */
    const z = {};
    var next = 1;
    z["prefetchedImages"] = next++;
    z["currentImagePlaceholder"] = next++;
    z["currentImage"] = next++;
    z["invisibleLinks"] = next++;
    z["navButtons"] = next++;
    return z;
  }

  enterFullScreenAndRender() {
    enterFullScreen();
    this.setState({
      /* Re-render with the correct toggle icon. */
      isFullScreen: true,
    });
  }

  exitFullScreenAndRender() {
    exitFullScreen();
    this.setState({
      /* Re-render with the correct toggle icon. */
      isFullScreen: false,
    });
  }

  fullScreenChangeHandler() {
    /* This exists to detect changes in full screen initiated with browser functions (as opposed to our fullscreen icon).
     * Note that we still need functions enterFullScreenAndRender and exitFullScreenAndRender.
     * Even though this does the same thing, devices are usually slow to enter/exit full screen mode,
     * so if we immediately render a change in icon, the user doesn't feel like something is broken. */
    if (!document) return;
    if (
      !document.webkitIsFullScreen &&
      !document.mozFullScreen &&
      !document.msFullscreenElement
    ) {
      this.exitFullScreenAndRender();
    } else {
      this.enterFullScreenAndRender();
    }
  }

  handleKeyDown = (event) => {
    if (event.keyCode === 37) {
      /* Left arrow. */
      navigate(`/menu/images/${this.state.pageContext.prevId}`, {
        state: this.getStatePassForPrev(),
      });
    } else if (event.keyCode === 39) {
      /* Right arrow. */
      navigate(`/menu/images/${this.state.pageContext.nextId}`, {
        state: this.getStatePassForNext(),
      });
    }
  };

  useOfQueryParams() {
    return (
      typeof window !== "undefined" &&
      window &&
      window.location.href.includes("/menu/images/fromGallery?id=")
    );
  }

  componentDidMount() {
    /* Keyboard listener for arrow key navigation. */
    if (
      typeof document !== "undefined" &&
      document.addEventListener &&
      this.state.pageContext
    ) {
      document.addEventListener("keydown", this.handleKeyDown);
    }

    /* Fullscreen change listener to detect when user presses ESC to exit fullscreen. */
    if (typeof document !== "undefined" && document.addEventListener) {
      document.addEventListener(
        "webkitfullscreenchange",
        this.fullScreenChangeHandler,
        false
      );
      document.addEventListener(
        "mozfullscreenchange",
        this.fullScreenChangeHandler,
        false
      );
      document.addEventListener(
        "fullscreenchange",
        this.fullScreenChangeHandler,
        false
      );
      document.addEventListener(
        "MSFullscreenChange",
        this.fullScreenChangeHandler,
        false
      );
    }
  }

  componentWillMount() {
    if (
      this.useOfQueryParams() &&
      !this.getFromPassedStateOrDefault("pageContext")
    ) {
      /* Safeguard against the (unlikely) case where someone uses /images/fromGallery?id=... as an entry-point to the site. */
      const id = window.location.href.split("/menu/images/fromGallery?id=")[1];
      navigate(`/menu/images/${id}`, {
        replace: true,
      });
    }
  }

  currentImageLoaded() {
    /* Trigger re-render, start possible transition. */
    this.setState({
      currentImageLoaded: true,
    });
  }

  nextImageLoaded() {
    this.setState({
      nextImageLoaded: true,
    });
  }

  prevImageLoaded() {
    this.setState({
      prevImageLoaded: true,
    });
  }

  componentWillUnmount() {
    if (this.timer1) {
      clearTimeout(this.timer1);
    }
    if (this.timer2) {
      clearTimeout(this.timer2);
    }
    if (typeof document !== "undefined" && document.removeEventListener) {
      document.removeEventListener("keydown", this.handleKeyDown);
      document.removeEventListener(
        "webkitfullscreenchange",
        this.fullScreenChangeHandler,
        false
      );
      document.removeEventListener(
        "mozfullscreenchange",
        this.fullScreenChangeHandler,
        false
      );
      document.removeEventListener(
        "fullscreenchange",
        this.fullScreenChangeHandler,
        false
      );
      document.removeEventListener(
        "MSFullscreenChange",
        this.fullScreenChangeHandler,
        false
      );
    }
  }

  getStatePassForNext() {
    return {
      isFullScreen: this.state.isFullScreen,
      currentImageLoaded: this.state.nextImageLoaded,
      prevImageLoaded: this.state.currentImageLoaded,
    };
  }

  getStatePassForPrev() {
    return {
      isFullScreen: this.state.isFullScreen,
      currentImageLoaded: this.state.prevImageLoaded,
      nextImageLoaded: this.state.currentImageLoaded,
    };
  }

  render() {
    const c = this.state.pageContext;

    return (
      <>
        {" "}
        <Helmet>
          <meta charSet="utf-8" />
          <title>York Kadıköy</title>
          <html lang="en" />
          <meta name="description" content="York Kadıköy" />
          <meta name="author" content="Orkun Alkış" />
          <style>
            {/* 
                Set some CSS attributes into html and body tags of this page.
                We do this here because a Gatsby bug prevents us from doing it the clean way
                (which would be: using separate CSS files for setting separate html/body attributes to different pages).
            */}
            {`
              html {
                height: 100%;
                overflow-y: hidden !important;
                overflow-x: hidden !important;
              }
              body {
                height: 100%;
                background-color: #fcf7e9;
                margin: 0 0 0 0;
                background-image: url("/img/beer.svg");
              }
              * {
                -webkit-tap-highlight-color: transparent !important;
                outline: none !important;
              }
              #gatsby-noscript {
                display: none;
              }

            `}
          </style>
        </Helmet>
        <GlobalStateContext.Consumer>
          {(globalState) => (
            <>
              <CornerCaseHandler
                g={globalState}
                currId={c.image.id}
                nextId={c.nextId}
              />

              {/* Invisible helper links for prev/next navigation: clicking left side of the viewport links to prev, right side to next. */}
              <Link
                to={`/menu/images/${c.prevId}`}
                state={this.getStatePassForPrev()}
                title={c.image.title}
              >
                <span
                  style={{
                    position: "fixed",
                    height: "100%",
                    width: "50%",
                    left: "0px",
                    zIndex: this.zIndexes["invisibleLinks"],
                  }}
                ></span>
              </Link>
              <Link
                to={`/menu/images/${c.nextId}`}
                state={this.getStatePassForNext()}
                title={c.image.title}
              >
                <span
                  style={{
                    position: "fixed",
                    height: "100%",
                    width: "50%",
                    right: "0px",
                    zIndex: this.zIndexes["invisibleLinks"],
                  }}
                ></span>
              </Link>

              {/* Navbuttons: prev/next (even though clicking anywhere on the page works, we want to help the user understand what they can do). */}
              <Link
                to={`/menu/images/${c.prevId}`}
                state={this.getStatePassForPrev()}
              >
                <FaArrowLeft
                  className="arrowButtons"
                  style={{
                    left: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                  title="Önceki fotoğraf"
                />
              </Link>
              <Link
                to={`/menu/images/${c.nextId}`}
                state={this.getStatePassForNext()}
              >
                <FaArrowRight
                  className="arrowButtons"
                  style={{
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                  title="Sonraki fotoğraf"
                />
              </Link>

              {/* Navbutton: Top right 'x' to 'close' the image and return to gallery. */}
              <span className="x">
                <Link
                  to={`/menu/#id${c.image.id}`}
                  state={{ highlight: c.image.id }}
                  title="Galeriye Geri Dön"
                >
                  <FaTimesCircle style={{ right: "10px", top: "10px" }} />
                </Link>
              </span>

              {/* Navbutton: Fullscreen toggle. */}
              <span className="fullscreen">
                {this.state.isFullScreen && (
                  <FaCompress
                    style={{
                      right: "10px",
                      bottom: "10px",
                      cursor: "pointer",
                    }}
                    title="Tam ekrandan çık"
                    onClick={this.exitFullScreenAndRender}
                  />
                )}
                {!this.state.isFullScreen && (
                  <FaExpand
                    style={{
                      right: "10px",
                      bottom: "10px",
                      cursor: "pointer",
                    }}
                    title="Tam ekran"
                    onClick={this.enterFullScreenAndRender}
                  />
                )}
              </span>

              {/* Navbutton: Download image. */}
              {/* <span className="download">
                <a href={c.image.fluid.originalImg} download>
                  <FaDownload
                    style={{ right: "80px", bottom: "12px" }}
                    title="Download photo"
                  />
                </a>
              </span> */}

              {/* Current image.
               *     Includes a workaround to guarantee onLoad firing.
               *     The issue:
               *            If the image is already in cache, the browser may not fire onLoad event.
               *            Occurs on initial load only, not with subsequent SPA navigation.
               *     The workaround:
               *            During the initial render we add the img to DOM with onLoad but without src properties.
               *            Then we immediately re-render with the added src properties, causing onLoad to fire
               *            even if the images are found in cache. */}
              <img
                className={`currentImage decoratedImage ${
                  this.state.currentImageLoaded ? "fade-in" : "hide"
                }`}
                onLoad={this.currentImageLoaded}
                src={
                  globalState.initialRender ? "" : c.image.fluid.originalImg
                } /* Workaround for onload firing. */
                srcSet={
                  globalState.initialRender ? "" : c.image.fluid.srcSet
                } /* Workaround for onload firing. */
                sizes={
                  globalState.initialRender ? "" : c.image.fluid.sizes
                } /* Workaround for onload firing. */
                alt=""
                title={c.image.title}
                importance="high" /* Resource prioritization hint. */
                style={{ zIndex: this.zIndexes["currentImage"] }}
              />

              {/* Placeholder: If current image is not ready, display placeholder until current image has loaded, then transition. */}
              <img
                className={`currentImagePlaceholder ${
                  this.state.currentImageLoaded ? "fade-out" : ""
                }`}
                src={c.image.fluid.tracedSVG}
                alt=""
                style={{
                  zIndex: this.zIndexes["currentImagePlaceholder"],
                  height: "1337%",
                  borderRadius: "0px",
                }}
              />

              {/* Fallback: If JS is disabled, degrade gracefully from placeholder-transition to just-show-current-image. */}
              <noscript>
                <img
                  className="currentImage decoratedImage"
                  src={c.image.fluid.originalImg}
                  srcSet={c.image.fluid.srcSet}
                  sizes={c.image.fluid.sizes}
                  alt=""
                  title={c.image.title}
                  importance="high"
                  style={{ zIndex: this.zIndexes["currentImage"] }}
                />
                <style>{`
                        .currentImagePlaceholder {
                          opacity: 0 !important
                        }
                      `}</style>
              </noscript>

              {/* Preload adjacent images (hide with CSS).
               *     Why like this, and not with link rel prefetch?
               *     1. link rel prefetch sometimes eats bandwidth from current image.
               *     2. link rel prefetch can not be used with srcSet. */}
              {this.state.currentImageLoaded && (
                <>
                  <img
                    onLoad={this.nextImageLoaded}
                    className="prefetchedImages"
                    src={
                      globalState.initialRender
                        ? ""
                        : c.prefetchNext1.originalImg
                    } /* Workaround for onload firing. */
                    srcSet={
                      globalState.initialRender ? "" : c.prefetchNext1.srcSet
                    } /* Workaround for onload firing. */
                    sizes={
                      globalState.initialRender ? "" : c.prefetchNext1.sizes
                    } /* Workaround for onload firing. */
                    alt=""
                    importance="low"
                  />
                  <img
                    onLoad={this.prevImageLoaded}
                    className="prefetchedImages"
                    src={
                      globalState.initialRender
                        ? ""
                        : c.prefetchPrev.originalImg
                    } /* Workaround for onload firing. */
                    srcSet={
                      globalState.initialRender ? "" : c.prefetchPrev.srcSet
                    } /* Workaround for onload firing. */
                    sizes={
                      globalState.initialRender ? "" : c.prefetchPrev.sizes
                    } /* Workaround for onload firing. */
                    alt=""
                    importance="low"
                  />
                  <img
                    className="prefetchedImages"
                    src={
                      c.prefetchNext2.originalImg
                    } /* No onLoad event attached so no need for workaround here. */
                    srcSet={c.prefetchNext2.srcSet}
                    sizes={c.prefetchNext2.sizes}
                    alt=""
                    importance="low"
                  />
                </>
              )}

              <style jsx>
                {`
                  img {
                    position: absolute;
                    margin-left: auto;
                    margin-right: auto;
                    margin-top: auto;
                    margin-bottom: auto;
                    padding: 0;

                    left: 5%;
                    right: 5%;
                    top: 3%;
                    bottom: 3%;
                    max-height: 94%;
                    max-width: 90%;
                  }

                  @media only screen and (max-width: 1200px) {
                    img {
                      left: 0px;
                      right: 0px;
                      top: 0px;
                      bottom: 0px;
                      max-height: 100%;
                      max-width: 100%;

                      -webkit-box-shadow: 0 0 0 0 !important;
                      -moz-box-shadow: 0 0 0 0 !important;
                      box-shadow: 0 0 0 0 !important;
                    }
                  }

                  .decoratedImage {
                    -webkit-box-shadow: 1vw 1vh 5vh 0px rgba(0, 0, 0, 0.75);
                    -moz-box-shadow: 1vw 1vh 5vh 0px rgba(0, 0, 0, 0.75);
                    box-shadow: 1vw 1vh 5vh 0px rgba(0, 0, 0, 0.75);
                    border-radius: 8px;
                  }

                  .hide {
                    opacity: 0;
                  }

                  .fade-in {
                    opacity: 1;
                    transition: ${this.placeholderTransitionDuration}ms ease-in;
                  }

                  .fade-out {
                    opacity: 0;
                    transition: ${this.placeholderTransitionDuration}ms step-end;
                  }

                  .prefetchedImages {
                    opacity: 0;
                    z-index: ${this.zIndexes["prefetchedImages"]};
                  }

                  @media only screen and (max-width: 1200px) {
                    :global(.arrowButtons) {
                      visibility: hidden;
                    }
                  }

                  :global(svg) {
                    position: fixed;
                    font-size: 40px;
                    fill: ${theme.color.brand.primary};
                    opacity: 0.5;
                    z-index: ${this.zIndexes["navButtons"]};
                  }

                  :global(svg):hover {
                    opacity: 1;
                  }
                `}
              </style>
            </>
          )}
        </GlobalStateContext.Consumer>
      </>
    );
  }
}

export default PostcardTemplateForMenu;
