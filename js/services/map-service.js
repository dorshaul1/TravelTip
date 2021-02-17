import {
    utilService
} from './util-service.js'

export const mapService = {
    getLocs,
    createLocation,
    saveLocs,
}

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
        updateAt
    }
    const locs = getLocs();
    locs.push(location);
    saveLocs(locs);
}

function getLocs() {
    const locs = utilService.loadFromStorage(KEY);
    if (!locs) locs = [];
    return locs;
}

function saveLocs(locs) {
    saveToStorage(KEY, locs);
}