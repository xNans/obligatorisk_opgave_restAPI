const router = require("express").Router();
const User = require("../models/user");
//Skide smart! require validation blev selv oprettet da jeg brugte funktionen i min kode 
const { registerValidation, loginValidation } = require("../validation");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


// Route der håndtere registrering 

// Der er brugt async, i tilfældet at forespørgslen har ventetid

router.post("/register", async (req, res) => {

    // Validering af bruger inputs fra Schema i user.js. Her bruges et ekstra "bibliotek" joi (npm install joi) bruges til at hjælpe med validering
    const { error } = registerValidation(req.body)

    if ( error ) {
        return res.status(400).json({ error: error.details[0].message })
    } 

    // Tjekker om e-mailen allerede er registreret
    const emailExists = await User.findOne({ email: req.body.email });

    if(emailExists) {
        return res.status(400).json({ error: "Denne email er allerede i brug" });
    }

    // Hashing af password, brugen af salt gør hashing af kodeordet mere komplekst og gør et evt. angreb mere tidskrævende
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);

    // Oprettelse af bruger object og gemmes i mongodb
    const userObject = new User({
        userName: req.body.userName,
        email: req.body.email,
        password
    });

    try{
        const savedUser = await userObject.save();
        res.json({ error: null, data: savedUser._id });

    } catch (error) {
            res.status(400).json({ error })
    }

    
})

// Route der håndtere login

router.post("/login", async (req, res) => {
    
    // validere om bruger info er gyldig.body indeholder informationer om email og password. 
    const { error } = loginValidation(req.body);
    if(error) {
        return res.status(400).json({ error: error.details[0].message })
    }

    // Hvis login er gyldig, skal brugeren findes i applikationen - findes på emailen
    const user = await User.findOne({ email: req.body.email });

    // Hvis ikke emailen eksistere, fortælles det igennem følgende fejlbesked
    if(!user) {
        return res.status(400).json({ error: "Der er ingen bruger på denne email. Tjek efter om du har skrevet din email korrekt." })
    }

    // Tjekker om kodeordet er korrekt
    const validPassword = await bcrypt.compare(req.body.password, user.password)
     
    // fejl besked ved forkert kodeord
    if(!validPassword) {
        return res.status(400).json({ error: "Forkert kodeord." })
    }

    // Følgende opretter en authentication token med brugernavn og id. til at oprette denne token har jeg brugt json web token
    const token = jwt.sign ({
        userName: User.userName,
        id: user._id
    },
    // Token secret
    process.env.TOKEN_SECRET,
 
     // Udløbstid
    { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    // Vedhæfter authentication token til headeren
    res.header("auth-token", token).json({
        error: null,
        data: {token}
    })
})

module.exports = router;