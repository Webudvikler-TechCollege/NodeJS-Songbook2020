const fetch = require('node-fetch');
const express = require('express');
const router = express.Router();

// Alle routes i denne fil får en prepended sti 
// når de bliver importeret i app.js
// Nedenstående route bliver derfor til => "/fetch/list" f.eks.
router.get("/list", async (req, res) => {
    
    try {
        // Fetcher vores API. Bruger async/await til dette og 
        // dermed slipper vi for then problematikken
        const requestToApi = await fetch('https://api.mediehuset.net/songbook/');

        // Tjekker om alt er gået godt - hvis ikke bliver fejlen fanget i 
        // catch scopet nedenunder
        if(! await requestToApi.ok) throw new Error('Forkert svar fra server')
        
        // Kalder svar som json format
        const apiResponse = await requestToApi.json();

        // Afgrænser resultatet til sange
        const songlist = apiResponse.song

        // Hvis man laver explicit return i sin express app
        // er man 100% sikker på at der ikke køres kode efter.
        // Problemet viser sig hvis der er mange forskellige 
        // svar muligheder for en enkelt route (baseret på bruger input eller whatever)
        return res.render('pages/list', {
            title: "Sangliste",
            content: "Her finder du udvalgte lister.",
            songlist
        })

    } catch (error) {
        // Man kan lave seje fejl meddelelser når man bruger try/catch
        console.log("TCL: error", error)

        // Renderer fejl side
        return res.render('pages/error', {
            title: "FEJL: Sangliste",

            // Det her kan godt være farligt i production, 
            // for den kan godt sladre lidt om intern server setup.
            // I production vil man bruge sin egen fejlhåndterings funktion
            content: "Der skete følgende fejl under fetch af listen med sange: " + error.message,
        })
        
    }   
});

module.exports = router;