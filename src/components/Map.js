import * as React from "react";
import { Component } from "react";
import MapGL, { Marker } from "react-map-gl";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import styled from "styled-components";

import { getDatabase, ref, onValue, child, get, set } from "firebase/database";
import firebase from "../Firebase.js";
import { DeleteUser } from "./DeleteUser.js";

import { useLocation } from "react-router-dom";

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_KEY; // Set your mapbox token here

export default function Map() {
  const { state } = useLocation();
  const uid = state;

  window.addEventListener("beforeunload", () => {
    DeleteUser();
  });

  class MapClass extends Component {
    constructor(props) {
      super(props);

      this.state = {
        //markers: [{latitude:37, longitude:-122, order: 0}],
        markers: [],
        order: 0,
        viewport: {
          latitude: 37.8,
          longitude: -122.4,
          zoom: 1,
          bearing: 0,
          pitch: 0,
        },
        init_lat: null,
        init_long: null,
        emergency: null,
        last_seen: -1,
      };

      this.callEmergency = this.callEmergency.bind(this);

      this.db = getDatabase(firebase);
    }

    componentDidMount() {
      //listen for added location
      this.startLocChangeListener();
    }

    renderMarker(loc) {
      return (
        <Marker
          key={loc.order}
          latitude={loc.latitude}
          longitude={loc.longitude}
          //offsetLeft={-20} offsetTop={-10}
        >
          <svg
            version="1.1"
            baseProfile="full"
            width="10"
            height="10"
            //xlmns="http://www/w3/org/2000/svg"
          >
            <rect width="100%" height="100%" fill="#D40B0B"></rect>
          </svg>
        </Marker>
      );
    }

    renderMarkers() {
      if (this.state.markers.length === 0) return;
      return this.state.markers.map(this.renderMarker);
    }

    addMarker(lat, long) {
      this.setState({
        order: this.state.order + 1,

        markers: [
          ...this.state.markers,
          {
            latitude: lat,
            longitude: long,
            order: this.state.order,
          },
        ],
      });
    }

    startLocChangeListener() {
      onValue(child(ref(this.db), `users/${uid}/locations`), (snap) => {
        snap.forEach((childSnap) => {
          let lat = childSnap.child("item/latitude").val();
          let long = childSnap.child("item/longitude").val();
          let time = childSnap.child("item/time").val() / 1000;

          //process time (seconds from 2000) to minutes from current
          let curr_time = new Date() / 1000;

          this.setState({ last_seen: parseInt((curr_time - time) / 60) });

          if (this.state.init_lat == null) {
            this.setState({ init_lat: lat, init_long: long });
            this.setInitCountry(lat, long);
          }

          this.addMarker(lat, long);
        });
      });
    }

    setInitCountry(lat, lng) {
      fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}`
      )
        .then((response) => response.json())
        .then((data) => {
          let country = data.features[0].context.at(-1);
          let code = country.short_code;

          //find emergency phone w firebase
          get(child(ref(this.db), `emergency`)).then((snap) => {
            snap.forEach((childSnap) => {
              if (childSnap.key == code) {
                let num = childSnap.val()[0];
                this.setState({ emergency: num });
              }
            });
          });
        });
    }

    callEmergency() {
      if (this.state.emergency != null) {
        window.open(`tel:${this.state.emergency}`);
      } else {
        console.log("cannot place call, no locations detected yet");
      }
    }

    render() {
      return (
        <div>
          <Container>
            <Row style={mystyle}>
              <div style={title}>Get Home Safe</div>
              <div style={paragraph}>
                Track your friend's location to ensure they reach home safely.
              </div>
            </Row>
            <Row style={mystyle}>
              <div style={heading}>Tracked Location</div>
              <MapGL
                {...this.state.viewport}
                width="85vw"
                height="50vh"
                region={{
                  latitude: this.state.init_lat,
                  longitude: this.state.init_long,
                }}
                mapStyle="mapbox://styles/mapbox/streets-v11"
                onViewportChange={(viewport) => this.setState({ viewport })}
                mapboxApiAccessToken={MAPBOX_TOKEN}
              >
                {/* {this.renderMarker({latitude:37, longitude:-122, order: 0})} */}
                {this.renderMarkers()}
              </MapGL>
            </Row>
            <Row style={mystyle} className="location-info">
              <div style={smalltext}>
                Last seen {this.state.last_seen} minutes ago
              </div>
              <div style={boldpara}>
                Once the user ends their location sharing session, you will be
                notified.
              </div>
              <div style={headingtwo}>Notice something of concern?</div>
              <ul style={bullets}>{listItems}</ul>,
              <Button onClick={this.callEmergency}>Call Police</Button>
            </Row>
          </Container>
        </div>
      );
    }
  }
  return <MapClass />;
}

const mystyle = {
  padding: "1.5rem",
};

const title = {
  color: "#6CBCAE",
  fontSize: 25,
  fontWeight: "bold",
  marginTop: 50,
  paddingBottom: "0.5rem",
};

const paragraph = {
  lineHeight: 1,
};

const heading = {
  fontWeight: "bold",
  fontSize: 20,
  marginTop: -30,
  paddingBottom: "0.5rem",
};

const smalltext = {
  marginTop: -30,
  marginBottom: 10,
};

const boldpara = {
  fontWeight: "bold",
  lineHeight: 1.25,
};

const headingtwo = {
  fontWeight: "bold",
  fontSize: 20,
  paddingBottom: "0.5rem",
  color: "#6CBCAE",
  marginTop: 20,
};

const bullets = {
  marginTop: -3,
  marginLeft: -10,
  fontSize: 15,
};

const steps = [
  "User is not responding",
  "User’s location has not been updated for a while",
  "User entered an unexpected location",
  "etc.",
];
const listItems = steps.map((steps) => <li>{steps}</li>);

const Button = styled.button`
  background-color: #d40b0b;
  color: white;
  padding: 5px 15px;
  border-radius: 5px;
  text-transform: uppercase;
  border-color: #d40b0b;
  font-size: 1em;
  margin-bottom: 2em;
`;
