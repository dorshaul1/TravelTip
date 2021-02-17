import {
    utilService
} from './util-service.js'

export const mapService = {
    getLocsFromStorage,
    createLocation,
    saveLocsToStorage,
    findLocById,
    deleteLoc,
    getLocationUrl,
    gCurrLocation
}

var gCurrLocation

const KEY = 'locations';

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

function getLocationUrl(){
    // axios.get (`http://127.0.0.1:5502/index.html?lat=${} &lng=7.63`)
}
