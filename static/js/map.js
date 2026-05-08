/**
 * 1. CONFIGURACIÓN DE LA "CÁMARA"
 * Creamos el mapa. Aunque aquí dice CDMX, el paso 3 hará que el mapa
 * "vuele" automáticamente hacia donde estén tus edificios.
 */
const map = L.map('map').setView([19.4326, -99.1332], 13);

/**
 * 2. EL PISO DEL MAPA (CAPA BASE)
 * Cambiamos a CartoDB Voyager. Es un servidor muy confiable que evita los
 * cuadros grises que viste anteriormente en Edge.
 */
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
}).addTo(map);

/**
 * 3. CARGA DE DATOS (EDIFICIOS)
 * Esta función busca tu archivo y lo dibuja en el mapa.
 */
async function loadGeoData() {
    try {
        // Buscamos el archivo JSON en tu carpeta data
        const response = await fetch('data/Estructuras_mapa1.json');

        // Si el archivo no existe, nos avisa en la consola
        if (!response.ok) throw new Error("No encontré el archivo en la carpeta data/");

        const data = await response.json();

        // Dibujamos el contenido del archivo sobre el mapa
        const geojsonLayer = L.geoJSON(data, {
            // Estilo: Color y grosor de las líneas
            style: function (feature) {
                return {
                    color: "#ff4444", // Rojo para que resalte sobre el mapa
                    weight: 3,        // Grosor de la línea
                    opacity: 0.8,     // Transparencia del borde
                    fillOpacity: 0.4  // Transparencia del relleno
                };
            },
            // Interacción: Qué pasa al hacer clic
            onEachFeature: function (feature, layer) {
                if (feature.properties) {
                    // Creamos el globito de información
                    layer.bindPopup(`
                        <strong>Información del Objeto</strong><br>
                        <b>Capa:</b> ${feature.properties.layer || 'General'}<br>
                        <b>ID:</b> ${feature.properties.fid || 'Sin ID'}
                    `);
                }
            }
        }).addTo(map);

        /**
         * 4. AJUSTE AUTOMÁTICO
         * Esta es la parte más importante: como tus datos están en coordenadas 
         * del océano, esto hace que el mapa se mueva solo hacia allá.
         */
        if (data.features && data.features.length > 0) {
            map.fitBounds(geojsonLayer.getBounds());
        }

    } catch (error) {
        // Si hay un error de red o de nombre de archivo, lo verás aquí
        console.error("Hubo un problema al cargar los edificios:", error);
    }
}

// 5. ¡ARRANCAMOS EL PROCESO!
loadGeoData();