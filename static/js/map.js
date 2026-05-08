// Configuración inicial del mapa
const map = L.map('map').setView([19.4326, -99.1332], 13);

// Capa base de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

/**
 * Función para cargar y mostrar el GeoJSON
 */
async function loadGeoData() {
    try {
        const response = await fetch('data/Estructuras_mapa.geojson');
        if (!response.ok) throw new Error("No se pudo cargar el archivo");

        const data = await response.json();

        const geojsonLayer = L.geoJSON(data, {
            style: function (feature) {
                return {
                    color: "#3388ff",
                    weight: 2,
                    opacity: 0.7
                };
            },
            onEachFeature: function (feature, layer) {
                // Si el geojson tiene propiedades, las mostramos en un popup
                if (feature.properties) {
                    layer.bindPopup(`<b>Capa:</b> ${feature.properties.layer || 'Sin nombre'}`);
                }
            }
        }).addTo(map);

        // Ajustar el zoom automáticamente a los datos
        map.fitBounds(geojsonLayer.getBounds());

    } catch (error) {
        console.error("Error al cargar el mapa:", error);
    }
}

// Ejecutar la carga
loadGeoData();