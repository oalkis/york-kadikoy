import React, { Component } from "react";
import GoogleMapReact from "google-map-react";
import config from "../config.yaml";
import toast from "../img/toast.svg";

class SimpleMap extends Component {
  static defaultProps = {
    center: {
      lat: 40.986413,
      lng: 29.02579,
    },
    zoom: 18,
  };

  render() {
    console.log(config);
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: "50vh", width: "100%" }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: config.googleMapApiKey }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
          yesIWantToUseGoogleMapApiInternals
        >
          <img
            src={toast}
            alt="York Kadıköy"
            style={{ width: "3em", height: "3em" }}
          />
        </GoogleMapReact>
      </div>
    );
  }
}

export default SimpleMap;
