const router = require("express").Router();
const book = require("../models/book");
const { verifyToken } = require("../validation");

// HTTP CRUD metoder

// /api/oroducts
// Create - Post. Opretter en bog i databasen
router.post("/", verifyToken, (req, res) =>  {

    // laver en data rquest
    data = req.body;

// Henter data fra book, insertMany bruges for at kunne sende mere data af gangen
    book.insertMany(data)
    // Kommer der korrekt responds i form af data, vises dette i applikationen
    .then(data => {res.send(data); })
    // Kommer der err i form af ingen data, vises status 500 err besked
    .catch(err => {res.status(500).send( { message: err.message }); })
}); 


// Read - Get. Indhenter info omkring bøger i databasen

router.get("/", (req, res) =>  {

    data = req.body;

    book.find()
    .then(data => {res.send(data); })
    .catch(err => {res.status(500).send( { message: err.message }); })
}); 


// Se alle bestsellers

router.get("/bestseller", (req, res) =>  {
    book.find({ bestseller: true })
    .then(data => {
        res.send(data); 
    })
    .catch(err => {res.status(500).send( { message: err.message }); })
}); 

// Indhenter info omkring en specifik bog i databasen

router.get("/:id", (req, res) =>  {

    data = req.body;

    book.findById(req.params.id)
    .then(data => {res.send(data); })
    .catch(err => {res.status(500).send( { message: err.message }); })
}); 




// Update - Put. Opdatere informationer om en specifik bog i databasen

router.put("/:id", (req, res) =>  {

    const id = req.params.id;

    book.findByIdAndUpdate(id, req.body)
    .then(data => {
    if (!data){
        res.status(404).send({ "Mislykket opdatering af bog med id, tjek om id er korrekt:": + id })
    }
    else{
        res.send({ message: "Bogen er opdateret!" })
    }
    
    })
    .catch(err => {res.status(500).send( { message: "Mislykket opdatering af bogen med id:" + id }); })
}); 



// Delete. Sletter en specifik bog i databasen

router.delete("/:id", (req, res) =>  {

    const id = req.params.id;

    book.findByIdAndDelete(id)
    .then(data => {
    if (!data){
        res.status(404).send({ "Det mislykkedes at slette bogen med id:": + id })
    }
    else{
        res.send({ message: "Bogen er slettet!" })
    }
    
    })
    .catch(err => {res.status(500).send( { message: "Det mislykkedes at slette bogen med id:" + id }); })
}); 

module.exports = router;