import React from 'react';
import { MapContainer, TileLayer, Popup, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import customIconUrl from '../assets/marker-icon.png';

const LeafletMap = ({selectedLocation, setSelectedLocation, issues, openSelectedIssue, selectedIssue, setSelectedIssue}) => {
  const customIcon = L.icon({
    iconUrl: customIconUrl,
    iconSize: [20, 32], 
  });

  const initialMarkers = [];
  if (issues.length > 0) {
    issues.forEach((issue, index) => {
      const coordinates = JSON.parse(issue.coordinates);

      if (coordinates && coordinates.length === 2) {
        initialMarkers.push({
          position: coordinates,
          title: issue.title,
          description: issue.description,
          issueId: issue[0].toNumber(),
          upvotes: issue.upvoteCount.toNumber(),
          issueLink: issue.ipfsFixIt
        });
      }
    });
  }

  const handleClick = (e) => {
    if (selectedLocation !== null) {
      setSelectedLocation(null);
    } else {
      setSelectedLocation(e.latlng);
    }
  };

  const clearSelectedLocation = () => {
    setSelectedLocation(null);
  };

  const closePopup = () => {
    setSelectedIssue(false);
    const element = document.querySelector(".leaflet-popup");
    element.style.display = "none";
  }

  const LocationSelector = () => {
    const map = useMapEvents({
      click: handleClick, 
    });

    return selectedLocation ? (
      <Marker position={selectedLocation} icon={customIcon}  >
        <Popup >
          <div>
            <p>Selected Location</p>
            <p>Latitude: {selectedLocation.lat}</p>
            <p>Longitude: {selectedLocation.lng}</p>
            <button onClick={clearSelectedLocation}>Clear Selection</button>
          </div>
        </Popup>
      </Marker>
    ) : null;
  };

  return (
    <MapContainer center={[51.50, -0.09]} zoom={14} scrollWheelZoom={true} style={{ height: '900px' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {initialMarkers.map((marker, index) => (
        <Marker key={index} position={marker.position} icon={customIcon}>
          <Popup>
            <div>
              <p>Description: {marker.description}</p>
              <img src={marker.issueLink} alt="Issue" className="issue-image"/>
              <br></br>
              <button onClick={() => openSelectedIssue(marker)}>Show Details</button>
              <button onClick={closePopup}>Close</button>
            </div>
          </Popup>
        </Marker>
      ))}
      <Marker position={[510.505, -0.09]}>
        <LocationSelector />
      </Marker>
    </MapContainer>
  );
};

export default LeafletMap;
