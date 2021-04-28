const manager = require("./app");

manager.ShowAll(); //Näytä ylimmän tason riippuvuudet
manager.ShowChildDep(); //Näytä alemman tason riippuvuudet (voidaan hakea myös tietyllä parametrillä)
manager.FindDep(); //Etsi tiettyä riippuvuutta (ylin taso)
manager.Uninstall(""); //Poista asennus (voi olla myös array)
manager.Install(""); //Asennus (voi olla myös array)
manager.AllDeps(); //Tulosta kaikki projektin riippuvuudet ulkoiseen tekstitiedostoon