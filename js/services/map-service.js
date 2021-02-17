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
<<<<<<< HEAD
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
=======
    console.log('location:', location)
    gLocations.push(location)
    // console.log(gLocations);
>>>>>>> 87738cc4999aa429d0f409bb3ec23b96d5b35462
}