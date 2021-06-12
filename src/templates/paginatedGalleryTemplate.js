import React from "react";
import { GlobalStateContext } from "../components/globalState.js";
import { View } from "../components/view.js";
// import "../components/layout.css";
import "typeface-open-sans/index.css";
import { exitFullScreen } from "../util/fullScreenHelpers.js";
//import theme from "../theme.yaml"
import Layout from "../components/Layout";
import { graphql } from 'gatsby';

class PaginatedGalleryTemplate extends React.Component {
  componentDidMount() {
    exitFullScreen();
  }

  render(data) {
    const highlight =
      this.props.location && this.props.location.state
        ? this.props.location.state.highlight
        : -1;
    return (
      <>
        <Layout>
        <div
      className="full-width-image-container margin-top-0"
      style={{
        backgroundImage: `url(${
          !!this.props.data.image.childImageSharp
            ? this.props.data.image.childImageSharp.fluid.src
            : this.props.data.image
        })`,
        height: "70vh",
      }}
    >
      <h1
        className="has-text-weight-bold is-size-1"
        style={{
          color: "white",
          padding: "1rem",
        }}
      >
        - Galeri -
      </h1>
    </div>

          <GlobalStateContext.Consumer>
            {(globalState) => (
              <>
                <View
                  globalState={globalState}
                  pageContext={this.props.pageContext}
                  highlight={highlight}
                />
              </>
            )}
          </GlobalStateContext.Consumer>
        </Layout>
      </>
    );
  }
}

export const query = graphql`
  query {
    image: file(relativePath: { eq: "mainpage_event.jpg" }) {
      childImageSharp {
        fluid {
          ...GatsbyImageSharpFluid
        }
      }
    }
  }
`;

export default PaginatedGalleryTemplate;
