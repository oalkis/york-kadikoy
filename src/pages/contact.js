import React from "react";
import Layout from "../components/Layout";
import LeafletMap from "../components/leafletmap";
import { FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import Grid from "@material-ui/core/Grid";
import { graphql } from "gatsby";

const IndexPage = ({ data }) => (
  <Layout>
    
    <div
      className="full-width-image-container margin-top-0"
      style={{
        backgroundImage: `url(${
          !!data.image.childImageSharp
            ? data.image.childImageSharp.fluid.src
            : data.image
        })`,
        height: "30vh",
      }}
    >
      <h1
        className="has-text-weight-bold is-size-1"
        style={{
          color: "white",
          padding: "1rem",
        }}
      >
        - İletişim -
      </h1>
    </div>
<div className="container">

    <section>
      <Grid
        container
        direction="row"
        justify="space-around"
        alignItems="flex-start"
      >
        <div align="center">
          <h3>Telefon Numarası</h3>
          <a href="tel:+902164501000">
            <FaPhoneAlt />
            (0216) 450 10 00
          </a>
        </div>

        <div align="center">
          <h3>Adres</h3>
          <a href="https://maps.google.com/?q=york+Kadıköy/@40.9801391,29.0647604,14z/data=!3m1!4b1">
            <a href="https://maps.apple.com/maps?q=york+Kadıköy/@40.9801391,29.0647604,14z/data=!3m1!4b1">
              <FaMapMarkerAlt />
              Caferağa Mah, Dr. Esat Işık Cd. No:5A, 34710 Kadıköy/İstanbul{" "}
            </a>
          </a>
        </div>

        <div align="center">
          <h3>Çalışma Saatleri</h3>
          12:00 - 02:00
        </div>
      </Grid>
    </section>
    <div style={{ marginTop: 50 }}>
      {typeof window !== "undefined" && (
        <LeafletMap
          position={[40.986238, 29.025818]}
          zoom={18}
          markerText={"York Kadıköy"}
        />
      )}
    </div>
    </div>

  
  </Layout>
);

export const query = graphql`
  query {
    image: file(relativePath: { eq: "york-logo.jpg" }) {
      childImageSharp {
        fluid {
          ...GatsbyImageSharpFluid
        }
      }
    }
  }
`;

export default IndexPage;
