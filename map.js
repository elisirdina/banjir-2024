// Initialize Leaflet map
const map = L.map('map').setView([4.2105, 101.9758], 6); // Centered on Malaysia

// Add base layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Load GeoJSON files for Peninsular Malaysia and Borneo
Promise.all([
    fetch('https://infobencanajkmv2.jkm.gov.my/assets/data/malaysia/arcgis_district_semenanjung.geojson').then(res => res.json()),
    fetch('https://infobencanajkmv2.jkm.gov.my/assets/data/malaysia/arcgis_district_borneo.geojson').then(res => res.json()),
    fetch('https://infobencanajkmv2.jkm.gov.my/api/pusat-buka.php?a=0&b=0').then(res => res.json()) // Fetch PPS data
]).then(([semenanjungGeoJson, borneoGeoJson, ppsData]) => {
    // Combine GeoJSON data
    const malaysiaGeoJson = {
        type: "FeatureCollection",
        features: [...semenanjungGeoJson.features, ...borneoGeoJson.features]
    };

    // Add GeoJSON layer to map
    L.geoJSON(malaysiaGeoJson, {
        style: {
            color: "#007BFF",
            weight: 1,
            fillOpacity: 0.1
        }
    }).addTo(map);

    // Add PPS data as markers
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
}).catch(error => {
    console.error("Error loading data:", error);
});
