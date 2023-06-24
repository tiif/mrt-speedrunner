# mrt-speedrunner

### Environment setup
- install npm
- in the project root directory, run ``npm install`` 
- after the dependencies are installed, run ``npm start``

### Usage guide (WARNING: NOT USABLE RIGHT NOW without server)
- input the mrt station in the form of station code, exp: ``CC23``,``TE8``, ..., 
- click ``update``
- click ``show result``

### Further improvement
- use menu for user to select the mrt station
- try catch possible errors

### Bugs
- some mrt station is not accurate

### Project log (delete in future):
- 2023-05-15: fixed bug of api being called when mounting
- 2023-06-24: add door feature and remote server

future TODO:
- write script to request api key 
- host the whole project and graphq server to vercel
