var express= require("express");
var app=express();
var bodyParser= require("body-parser");
var mongoose=require("mongoose");
var methodOverride= require("method-override");
 // APP Config
 mongoose.connect("mongodb://localhost/restfull_blog_app", { useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify: false });
 app.set("view engine","ejs");
 app.use(bodyParser.urlencoded({extended:true}));
 app.use(express.static("public"));
 app.use(methodOverride("_method"));

 //MONGO CONFIG

 var blogSchema= new mongoose.Schema({
   title:String,
   image:String,
   body:String,
   created:{type:Date, default:Date.now}
 });

 var Blog=mongoose.model("Blog",blogSchema);


// Routes

app.get("/",function(req,res){
 res.redirect("/blogs");
});

 app.get("/blogs",function(req,res){
     Blog.find({},function(err,blogs){
     if(err){
         console.log("error");
     } else{
        res.render("index",{blogs: blogs});
     }
     });
 
 });

 // NEW Route
 app.get("/blogs/new",function(req,res){
 res.render("new");
 });
 // create route
 app.post("/blogs",function(req,res){
 Blog.create(req.body.blog, function(err,newBlog){
 if(err){
   res.render("new");
 }else{
   res.redirect("/blogs");   
 }
 });
 });

 // SHOW route
app.get("/blogs/:id",function(req,res){
  Blog.findById(req.params.id, function(err,foundBlog){
 if(err){
   res.redirect(err);
 } else{
   res.render("show",{blog:foundBlog});
 }
  });
});
// EDIT ROUTE
app.get("/blogs/:id/edit", function(req,res){
 Blog.findById(req.params.id,function(err,foundBlog){
 if(err){
     console.log(err);
 } else{
    res.render("edit.ejs", {blog:foundBlog});
  }
 });
});

// UPDATE ROUTE
app.put("/blogs/:id", function(req,res){
 Blog.foundByIdAndUpdate(req.params.id, req.body.blog,function(err,updatedBlog){
   if(err){
     console.log(err);
   }else{
     res.redirect("/blogs/"+req.params.id);
   }
 })
});

// DELETE ROUTE
app.delete("/blogs/:id",function(req,res){
 Blog.findByIdAndRemove(req.params.id,function(err){
   if(err){
     res.redirect("/blogs");
   }else{
     res.redirect("/blogs");
   }
 })
});



 app.listen("3000",function(req,res){
 console.log("blog app is started");
 });