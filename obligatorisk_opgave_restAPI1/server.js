// Disse "require" importere de installerede moduler fra "node_modules"
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const { verifyToken } = require("./validation");
const swaggerUi = require("swagger-ui-express");
const yaml = require("yamljs");

// Importering af routes
const bookRoutes = require("./routes/book");
const authRoutes = require("./routes/auth")

// Opsætning af swagger
const swaggerDefinition = yaml.load('./swagger.yaml');
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDefinition));

require("dotenv-flow").config()

// Parse request af indholds type JSON
app.use(bodyParser.json());

// Metode der etablere forbindelsen til mongoDB - og en error der fortæller hvis fobindelsen ikke etableres

mongoose.set('strictQuery', true);
mongoose.connect(
    process.env.DBHOST,

).catch(error => console.log('Fejl i oprettelse af forbindelse til MongoDB' + error));
mongoose.connection.once('open', () => console.log('Forbindelse til MongoDB er oprettet!'));

//routes

app.get("/api/Velkommen", (req, res) => {
    res.status(200).send({message: "velkommen til MEN RESTful API"})
})

//post, put, delete
app.use("/api/books", verifyToken, bookRoutes);

// Auth med login og oprettelse af bruger
app.use("/api/user", authRoutes);


// Denne const definere porten, og at denne skal hentes fra .env filen. Dertil har jeg givet den en standard port at falde tilbage på,
// hvis der sker en fejl
const PORT = process.env.PORT || 4000;

/* Denne call back funktion definere hvilken port serveren skal lytte med på. Dette bruges til at se, 
hvilken port der bruges og kan ses i konsollen */
/* Den call back funktion er en funktion der sendes afsted som en parameter til en anden funktion, der udføres når den anden funktion 
er færdig med sin opgave. Fx.  her, hvor man ser hvilken port der bruges, efter functionen har defineret porten, udfra den forrige
const værdier */

app.listen(PORT, function() {
    console.log("Server is running on port: " + PORT)
})

module.exports = app;