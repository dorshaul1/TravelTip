import {
    utilService
} from './util-service.js'

export const mapService = {
    getLocsFromStorage,
    createLocation,
    saveLocsToStorage,
    findLocById,
    deleteLoc,
    // getLocationUrl,
    searchLocs,
    gCurrLocation
}

var gCurrLocation

const KEY = 'locations';
const API_KEY = 'AIzaSyBVQipjJ0ddfwLp8ooqI_wUJEjIogAff5g';

// var locs = [{
//     lat: 11.22,
//     lng: 22.11
// }]


function getSearchedLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs);
        }, 2000)
    });
}

function createLocation(name = null, lat, lng, weather = null, updateAt = null) {
    const location = {
        id: utilService.makeId(4),
        name,
        lat,
        lng,
        weather,
        createdAt: Date.now(),
        updateAt,
    }
    const locs = getLocsFromStorage();
    locs.push(location);
    saveLocsToStorage(locs);
}

function getLocsFromStorage() {
    let locs = utilService.loadFromStorage(KEY);
    if (!locs) locs = [];
    return locs;
}

function saveLocsToStorage(locs) {
    utilService.saveToStorage(KEY, locs);
}

function findLocById(id) {
    const locs = getLocsFromStorage(KEY);
    if (!locs) return;
    return locs.find(loc => loc.id === id);
}

function deleteLoc(id) {
    const locs = getLocsFromStorage(KEY);
    if (!locs) return;
    locs.splice(locs.findIndex(loc => loc.id === id), 1)
    saveLocsToStorage(locs)
}

// function getLocationUrl(){
//     console.log('hi')
//     return axios.get (`http://127.0.0.1:5502/index.html?lat=${gCurrLocation.lat} &lng=${gCurrLocation.lng} `)
// }

function searchLocs(searchedStr) {
    const searchedLoc = searchedStr.split(' ').join('+');
    console.log(searchedLoc);
    let loc = utilService.loadFromStorage(searchedStr);
    if (loc) return Promise.resolve(loc);

    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${searchedLoc}&key=${API_KEY}`)
        .then(res => {

            console.log(res);
            loc = res.data.results[0]
            utilService.saveToStorage(searchedStr, loc);
            return {name: loc.formatted_address, location: loc.geometry.location}
        });
}
