import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react'
import React, { useState } from 'react'

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

	return (
		<Map
			google={google}
			containerStyle={{
				position: 'fixed',
				width: '40%',
				height: '100%',
				border: '1px solid black',
			}}
			style={{
				width: '100%',
				height: '100%',
			}}
			center={getCenter()}
			initialCenter={getCenter()}
			zoom={5}
			disableDefaultUI={true}
		>
			{locations.map((location, index) => {
				location.pos = index
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
					<div>whatever we want this to say</div>
				</div>
			</InfoWindow>
		</Map>
	)
}

export default GoogleApiWrapper({
	apiKey: 'AIzaSyDwmj1y_jUUMEddwi4T0AydIoUKvb_Qz-8',
})(CustomMap)
