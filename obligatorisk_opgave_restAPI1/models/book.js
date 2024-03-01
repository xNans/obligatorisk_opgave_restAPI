const mongoose = require("mongoose");

const Schema = mongoose.Schema;



// Prædefinerede oplysninger og types til bookSchema, referes til fra routes, og de informationer til skal indtastes
let bookSchema = new Schema( {
    title: {type: String},
    author: {type: String},
    release_year: {type: Number},
    bestseller: {type: Boolean}
});

// bookSchema exporteres her til databasen
module.exports = mongoose.model("book", bookSchema);




