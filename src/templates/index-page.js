import React from "react";
import PropTypes from "prop-types";
import { graphql } from "gatsby";
import Layout from "../components/Layout";
import Features from "../components/Features";

export const IndexPageTemplate = ({
         image,
         heading,
         description,
         intro,
         subheading,
       }) => (
         <div>
           <div
             className="full-width-image margin-top-0"
             style={{
               backgroundImage: `url(${
                 !!image.childImageSharp
                   ? image.childImageSharp.fluid.src
                   : image
               })`,
               backgroundPosition: `top`,
             }}
           ></div>
           <section className="section section--gradient">
             <div className="container">
               <div className="section">
                 <div
                   className="columns"
                   style={{ width: "100%", margin: "0 auto" }}
                 >
                   <div className="column is-10 is-offset-1">
                     <div className="content">
                       <div className="columns">
                         <div className="column is-12">
                           <h3 className="has-text-weight-semibold is-size-2">
                             {heading}
                           </h3>
                           <p>{description}</p>
                           <center>
                             <h4>{subheading}</h4>
                           </center>
                         </div>
                       </div>
                       <Features gridItems={intro.blurbs} />
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           </section>
         </div>
       );

IndexPageTemplate.propTypes = {
  image: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  title: PropTypes.string,
  heading: PropTypes.string,
  subheading: PropTypes.string,
  mainpitch: PropTypes.object,
  description: PropTypes.string,
  intro: PropTypes.shape({
    blurbs: PropTypes.array,
  }),
};

const IndexPage = ({ data }) => {
  const { frontmatter } = data.markdownRemark;

  return (
    <Layout>
      <IndexPageTemplate
        image={frontmatter.image}
        title={frontmatter.title}
        heading={frontmatter.heading}
        subheading={frontmatter.subheading}
        mainpitch={frontmatter.mainpitch}
        description={frontmatter.description}
        intro={frontmatter.intro}
      />
    </Layout>
  );
};

IndexPage.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.shape({
      frontmatter: PropTypes.object,
    }),
  }),
};

export default IndexPage;

export const pageQuery = graphql`
  query IndexPageTemplate {
    markdownRemark(frontmatter: { templateKey: { eq: "index-page" } }) {
      frontmatter {
        title
        image {
          childImageSharp {
            fluid(maxWidth: 2048, quality: 100) {
              ...GatsbyImageSharpFluid
            }
          }
        }
        heading
        subheading
        mainpitch {
          title
          description
        }
        description
        intro {
          blurbs {
            image {
              childImageSharp {
                fluid(maxWidth: 320, quality: 64) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
            text
          }
          heading
          description
        }
      }
    }
  }
`;
