import React from "react";
import { GlobalStateContext } from "../components/globalState.js";
import { ViewForMenu } from "../components/view.js";
// import "../components/layout.css";
import "typeface-open-sans/index.css";
import { exitFullScreen } from "../util/fullScreenHelpers.js";
//import theme from "../theme.yaml"
import Layout from "../components/Layout";

class PaginatedGalleryTemplateForMenu extends React.Component {
  componentDidMount() {
    exitFullScreen();
  }

  render() {
    const highlight =
      this.props.location && this.props.location.state
        ? this.props.location.state.highlight
        : -1;
    return (
      <>
        <Layout>
          <GlobalStateContext.Consumer>
            {(globalState) => (
              <>
                <ViewForMenu
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

export default PaginatedGalleryTemplateForMenu;
