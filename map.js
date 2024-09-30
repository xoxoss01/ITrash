let map;
let markers = [];

function initMap() {
  // Initialize the map with a default location
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 37.7749, lng: -122.4194 }, // Default location (San Francisco)
    zoom: 12,
  });

  // Load existing trash cans when the map is initialized
  loadTrashCans();

  // Add click event listener to add trash can markers
  map.addListener("click", (e) => {
    placeMarker(e.latLng);
  });
}

// Fetch all trash cans from the server and place them on the map
function loadTrashCans() {
  fetch("/api/trashcans")
    .then(response => response.json())
    .then(data => {
      data.forEach(trashcan => {
        let marker = new google.maps.Marker({
          position: { lat: trashcan.latitude, lng: trashcan.longitude },
          map: map,
        });
        markers.push(marker);
      });
    });
}

// Add a new trash can to the map and save to the server
function addTrashCan() {
  let position = map.getCenter();
  placeMarker(position);
}

function placeMarker(location) {
  let marker = new google.maps.Marker({
    position: location,
    map: map,
  });

  saveMarkerToDB(location.lat(), location.lng());
  markers.push(marker);
}

// Save the new trash can marker to the database via the API
function saveMarkerToDB(lat, lng) {
  fetch("/api/trashcans", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ latitude: lat, longitude: lng }),
  });
}

// Initialize the map when the page loads
window.onload = initMap;