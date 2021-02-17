import {
    mapService
} from './services/map-service.js'

import { utilService } from './services/util-service.js'
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
            addEventsListeners()
        })
        .catch(() => console.log('INIT MAP ERROR'));

    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords);
            // console.log('pos.coords:', pos.coords)
        })
        .catch(err => {
            console.log('err!!!', err);
        });
        console.log('map', gMap);
    addEventsListeners();
}

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
                // console.log('pos.coords:', pos.coords)
            })
    });
}

function onClickMap() {
    gMap.addListener("click", (mapsMouseEvent) => {
        console.log('mapsMouseEvent:', mapsMouseEvent)
        var lat = mapsMouseEvent.latLng.lat()
        // console.log('lat:', lat)
        var lng = mapsMouseEvent.latLng.lng()
        // console.log('lng:', lng)
        panTo(lat,lng)
        addMarker({lat,lng})
        mapService.createLocation(null, lat, lng, null, null)
    });
}