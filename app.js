const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();



app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://sanrsa:rahman417@cluster0.w7dwc.mongodb.net/todolistDB", {useNewUrlparser: true});

const ItemsSchema = {  name: String}


const Item = mongoose.model("Item", ItemsSchema)

const item1 = new Item ({
  name: "ori"
});

const item2 = new Item ({
  name: "fifa"
});

const item3 = new Item ({
  name: "listc"
});

const defaultitems = [item1, item2, item3];

const listSchema = { name: String, items: [ItemsSchema]};

const List = mongoose.model("List", listSchema);


app.get("/", function(req, res) {
 
Item.find({}, function(err, ls){
  if (ls.length === 0) {
    
Item.insertMany(defaultitems, function(err){
  if(err){  console.log("err");}
  else{console.log("success");}
})
res.redirect("/")
  } else {
      res.render("list", {listTitle: "Today", newListItems: ls});
  }

})});
app.get("/:links", function(req, res) {
  const Link = _.capitalize(req.params.links); 

  List.findOne({name: Link},function(err, li) {
    if(!err){
      if(!li){
        const listl = new List ({
    name: Link, 
    items: defaultitems
  
  });
  listl.save();
  res.redirect("/" + Link);
  
  
      }else{
        res.render("list",{listTitle: li.name, newListItems: li.items})
      }
    }
  } )
 
  });


  // app.post("/", function(req, res){

  //   const itemName = req.body.newItem;
  //   const listName = req.body.list;
  
  //   const item = new Item({
  //     name: itemName
  //   });
  
  //   if (listName === "Today"){
  //     item.save();
  //     res.redirect("/");
  //   } else {
  //     List.findOne({name: listName}, function(err, foundList){
  //       foundList.items.push(item);
  //       foundList.save();
  //       res.redirect("/" + listName);
  //     });
  //   }
  // });

app.post("/", function(req, res){

  const newitem = req.body.newItem;
  const newil = req.body.list

  // console.log(newil);

  const item = new Item ({
    name: newitem
  });
  

  if(newil === "Today"){
    item.save();
    res.redirect("/");
  
  } else {
    List.findOne({name: newil},function(err, lin){
  
        lin.items.push(item);
      lin.save();
      res.redirect("/" + newil);
    
    })
  }

});

app.post("/delete", function(req, res){

  const checkboxid = req.body.checkbox;
  const itemd = req.body.listName;
  
  if (itemd === "Today") {
    Item.findByIdAndRemove(checkboxid, function(err){
    if (!err) {
      console.log("successfully deleted ");
       res.redirect("/");
    }
   
  })
  } else { 
    List.findOneAndUpdate({name: itemd}, {$pull: {items: {_id: checkboxid}}}, function(err, foundList){
      if (!err) {
        console.log("successfully deleted another part  ");
         res.redirect("/" + itemd);
      }
     
    })


  
      
    }
  

  

})


app.get("/about", function(req, res){
  res.render("about");
});

let port = process.env.PORT;

if (port == null || port == "") {
  port=3000
}

app.listen(port, function(){
  console.log("you are now running on a server");
});
