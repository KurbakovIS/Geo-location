mapboxgl.accessToken = 'pk.eyJ1Ijoia3Jlb25zZXIiLCJhIjoiY2s2NXIwcGxsMDE3bzNsbXV3dnBrc2VmdCJ9.LQyiTGgTzP6V_kWyR6KBTg';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    zoom: 9,
    center: [37.358454, 55.602138]
});

async function getStores() {
    const res = await fetch('/api/v1/stores');
    const data = await res.json();

    const stores = data.data.map(store => {
        return {
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [store.location.coordinates[0], store.location.coordinates[1]]
            },
            'properties': {
                'storeId': store.storeId,
                'icon': 'shop'
            }
        }
    });
    loadMap(stores)
}

function loadMap(stores) {
    map.on('load', function () {
        map.addSource('point', {
            'type': 'geojson',
            'data': {
                'type': 'FeatureCollection',
                features: stores,
                // 'features': [
                //     {
                //         'type': 'Feature',
                //         'geometry': {
                //             'type': 'Point',
                //             'coordinates': [37.358454, 55.602138]
                //         },
                //         'properties': {
                //             'storeId': '0004',
                //             'icon': 'shop'
                //         }
                //     }
                // ]
            }
        });
        map.addLayer({
            'id': 'points',
            'type': 'symbol',
            'source': 'point',
            'layout': {
                'icon-image': '{icon}-15',
                'icon-size': 1.5,
                'text-field': '{storeId}',
                'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                'text-offset': [0, 0.9],
                'text-anchor': 'top'
            }
        });
    });
}

getStores();
