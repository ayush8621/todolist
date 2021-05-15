const express = require("express");
const bodyparser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const _ = require("lodash")
app.use(bodyparser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
app.set('view engine', 'ejs');
mongoose.connect('mongodb+srv://Admin-Ayush:Ayush2110@cluster0.xa1yn.mongodb.net/todolistDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});



const itemsSchema = new mongoose.Schema({
  name: String
});

const listsSchema = new mongoose.Schema({
  name:String,
  items:[itemsSchema]
})

const Item = mongoose.model('Item', itemsSchema);
const Item2 = mongoose.model('Item2', listsSchema);

const item1 = new Item({
  name: "Welcome to your dolist"
});

const item2 = new Item({
  name: "Hit + to add new item"
});

const item3 = new Item({
  name: "<-- Hit this to delete an item"
});

const defaultitems = [item1, item2, item3];

// var options = {weekday:'long',year:'numeric',month:'long',day:'numeric'};
// let today = new Date();
// let day = today.toLocaleDateString("hi-IN", options);

app.get("/", function(req, res) {
  Item.find({}, function(err, items) {
    if (items.length === 0) {
      Item.insertMany(defaultitems, function(err) {});
      setTimeout(function(){res.redirect("/")},10);
    }
    else {
      res.render("list", {listtitle: "Today",addeditems: items});
    }
  });
});

app.post("/", function(req, res) {
    const item = req.body.inputlist;
    const listname = req.body.list;
    console.log(listname);
    const item5 = new Item({
      name: item
    })
    if(listname === "Today" ){
      item5.save(function(err){
      setTimeout(function(){res.redirect("/")},100);
    });
    }
    else{
      Item2.findOne({name:listname},function(err,founditem){
        founditem.items.push(item5);
        founditem.save(function(err){
          setTimeout(function(){res.redirect("/"+ listname);},100);
        });
      })
    }
  });


app.get("/:anything",function(req,res){
  const anything=_.capitalize(req.params.anything);
  Item2.findOne({name:anything}, function(err,founditem) {
    if(!founditem){
      const item4 = new Item2({
        name:anything,
        items:defaultitems
      });
      item4.save(function(err){
        setTimeout(function(){res.redirect("/"+ anything);},100);
      });

    }
    else{
        res.render("list", {listtitle: founditem.name ,addeditems:founditem.items});
    }
  });
  });


  app.post("/delete",function(req,res){
    const id = req.body.checkbox;
    const listname = req.body.listname;
    if(listname === "Today"){
      Item.findByIdAndRemove(id,function(err){});
      setTimeout(function(){res.redirect("/");},100);
    }
    else{
Item2.findOneAndUpdate({name:listname},{$pull:{items:{_id:id}}},function(err,founditem){
  setTimeout(function(){res.redirect("/"+ listname);},100);
});
    }
  });

  let port = process.env.PORT;
  if (port == null || port == "") {
    port = 3000;
  }

  app.listen(port, function() {
    console.log("Server started succesfully");
  });








// if (req.body.list === "worklist") {
//   let workitem = req.body.inputlist;
//   const item4 = new Item({
//     name: workitem
//   })
//   item4.save();
//   res.redirect("/work");
// } else {






// app.get("/work", function(req, res) {
//   Item2.find({}, function(err, items2) {
//
//       res.render("list", {kindofday: "worklist",addeditems: items2});
//
//   });
// });
