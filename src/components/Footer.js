import React from "react";
import { Link } from "gatsby";

import logo from "../img/logo.svg";
import facebook from "../img/social/facebook.svg";
import instagram from "../img/social/instagram.svg";
// import twitter from "../img/social/twitter.svg";
// import vimeo from "../img/social/vimeo.svg";

const Footer = class extends React.Component {
  render() {
    return (
      <footer className="footer has-background-white has-text-white-ter">
        <div className="content has-text-centered has-background-black has-text-white-ter">
          <div className="container has-background-black has-text-white-ter">
            <div style={{ maxWidth: "100vw" }} className="columns">
              <div className="column is-4">
                <section className="menu">
                  <div className="navbar-start has-text-centered">
                    <Link className="footerItem" to="/">
                      Anasayfa
                    </Link>
                    <Link className="footerItem" to="/gallery">
                      Galeri
                    </Link>
                    <Link className="footerItem" to="/contact">
                      İletişim
                    </Link>
                    <Link className="footerItem" to="/menu">
                      Menü
                    </Link>
                  </div>
                </section>
              </div>
              <div className="column is-4">
                <div className="content has-text-centered">
                  <img
                    src={logo}
                    alt="York Kadıköy"
                    style={{ width: "6em", height: "4em",backgroundColor:"white",borderRadius:"4em" }}
                  />
                </div>
              </div>
              <div className="column is-4 social">
                <a title="facebook" href="https://facebook.com/yorkkadikoy/">
                  <img
                    src={facebook}
                    alt="Facebook"
                    style={{ width: "1em", height: "1em" }}
                  />
                </a>
                {/* <a title="twitter" href="https://twitter.com">
                  <img
                    className="fas fa-lg"
                    src={twitter}
                    alt="Twitter"
                    style={{ width: "1em", height: "1em" }}
                  />
                </a> */}
                <a title="instagram" href="https://instagram.com/york_kadikoy/">
                  <img
                    src={instagram}
                    alt="Instagram"
                    style={{ width: "1em", height: "1em" }}
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }
};

export default Footer;
