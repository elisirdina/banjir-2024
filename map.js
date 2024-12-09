// Initialize Leaflet map
const map = L.map('map').setView([4.2105, 101.9758], 6);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Load GeoJSON files and PPS data
Promise.all([
    fetch('https://infobencanajkmv2.jkm.gov.my/assets/data/malaysia/arcgis_district_semenanjung.geojson').then(res => res.json()),
    fetch('https://infobencanajkmv2.jkm.gov.my/assets/data/malaysia/arcgis_district_borneo.geojson').then(res => res.json()),
    fetch('https://infobencanajkmv2.jkm.gov.my/api/pusat-buka.php?a=0&b=0').then(res => res.json())
]).then(([semenanjungGeoJson, borneoGeoJson, ppsData]) => {
    // Combine GeoJSON data
    const malaysiaGeoJson = {
        type: "FeatureCollection",
        features: [...semenanjungGeoJson.features, ...borneoGeoJson.features]
    };

    // Add districts to the map
    L.geoJSON(malaysiaGeoJson, {
        style: { color: "#007bff", weight: 1, fillOpacity: 0.1 }
    }).addTo(map);

    // Add PPS markers to the map
    ppsData.forEach(pps => {
        const lat = parseFloat(pps.latitude);
        const lng = parseFloat(pps.longitude);

        if (!isNaN(lat) && !isNaN(lng)) {
            L.marker([lat, lng])
                .addTo(map)
                .bindPopup(`
                    <strong>${pps.nama_pusat}</strong><br>
                    <strong>Negeri:</strong> ${pps.negeri}<br>
                    <strong>Jumlah Mangsa:</strong> ${pps.jumlah_mangsa}<br>
                    <strong>Jumlah Keluarga:</strong> ${pps.jumlah_keluarga}
                `);
        }
    });
}).catch(error => console.error("Error loading map data:", error));
