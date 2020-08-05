import React from "react";
import Layout from "../components/Layout";
import LeafletMap from "../components/leafletmap";
import { FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
const IndexPage = () => (
  <Layout>
    {typeof window !== "undefined" && (
      <LeafletMap
        position={[40.986238, 29.025818]}
        zoom={22}
        markerText={"York Kadıköy"}
      />
    )}
    <section>
      <div>
        {" "}
        <div className="column is-4">
          Adres:&nbsp;
          <a href="https://goo.gl/maps/KMuGcEsRzmDxjbiy6">
            <FaMapMarkerAlt />
            Caferağa Mah, Dr. Esat Işık Cd. No:5A, 34710 Kadıköy/İstanbul
          </a>
        </div>
        <div className="column is-4">
          Telefon:&nbsp;
          <a href="tel:+902164501000">
            <FaPhoneAlt />
            (0216) 450 10 00
          </a>
        </div>
      </div>
    </section>
  </Layout>
);

export default IndexPage;
