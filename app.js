exports.showAll = function () {

    //Suoritetaan komento terminaalissa
    const execSync = require('child_process').execSync;
    const data = execSync('npm list --prod --depth=0 --json', { encoding: 'utf-8' })

    //Käännetään data JSON-muotoon
    const package = JSON.parse(data);
    //Selektoidaan riipuvuudet muuttujaan
    const d = package.dependencies;

    //Tulostetaan riippuvuudet versionumeroineen
    for (const key in d) {
        console.log("Dependency name: " + key[0].toUpperCase() + key.slice(1))
        console.log("Version: " + d[key].version + "\n")
    }
}

exports.findDependency = function (query) {

    console.log("Searching with query " + query + "...")

    //Suoritetaan komento terminaalissa
    const execSync = require('child_process').execSync;
    const data = execSync('npm list --prod --depth=0 --json', { encoding: 'utf-8' })
    const package = JSON.parse(data);
    const d = package.dependencies;

    //Jos tyhjä parametri, valitaan kaikki riippuvuudet
    if (!query) {
        query = "";
    }

    let searchArray = [];

    //Lisätään arvoja hakutaulukkoon
    for (const key in d) {
        searchArray.push(key);
    }

    //Filterointi-funktio
    function filterItems(arr, query) {
        return arr.filter(function (el) {
            return el.toLowerCase().indexOf(query.toLowerCase()) !== -1
        })
    }

    //Filterointi suoritetaan hakutaulukkoon
    const filtered = filterItems(searchArray, query);

    if (filtered.length > 1) {
        console.log("Found " + filtered.length + " items: ");
    }
    if (filtered.length === 1) {
        console.log("Found " + filtered.length + " item: ");
    }
    if (filtered.length === 0) {
        console.log("Couldn't find any dependencies with that query! :(")
    }

    //Tulostetaan vastaavien riippuvuuksien nimet
    //TODO: tulostetaan myös versionumerot
    for (const key in filtered) {
        console.log("Dependency name: " + filtered[key][0].toUpperCase() + filtered[key].slice(1) + "\n");
    }

}