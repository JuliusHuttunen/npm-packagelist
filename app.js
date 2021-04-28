const fs = require('fs');

exports.ShowAll = function () {

    console.log("Installed dependencies: \n");

    //Suoritetaan komento terminaalissa
    const execSync = require('child_process').execSync;
    const data = execSync('npm list --prod --depth=0 --json', { encoding: 'utf-8' })

    //Käännetään data JSON-muotoon
    const package = JSON.parse(data);
    //Selektoidaan riipuvuudet muuttujaan
    const d = package.dependencies;

    //Tulostetaan riippuvuudet versionumeroineen
    for (const key in d) {
        console.log("Dependency name: " + key[0].toUpperCase() + key.slice(1));
        console.log("Version: " + d[key].version + "\n");
    }
}

exports.FindDep = function (query) {

    console.log("Searching with query " + query + "...\n");

    //Suoritetaan komento terminaalissa
    const execSync = require('child_process').execSync;
    const data = execSync('npm list --prod --depth=0 --json', { encoding: 'utf-8' });
    const package = JSON.parse(data);
    const d = package.dependencies;

    //Jos tyhjä parametri, valitaan kaikki riippuvuudet
    if (!query) {
        query = "";
    }

    let searchArray = [];

    //Lisätään arvoja hakutaulukkoon
    for (const key in d) {
        searchArray.push({ key: key, version: d[key].version });
    }

    //Filterointi-funktio
    function filterItems(arr, query) {
        return arr.filter(function (el) {
            return el.key.toLowerCase().indexOf(query.toLowerCase()) !== -1
        })
    }

    //Filterointi suoritetaan hakutaulukkoon
    const filtered = filterItems(searchArray, query);

    if (filtered.length > 1) {
        console.log("Found " + filtered.length + " items: \n");
    }
    if (filtered.length === 1) {
        console.log("Found " + filtered.length + " item: \n");
    }
    if (filtered.length === 0) {
        console.log("Couldn't find any dependencies with that query! :(\n");
    }

    //Tulostetaan vastaavien riippuvuuksien nimet
    for (const key in filtered) {
        console.log("Dependency name: " + filtered[key].key[0].toUpperCase() + filtered[key].key.slice(1));
        console.log("Version: " + filtered[key].version + "\n");
    }
}

exports.ShowChildDep = function (query) {

    console.log("Searching with query " + query + "...\n");

    //Suoritetaan komento terminaalissa
    const execSync = require('child_process').execSync;
    const data = execSync('npm list --prod --depth=1 --json', { encoding: 'utf-8' });
    const package = JSON.parse(data);
    const d = package.dependencies;

    //Jos tyhjä parametri, valitaan kaikki riippuvuudet
    if (!query) {
        query = "";
    }

    //Nollataan lokitiedosto
    fs.writeFileSync("./mydeps.txt", "INSTALLED CHILD DEPENDENCIES: \n-------------------------------------------");

    let searchArray = [];

    //Lisätään arvoja hakutaulukkoon
    for (const key in d) {
        searchArray.push({ key: key, version: d[key].version, d: d[key].dependencies });
    }

    //Filterointi
    function filterItems(arr, query) {
        return arr.filter(function (el) {
            return el.key.toLowerCase().indexOf(query.toLowerCase()) !== -1
        })
    }

    const filtered = filterItems(searchArray, query);

    if (filtered.length === 0) {
        console.log("Couldn't find any dependencies with that query! :(");
    }

    let isDepArray = false;

    //Käydään läpi filteroitu taulukko...
    for (const key in filtered) {
        let depArray = [];
        i = 0;
        //Lisätään arvoja riippuvuustaulukkoon
        if (filtered[key].d != undefined) {
            depArray.push(filtered[key].d);
        }
        //Jos riippuvuustaulukossa on objekteja, niin tulostetaan ne
        if (depArray.length > 0) {
            isDepArray = true;
            fs.writeFileSync("mydeps.txt", "Dependency " + filtered[key].key[0].toUpperCase() + filtered[key].key.slice(1) +
                " (version " + filtered[key].version + ") has the following child dependencies: \n\n", {
                encoding: "utf8",
                flag: "a+",
                mode: 0o666
            });
        }
        //Riippuvuudet kirjoitetaan erilliseen txt-tiedostoon
        for (const key in depArray[0]) {
            i++;
            fs.writeFileSync("mydeps.txt", i + ". Child dependency name: " + key[0].toUpperCase() + key.slice(1) + "\n", {
                encoding: "utf8",
                flag: "a+",
                mode: 0o666
            });
            fs.writeFileSync("mydeps.txt", "   Version: " + depArray[0][key].version + "\n", {
                encoding: "utf8",
                flag: "a+",
                mode: 0o666
            });
        }
    }

    //Jos riippuvuustaulukko on tyhjä, annetaan ilmoitus
    if (!isDepArray && filtered.length === 0) {
        console.log("Couldn't find any child dependencies with that query! :(");
    }
    else if (!isDepArray && filtered.length > 1) {
        console.log("Found " + filtered.length + " items with no child dependencies... ");
    }
    else if (!isDepArray && filtered.length === 1) {
        console.log("Found " + filtered.length + " item with no child dependencies... ");
    }
    console.log("The file mydeps.txt was created!\n");
}

exports.Uninstall = function (package) {

    let packageArr = [];

    //Jos parametri ei ole array:
    if (!Array.isArray(package)) {
        packageArr.push(package);
    }

    //Jos parametri on array:
    if (Array.isArray(package)) {
        for (key in package) {
            packageArr.push(package[key]);
        }
    }

    //Riippuvuuksien poisto
    for (key in packageArr) {
        console.log("Uninstalling " + packageArr[key] + "... \n")
        const execSync = require('child_process').execSync;
        execSync('npm uninstall ' + packageArr[key].toLowerCase(), { encoding: 'utf-8' });
        console.log("Uninstallation of the package " + packageArr[key] + " was successful!\n");
    }
}

exports.Install = function (package) {

    let packageArr = [];

    //Jos parametri ei ole array:
    if (!Array.isArray(package)) {
        packageArr.push(package);
    }

    //Jos parametri on array:
    if (Array.isArray(package)) {
        for (key in package) {
            packageArr.push(package[key]);
        }
    }

    //Riippuvuuksien asennus
    for (key in packageArr) {
        console.log("Installing " + packageArr[key] + "... \n")
        const execSync = require('child_process').execSync;
        execSync('npm install ' + packageArr[key].toLowerCase(), { encoding: 'utf-8' });
        console.log("Installation of the package " + packageArr[key] + " was successful!\n");
    }
}

exports.AllDeps = function () {

    console.log("Printing every installed dependency on the text file all.txt...\n");

    //Suoritetaan komento terminaalissa
    const execSync = require('child_process').execSync;
    const data = execSync('npm list --prod --depth=1 --json', { encoding: 'utf-8' });
    const package = JSON.parse(data);
    const d = package.dependencies;

    //Nollataan lokitiedosto
    fs.writeFileSync("./all.txt", "INSTALLED DEPENDENCIES: \n-------------------------------------------");

    let isDepArray = false;

    //Käydään läpi taulukko...
    for (const key in d) {
        let depArray = [];
        i = 0;

        //Kirjoitetaan korkeatasoiset riippuuvudet tiedostoon
        fs.writeFileSync("./all.txt", "\nDependency name: " + key[0].toUpperCase() + key.slice(1) + "\n",
            {
                encoding: "utf8",
                flag: "a+",
                mode: 0o666
            });
        fs.writeFileSync("./all.txt", "Version: " + d[key].version + "\n",
            {
                encoding: "utf8",
                flag: "a+",
                mode: 0o666
            });

        //Lisätään arvoja riippuvuustaulukkoon
        if (d[key].dependencies != undefined) {
            depArray.push(d[key].dependencies);
        }
        //Jos lapsiriippuvuuksia on:
        if (depArray.length > 0) {
            isDepArray = true;
            fs.writeFileSync("./all.txt", "\nDependency " + key[0].toUpperCase() + key.slice(1) + " has the following child dependencies: \n\n", {
                encoding: "utf8",
                flag: "a+",
                mode: 0o666
            });
            //Riippuvuudet kirjoitetaan erilliseen txt-tiedostoon
            for (const key in depArray[0]) {
                i++;
                fs.writeFileSync("./all.txt", i + ". Child dependency name: " + key[0].toUpperCase() + key.slice(1) + "\n", {
                    encoding: "utf8",
                    flag: "a+",
                    mode: 0o666
                });
                //Versionumerot
                fs.writeFileSync("./all.txt", "   Version: " + depArray[0][key].version + "\n", {
                    encoding: "utf8",
                    flag: "a+",
                    mode: 0o666
                });
            }
        }
    }

    //Jos riippuvuustaulukko on tyhjä, annetaan ilmoitus
    if (!isDepArray && d === undefined) {
        console.log("You don't have any dependencies installed.\n");
    }
    console.log("All.txt was created! \n");
}