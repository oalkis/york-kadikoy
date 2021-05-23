import React from "react";
import PropTypes from "prop-types";
import { graphql } from "gatsby";
import Layout from "../components/Layout";
import Features from "../components/Features";
import Slider from "react-slick"
import Img from "gatsby-image"
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import  "../components/index-page.css";

const settings = {
  dots: true,
  infinite: true,
  speed: 1000,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  appendDots: dots => <ul style={{ height: "6rem" }}>{dots}</ul>,
  arrows: true,

  // afterChange: (index) => this.setState({ currentSlide: index }),
 
};
export const IndexPageTemplate = ({
  slides,
  heading,
  description,
  intro,
  subheading,
}) => (
  <div>
    <Slider {...settings} className="overflow-hidden" >
      {slides.map((item) => (
        <Img
        className="full-width-image margin-top-0"
        fluid={item.image.childImageSharp.fluid} />
      ))}
    </Slider>
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
  title: PropTypes.string,
  slides: PropTypes.array,
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

  console.log(frontmatter);
  return (
    <Layout>
      <IndexPageTemplate
        slides={frontmatter.slides}
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
        slides {
          image {
            childImageSharp {
              fluid(maxWidth: 1200, quality: 64) {
                ...GatsbyImageSharpFluid
              }
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
