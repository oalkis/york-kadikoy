import React from "react";
import { graphql } from "gatsby";
import Img from "gatsby-image";
import Layout from "../../components/Layout";
import "./index.css";

const IndexPage = ({ data }) => {
  return (
    <Layout>
      <div>
        <div className="image-grid">
          {data.allFile.edges.map(({ node }) => {
            return <Img key={node.id} fluid={node.childImageSharp.fluid} />;
          })}
        </div>
      </div>{" "}
    </Layout>
  );
};

export const pageQuery = graphql`
  {
    allFile(filter: { absolutePath: { regex: "/gallery/.*.jpg$/" } }) {
      edges {
        node {
          id
          childImageSharp {
            fluid {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
  }
`;

export default IndexPage;
