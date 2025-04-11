import { useState, useEffect, useRef } from 'react';

// Sample data for Delhi zones
const zoneData = [
  { id: 1, name: "Connaught Place", status: "red", lat: 28.6289, lng: 77.2074 },
  { id: 2, name: "Karol Bagh", status: "red", lat: 28.6518, lng: 77.1929 },
  { id: 3, name: "Chandni Chowk", status: "red", lat: 28.6505, lng: 77.2303 },
  { id: 4, name: "Lajpat Nagar", status: "yellow", lat: 28.5689, lng: 77.2373 },
  { id: 5, name: "Dwarka", status: "yellow", lat: 28.5921, lng: 77.0460 },
  { id: 6, name: "Saket", status: "yellow", lat: 28.5237, lng: 77.2111 },
  { id: 7, name: "Rohini", status: "green", lat: 28.7410, lng: 77.1154 },
  { id: 8, name: "Janakpuri", status: "green", lat: 28.6219, lng: 77.0878 }
];

export default function DelhiLeafletMap() {
  const [selectedZone, setSelectedZone] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const leafletMapRef = useRef(null);
  
  const filteredZones = filterStatus === "all" 
    ? zoneData 
    : zoneData.filter(zone => zone.status === filterStatus);

  // Load Leaflet CSS and JS
  useEffect(() => {
    // Add Leaflet CSS
    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
    document.head.appendChild(linkElement);

    // Add Leaflet JS
    const scriptElement = document.createElement('script');
    scriptElement.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js';
    scriptElement.onload = initMap;
    document.head.appendChild(scriptElement);

    return () => {
      document.head.removeChild(linkElement);
      document.head.removeChild(scriptElement);
    };
  }, []);

  // Initialize map
  const initMap = () => {
    if (!window.L || mapRef.current === null) return;

    // Create map
    const map = window.L.map('leaflet-map').setView([28.6139, 77.2090], 11);
    leafletMapRef.current = map;

    // Add tile layer (OpenStreetMap)
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add markers for each zone
    markersRef.current = zoneData.map(zone => {
      const markerColor = zone.status === "red" ? "#dc2626" : zone.status === "yellow" ? "#eab308" : "#16a34a";
      
      // Create custom icon
      const icon = window.L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: ${markerColor}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white;"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });
      
      // Create marker
      const marker = window.L.marker([zone.lat, zone.lng], { icon }).addTo(map);
      
      // Add popup
      marker.bindPopup(`<b>${zone.name}</b><br>${zone.status.toUpperCase()} Zone`);
      
      // Add click event
      marker.on('click', () => {
        setSelectedZone(zone);
      });
      
      return { marker, zone };
    });

    // Update markers for initial filter
    updateMarkerVisibility(filterStatus);
  };

  // Update marker visibility when filter changes
  const updateMarkerVisibility = (status) => {
    if (!markersRef.current.length) return;
    
    markersRef.current.forEach(({ marker, zone }) => {
      if (status === "all" || zone.status === status) {
        marker.setOpacity(1);
      } else {
        marker.setOpacity(0.2);
      }
    });
  };

  // Effect for filter changes
  useEffect(() => {
    updateMarkerVisibility(filterStatus);
  }, [filterStatus]);

  // When selected zone changes, fly to that location
  useEffect(() => {
    if (selectedZone && leafletMapRef.current) {
      leafletMapRef.current.flyTo([selectedZone.lat, selectedZone.lng], 14, {
        animate: true,
        duration: 1
      });

      // Find and open popup for this marker
      markersRef.current.forEach(({ marker, zone }) => {
        if (zone.id === selectedZone.id) {
          marker.openPopup();
        }
      });
    }
  }, [selectedZone]);

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Delhi Zone Status Map</h1>
        <p className="text-gray-600 mt-2">Visualizing red and yellow zones in Delhi, India</p>
      </header>
      
      <div className="mb-6">
        <div className="flex flex-wrap items-center space-x-2 md:space-x-4 mb-4">
          <span className="font-medium">Filter zones:</span>
          <div className="flex flex-wrap gap-2">
            <button 
              className={`px-4 py-2 rounded-md ${filterStatus === "all" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              onClick={() => setFilterStatus("all")}
            >
              All
            </button>
            <button 
              className={`px-4 py-2 rounded-md ${filterStatus === "red" ? "bg-red-600 text-white" : "bg-gray-200"}`}
              onClick={() => setFilterStatus("red")}
            >
              Red Zones
            </button>
            <button 
              className={`px-4 py-2 rounded-md ${filterStatus === "yellow" ? "bg-yellow-500 text-white" : "bg-gray-200"}`}
              onClick={() => setFilterStatus("yellow")}
            >
              Yellow Zones
            </button>
            <button 
              className={`px-4 py-2 rounded-md ${filterStatus === "green" ? "bg-green-600 text-white" : "bg-gray-200"}`}
              onClick={() => setFilterStatus("green")}
            >
              Green Zones
            </button>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-600 rounded-full mr-2"></div>
            <span>Red Zone (High Risk)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
            <span>Yellow Zone (Moderate Risk)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-600 rounded-full mr-2"></div>
            <span>Green Zone (Low Risk)</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap md:flex-nowrap gap-6">
        {/* Leaflet Map */}
        <div className="w-full md:w-2/3 bg-white rounded-lg shadow-md p-4">
          <div id="leaflet-map" ref={mapRef} className="w-full h-96 rounded-md"></div>
        </div>

        {/* Zone List */}
        <div className="w-full md:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-4 h-96 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Delhi Zones</h2>
            {filteredZones.length === 0 ? (
              <p className="text-gray-500">No zones match your filter.</p>
            ) : (
              <ul className="space-y-2">
                {filteredZones.map(zone => (
                  <li 
                    key={zone.id} 
                    className={`p-3 rounded-md cursor-pointer ${selectedZone?.id === zone.id ? "ring-2 ring-blue-500" : ""}`}
                    style={{ backgroundColor: zone.status === "red" ? "#fee2e2" : zone.status === "yellow" ? "#fef3c7" : "#dcfce7" }}
                    onClick={() => setSelectedZone(zone)}
                  >
                    <div className="flex items-center">
                      <div 
                        className="w-4 h-4 rounded-full mr-2"
                        style={{ backgroundColor: zone.status === "red" ? "#dc2626" : zone.status === "yellow" ? "#eab308" : "#16a34a" }}
                      ></div>
                      <span className="font-medium">{zone.name}</span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      <div>Status: <span className="font-medium capitalize">{zone.status} Zone</span></div>
                      <div className="text-xs">Location: {zone.lat.toFixed(4)}, {zone.lng.toFixed(4)}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Selected Zone Details */}
      {selectedZone && (
        <div className="mt-6 bg-white rounded-lg shadow-md p-4">
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-bold">Zone Details: {selectedZone.name}</h2>
            <button 
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setSelectedZone(null)}
            >
              Close
            </button>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-700">Zone Information</h3>
              <div className="mt-2 space-y-2">
                <div className="flex">
                  <span className="font-medium w-24">ID:</span>
                  <span>{selectedZone.id}</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-24">Name:</span>
                  <span>{selectedZone.name}</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-24">Status:</span>
                  <span className={`capitalize ${selectedZone.status === "red" ? "text-red-600" : selectedZone.status === "yellow" ? "text-yellow-600" : "text-green-600"}`}>
                    {selectedZone.status} Zone
                  </span>
                </div>
                <div className="flex">
                  <span className="font-medium w-24">Location:</span>
                  <span>{selectedZone.lat.toFixed(6)}, {selectedZone.lng.toFixed(6)}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-700">Recommendations</h3>
              <div className="mt-2">
                {selectedZone.status === "red" ? (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-800 font-medium">High Risk Zone</p>
                    <ul className="list-disc pl-5 mt-2 text-sm text-red-700 space-y-1">
                      <li>Avoid non-essential travel to this area</li>
                      <li>Follow strict social distancing measures</li>
                      <li>Always wear protective equipment</li>
                      <li>Monitor symptoms daily if residing in this zone</li>
                    </ul>
                  </div>
                ) : selectedZone.status === "yellow" ? (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-yellow-800 font-medium">Moderate Risk Zone</p>
                    <ul className="list-disc pl-5 mt-2 text-sm text-yellow-700 space-y-1">
                      <li>Limit non-essential travel</li>
                      <li>Maintain social distancing</li>
                      <li>Wear masks in public spaces</li>
                      <li>Follow local health authority guidelines</li>
                    </ul>
                  </div>
                ) : (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-green-800 font-medium">Low Risk Zone</p>
                    <ul className="list-disc pl-5 mt-2 text-sm text-green-700 space-y-1">
                      <li>Follow standard precautions</li>
                      <li>Safe for essential activities</li>
                      <li>Monitor local updates</li>
                      <li>Continue practicing good hygiene</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}