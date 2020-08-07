import React from "react";
import Layout from "../components/Layout";
import LeafletMap from "../components/leafletmap";
import { FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
const IndexPage = () => (
  <Layout>
    {typeof window !== "undefined" && (
      <LeafletMap
        position={[40.986238, 29.025818]}
        zoom={18}
        markerText={"York Kadıköy"}
      />
    )}
    <section>
      <div align="center" style={{ marginTop: 20 }}>
        <div>
          <a href="https://maps.google.com/?q=york+Kadıköy/@40.9801391,29.0647604,14z/data=!3m1!4b1">
            <a href="https://maps.apple.com/maps?q=york+Kadıköy/@40.9801391,29.0647604,14z/data=!3m1!4b1">
              <FaMapMarkerAlt />
              Caferağa Mah, Dr. Esat Işık Cd. No:5A, 34710 Kadıköy/İstanbul{" "}
            </a>
          </a>
        </div>
        <div style={{ marginTop: 20 }}>
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
