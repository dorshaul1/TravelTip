import {
    mapService
} from './services/map-service.js'

var gMap;
// console.log('Main!');


// mapService.getLocs()
//     .then(locs => console.log('locs', locs))

window.onload = () => {
    initMap()
        .then(() => {
            addEventsListeners()
        })
        .catch(() => console.log('INIT MAP ERROR'));
        renderLocs();
}

window.onPanLoc = onPanLoc;


function initMap(lat = 32.0749831, lng = 34.9120554) {
    return _connectGoogleApi()
        .then(() => {
            console.log('google available');
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: {
                    lat,
                    lng
                },
                zoom: 15
            })
            console.log('Map!', gMap);
        })
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!',
        animation: google.maps.Animation.DROP,
    });
    return marker;
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gMap.panTo(laLatLng);
}

function getPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 'AIzaSyBVQipjJ0ddfwLp8ooqI_wUJEjIogAff5g';
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}

function addEventsListeners() {
    onGetCurrPosition()
    onClickMap()
}

function onGetCurrPosition() {
    document.querySelector('.my-location-btn').addEventListener('click', (ev) => {
        getPosition()
            .then(pos => {
                panTo(pos.coords.latitude, pos.coords.longitude);
            })
    })
}

function onClickMap() {
    gMap.addListener("click", (mapsMouseEvent) => {
        var lat = mapsMouseEvent.latLng.lat()
        var lng = mapsMouseEvent.latLng.lng()
        panTo(lat, lng)
        createInfoWindow({
            lat,
            lng
        })
    });
}

function createInfoWindow(pos) {
    const infowindow = new google.maps.InfoWindow({
        content: '',
    });
    const marker = addMarker(pos)
    infowindow.setContent(`
    <div class="infoWindow-container flex column">
    <input class="locationInput" type="text" placeholder="Location Name">
    <button class="save-loc-btn">Save Location</butttn>
    </div>
    `)
    infowindow.open(gMap, marker);

    marker.addListener("click", () => {
        infowindow.close(gMap, marker);
    });

    setTimeout(() => {
        document.querySelector('.save-loc-btn').addEventListener('click', (ev) => {
            let elInput = document.querySelector('.locationInput')
            mapService.createLocation(elInput.value, pos.lat, pos.lng)
            infowindow.close(gMap, marker);
            renderLocs();
        })
    }, 100)
}


function renderLocs() {
    const locs = mapService.getLocsFromStorage();
    document.querySelector('.locs-table').innerHTML = locs.map(loc => {
        // addMarker({})
        return `<tr onclick="onPanLoc('${loc.id}')"><td class="loc" data-id="${loc.id}">${loc.name}</td><td>X</td></tr>`;
    }).join('');
}

function onPanLoc(id) {
    const loc = mapService.findLocById(id);
    panTo(loc.lat, loc.lng);
}
