import React from "react";
import { graphql } from "gatsby";
import Img from "gatsby-image";
import Layout from "../../components/Layout";
import "./index.css";

const IndexPage = ({ data }) => {
  return (
    <Layout>
      <div>
        <div className="photos">
          {data.allFile.edges.map(({ node }) => {
            return <Img key={node.id} fixed={node.childImageSharp.fixed} />;
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
            fixed {
              ...GatsbyImageSharpFixed
            }
          }
        }
      }
    }
  }
`;

export default IndexPage;
