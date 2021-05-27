import React from "react";
import PropTypes from "prop-types";
import { graphql } from "gatsby";
import Layout from "../components/Layout";
import Features from "../components/Features";
import Slider from "react-slick";
import Img from "gatsby-image";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../components/index-page.css";

const settings = {
  dots: true,
  infinite: true,
  speed: 3000,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  appendDots: (dots) => <ul style={{ height: "6rem" }}>{dots}</ul>,
  arrows: true,
};

export const IndexPageTemplate = ({
  slides,
  heading,
  description,
  intro,
  subheading,
  image,
}) => {
  return (
    <div>
      <Slider {...settings} className="overflow-hidden">
        {slides.map((item) => (
          <Img
            className="full-width-image margin-top-0"
            fluid={item.image.childImageSharp.fluid}
          />
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
                      <center>
                        <h3 className="has-text-weight-semibold is-size-2">
                          {heading}
                        </h3>
                        <p>{description}</p>
                        <h4>{subheading}</h4>
                      </center>
                    </div>
                  </div>
                  <Features gridItems={intro.blurbs} />
                  <div
                    className="full-width-image-container margin-top-0"
                    style={{
                      backgroundImage: `url(${
                        !!image.childImageSharp
                          ? image.childImageSharp.fluid.src
                          : image
                      })`,
                      height: "30vh",
                    }}
                  >
                    <div align="center" style={{
                          paddingBottom: "2rem",
                          
                        }}>
                      <h1
                        style={{
                          color: "white",
                          fontSize: "3rem",
                          marginBottom: "2rem",
                        }}
                      >
                        ETKİNLİKLER İÇİN{" "}
                      </h1>
                      <a
                        className="buttonItem"
                       
                        href="/contact"
                      >
                        Tıklayınız
                      </a>
                      )
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

IndexPageTemplate.propTypes = {
  image: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),

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
