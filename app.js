const express = require('express');
const app = express();
const path = require('path');

const {v4:uuid} = require('uuid');
const methodOverride = require("method-override");



let quotes = require("./quotes");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));

// Home route
app.get("/",(req,res)=>{
    res.redirect("/quotes");
});

// Routes Setup 
// 1. Show all quotes — /quotes
app.get("/quotes",(req,res)=>{
    res.render("home",{quotes});
});

// 2. Form to create new quote — /quotes/new
app.get("/quotes/new",(req,res)=>{
    res.render("new");
})

// 3. Create quote (POST) — /quotes
app.post("/quotes",(req,res)=>{
    const {author , text} = req.body;
    const newQuote = {id : uuid(), author , text};
    quotes.push(newQuote);
    res.redirect("/quotes");
});

// 4. Show individual quote — /quotes/:id
app.get("/quotes/:id",(req,res)=>{
    const {id} = req.params;
    const found = quotes.find(q=> q.id === id);
    res.render("show",{quote: found});
});

// 5. Edit form — /quotes/:id/edit
app.get("/quotes/:id/edit",(req,res)=>{
    const {id} = req.params;
    const quote = quotes.find(q=>q.id===id);
    res.render("edit",{quote});
});

// 6. Update quote — PATCH /quotes/:id
app.patch("/quotes/:id",(req,res)=>{
    const {id} = req.params;
    const {author,text} = req.body;
    const quote = quotes.find(q=> q.id === id);
    quote.author = author;
    quote.text = text;
    res.redirect("/quotes");
});

// 7. Delete quote — DELETE /quotes/:id
app.delete("/quotes/:id",(req,res)=>{
    quotes = quotes.filter(q=>q.id!==req.params.id);
    res.redirect("/quotes");
});

// app.listen(3000, () => {
//     console.log("Server is running on port 3000 🚀");
// }); 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
