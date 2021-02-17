import {
    mapService
} from './services/map-service.js'

import {gCurrLocation} from './services/map-service.js'

var gMap;

window.onload = () => {
    initMap()
        .then(() => {
            addEventsListeners()
            renderLocs();   
            
            
        })
        // .catch(() => console.log('INIT MAP ERROR'));
}

window.onPanLoc = onPanLoc;
window.onDeleteLoc = onDeleteLoc;


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
    copyLocation()
    addSearchListener()
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
        let location = {lat: loc.lat, lng: loc.lng};
        addMarker(location);
        return `<tr><td class="loc" data-id="${loc.id}" onclick="onPanLoc('${loc.id}')">${loc.name}</td><td><button class="delete-loc-btn" onclick="onDeleteLoc('${loc.id}')">X</button></td></tr>`;
    }).join('');
}

function onPanLoc(id) {
    const loc = mapService.findLocById(id);
    panTo(loc.lat, loc.lng);
    mapService.gCurrLocation = loc;
    // renderPlace(loc);
}

function onDeleteLoc(id) {
    mapService.deleteLoc(id);
    renderLocs()
}

function copyLocation() {
    document.querySelector('.copy-location-btn').addEventListener('click', (ev) => {
        ev.preventDefault()
        console.log('hi');
    });
    // getLocationUrl()
    //     .then (url => console.log(url))
    /* Get the text field */
    // console.log('copyText:', copyText)
    console.log('gCurrLocation:', gCurrLocation)

    // var copyText = `https://dorshaul1.github.io/TravelTip/index.html?lat=${gCurrLocation.lat}&lng=${gCurrLocation.lng}`
    // var copyText = `https://dorshaul1.github.io/TravelTip/index.html?lat=32.073673969248354&lng=34.89802208243409`
    // console.log('copyText:', copyText)

    // /* Select the text field */
    // copyText.select();
    // copyText.setSelectionRange(0, 99999); /* For mobile devices */

    /* Copy the text inside the text field */
    // copyText.execCommand("copy");
    // copyText = navigator.clipboard

    /* Alert the copied text */
    // alert("Copied the text: " + copyText.value);
}

// function panByParameters() {
//     const urlParams = new URLSearchParams(window.location.search);
//     const lat = +urlParams.get('lat')
//     console.log('lat:', lat)
//     const lng = +urlParams.get('lng')
//     console.log('lng:', lng)

//     panTo(lat, lng)
// }

function onSearchLoc(ev) {
    ev.preventDefault();
    const locName = document.querySelector('.search-loc').value;
    mapService.searchLocs(locName)
    .then (loc => {
        console.log(loc);
        panTo(loc.location.lat, loc.location.lng);
        // mapService.getLocWeather(searched.location)
        // .then (res => console.log(res));
    });


}

function addSearchListener() {
    document.querySelector('.search-form').addEventListener('submit', onSearchLoc);
}

// function renderPlace(loc){
//     // loc = mapService.searchLocs(loc)
//     console.log('loc:', loc)
//     document.querySelector('.location').innerText = mapService.searchLocs(loc.name)
//     console.log( mapService.searchLocs(loc.name));
// }

