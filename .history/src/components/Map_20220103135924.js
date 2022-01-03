import * as React from "react";
import { Component } from "react";
import MapGL, { Marker } from "react-map-gl";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import styled from 'styled-components';

import { getDatabase, ref, onValue, child } from "firebase/database";
import { initializeApp } from "firebase/app";

import { useLocation } from "react-router-dom";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiaW5zcGlyZWRieWJpbmFsIiwiYSI6ImNreGw1NmM1ajVudmIzMW11Yzh3eXJoZXAifQ.fjUlSMdnVlGlOfOtQm1LHA"; // Set your mapbox token here

export default function Map() {
  const { state } = useLocation();
  const uid = state;
  console.log(uid);

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
      };

      //initialize firebase
      let firebaseConfig = {
        apiKey: "AIzaSyAfn6G63Dind4XNtE9DTI-e76okA3sIjCQ",
        authDomain: "walk-safe-a8a0c.firebaseapp.com",
        databaseURL: "https://walk-safe-a8a0c-default-rtdb.firebaseio.com",
      };
      initializeApp(firebaseConfig);

      this.db = getDatabase();
    }

    componentDidMount() {
      //listen for added location
      this.startLocChangeListener();
      console.log(this.props);
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
            xlmns="http://www/w3/org/2000/svg"
          >
            <rect width="100%" height="100%" fill="red"></rect>
          </svg>
        </Marker>
      );
    }

    renderMarkers() {
      console.log(this.state.markers.length);

      if (this.state.markers.length === 0) return;
      return this.state.markers.map(this.renderMarker);
    }

    addMarker(lat, long) {
      this.setState(
        {
          order: this.state.order + 1,

          markers: [
            ...this.state.markers,
            {
              latitude: lat,
              longitude: long,
              order: this.state.order,
            },
          ],
        },
        () => console.log("len: " + this.state.markers.length)
      );
    }

    startLocChangeListener() {
      onValue(child(ref(this.db), `${uid}/locations`), (snap) => {
        snap.forEach((childSnap) => {
          let lat = childSnap.child("item/coords/latitude").val();
          let long = childSnap.child("item/coords/longitude").val();
          this.addMarker(lat, long);
        });
      });
    }

    render() {
      const mystyle = {
        padding: "1.5rem"
      };

      const title = {
        color: "#6CBCAE",
        fontSize: 25,
        fontWeight: "bold",
        marginTop: 50,
        paddingBottom: "0.5rem"
      };

      const paragraph = {
        lineHeight: 1,
      }

      const heading = {
        fontWeight: "bold",
        fontSize: 20,
        marginTop: -30,
        paddingBottom: "0.5rem"
      }

      const smalltext = {
        marginTop: -30,
        marginBottom: 10
      }

      const boldpara = {
        fontWeight: 'bold',
        lineHeight: 1.25,
      }

      const headingtwo = {
        fontWeight: "bold",
        fontSize: 20,
        paddingBottom: "0.5rem",
        color: "#6CBCAE",
        marginTop: 20
      }

      const bullets = {
        marginTop: -3,
        marginLeft: -10,
        fontSize: 15,
      }

      const steps = ["User is not responding", "User’s location has not been updated for a while", "User entered an unexpected location", "etc."];
      const listItems = steps.map((steps) =>
        <li>{steps}</li>
      );

      const Button = styled.button`
        background-color: 'red'
        `

      return (
        <div>
          <Container>
            <Row style={mystyle}>
              <div style={title}>Get Home Safe</div>
              <div style={paragraph}>
                Track your friend's location to ensure they reach home safely.
              </div>
            </Row>
            <Row style ={mystyle}>
              <div style={heading}>Tracked Location</div>
              <MapGL
                {...this.state.viewport}
                width="85vw"
                height="30vh"
                mapStyle="mapbox://styles/mapbox/streets-v11"
                onViewportChange={(viewport) => this.setState({ viewport })}
                mapboxApiAccessToken={MAPBOX_TOKEN}
              >
                {/* {this.renderMarker({latitude:37, longitude:-122, order: 0})} */}
                {this.renderMarkers()}
              </MapGL>
            </Row>
            <Row style={mystyle} className="location-info">
              <div style={smalltext}>Last seen x minutes ago</div>
              <div style={boldpara}>Once the user ends their location sharing session, you will be notified.</div>
              <div style={headingtwo}>Notice something of concern?</div>
              <ul style={bullets}>{listItems}</ul>,
              <Button>Call Police</Button>
            </Row>
          </Container>
        </div>
      );
    }
  }
  return <MapClass />;
}
