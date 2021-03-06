# npm-packagelist
An utility for checking installed Node.js dependencies

Function | Action
------------ | -------------
`ShowAll()` | Shows all installed parent dependencies.
`ShowChildDep(query)` | Prints every available children to an external file.
`FindDep(query)` | Finds the parents using the user's query.
`Uninstall(package)` | Accepts arrays or strings. Uninstalls the package(s).
`Install(package)` | Same as uninstall, but installs the package(s).
`AllDeps()` | Creates a text file with all installed dependencies.

## Installation:
`npm install @huttunenjulius/packagelist`

## Example:

```
//manager.js

const manager = require("@huttunenjulius/packagelist");

manager.ShowAll(); 
manager.ShowChildDep();
manager.FindDep();
manager.Uninstall("");
manager.Install("");
manager.AllDeps();

// Run "node manager" in terminal
```


