import { Map, InfoWindow, Marker, GoogleApiWrapper } from "google-maps-react"
import React, { useState } from "react"

function CustomMap({ google, locations = [] }) {
  const [activeMarker, setActiveMarker] = useState(undefined)
  const [selectedPlace, setSelectedPlace] = useState(undefined)

  const [showingInfoWindow, setShowingInfoWindow] = useState(false)

  const getCenter = () => {
    const center = locations.find((location) => {
      return location.marker
    })
    return { lat: 39.7392, lng: -104.9903 }
  }

  const markerClick = (props, marker) => {
    setActiveMarker(marker)
    setSelectedPlace(props)
    setShowingInfoWindow(true)
  }

  console.log(google)

  return (
    <Map
      google={google}
      className="w-full lg:w-2/5 lg:fixed relative h-72 lg:h-full !important"
      zoom={5}
      gestureHandling={"cooperative"}
      initialCenter={getCenter()}
      streetViewControl={true}
      streetViewControlOptions={{
        position: google.maps.ControlPosition.LEFT_CENTER,
      }}
      zoomControlOptions={{ position: google.maps.ControlPosition.LEFT_BOTTOM }}
      center={getCenter()}
      zoomControl={true}
      scaleControl={true}
      scaleControlOptions={{
        position: google.maps.ControlPosition.BOTTOM_LEFT,
      }}
    >
      {locations.map((location, index) => {
        location.pos = index + 1
        if (location.marker) {
          return (
            <Marker
              key={index}
              position={location.marker}
              name={location.businessname}
              label={location.pos.toString()}
              onClick={markerClick}
            ></Marker>
          )
        }
      })}
      <InfoWindow marker={activeMarker} visible={true}>
        <div>
          <h3>{selectedPlace?.name}</h3>
          <div>{selectedPlace?.description}</div>
        </div>
      </InfoWindow>
    </Map>
  )
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyDwmj1y_jUUMEddwi4T0AydIoUKvb_Qz-8",
})(CustomMap)
