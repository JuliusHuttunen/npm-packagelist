exports.showAll = function () {

    const execSync = require('child_process').execSync;
    const data = execSync('npm list --prod --depth=0 --json', { encoding: 'utf-8' })
    const package = JSON.parse(data);
    const d = package.dependencies;

    for (const key in d) {
        console.log("Dependency name: " + key[0].toUpperCase() + key.slice(1))
        console.log("Version: " + d[key].version + "\n")
    }
}

exports.findDependency = function (query) {

    const execSync = require('child_process').execSync;
    const data = execSync('npm list --prod --depth=0 --json', { encoding: 'utf-8' })
    const package = JSON.parse(data);
    const d = package.dependencies;

    let searchArray = [];

    for (const key in d) {
        searchArray.push(key);
        searchArray.push(d[key]);
    }

    function filterItems(arr, query) {
        return arr.filter(function (el) {
            return el.toLowerCase().indexOf(query.toLowerCase()) !== -1
        })
    }

    console.log(filterItems(searchArray, query));
}