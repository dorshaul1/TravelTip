import {
    utilService
} from './util-service.js'

export const mapService = {
    getLocs,
    createLocation
}
var locs = [{
    lat: 11.22,
    lng: 22.11
}]

var gLocations = []

function getLocs() {
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
    console.log('location:', location)
    gLocations.push(location)
    // console.log(gLocations);
}