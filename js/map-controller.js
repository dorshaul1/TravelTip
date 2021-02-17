import {
    mapService
} from './services/map-service.js'

var gMap;
// console.log('Main!');


mapService.getLocs()
    .then(locs => console.log('locs', locs))

window.onload = () => {
    initMap()
        .then(() => {
            addMarker({
                lat: 32.0749831,
                lng: 34.9120554
            });
        })
        .catch(() => console.log('INIT MAP ERROR'));

    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords);
            // console.log('pos.coords:', pos.coords)
        })
        .catch(err => {
            console.log('err!!!', err);
        })
    addEventsListeners()
}

function initMap(lat = 32.0749831, lng = 34.9120554) {
    // console.log('InitMap');
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
        title: 'Hello World!'
    });
    return marker;
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gMap.panTo(laLatLng);
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    // console.log('Getting Pos');
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
        // console.log('Aha!', ev.target);
        // panTo(35.6895, 139.6917);
        getPosition()
            .then(pos => {
                panTo(pos.coords.latitude, pos.coords.longitude);

                // console.log('pos.coords:', pos.coords)
            })
    })
}

function onClickMap() {
        // let infoWindow = new google.maps.InfoWindow({
        //     content: "Click the map to get Lat/Lng!",
        //     position: myLatlng,
        // });
        // infoWindow.open(map);
    // Configure the click listener.
    console.log('gMap:', gMap)
    gMap.addListener("click", (mapsMouseEvent) => {
        // Close the current InfoWindow.
            // infoWindow.close();
        // Create a new InfoWindow.
            //infoWindow = new google.maps.InfoWindow({
            position: 
            console.log(mapsMouseEvent.latLng)
        });
    //     infoWindow.setContent(
    //         JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
    //     );
    //     infoWindow.open(map);
    // });
}