  const expressSanitizer = require("express-sanitizer");
        methodOverride   = require("method-override"),
        bodyParser       = require("body-parser"),
        mongoose         = require("mongoose"),
        express          = require("express"),
        app              = express();

//Configuration
mongoose.connect('mongodb://localhost/restful_blog_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

const blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {
    type: Date, default: Date.now
  }
});

const Blog = mongoose.model("Blog", blogSchema);

//Blog.create({
  //title: "Test Blog",
  //image: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
  //body: "This is a blog post",
//});

//RESTFULL ROUTES
app.get("/", (req, res) =>{
    res.redirect("/blogs");
});

   //Index Route
app.get("/blogs", (req, res) =>{
  Blog.find({},(err, blogs) =>{
    if(err){
      console.log("Error!");
    }else{
      res.render("index",{blogs: blogs});
    }
  });
});

  //New Route
app.get("/blogs/new", (req, res) =>{
    res.render("new");
});

  //Create Route
app.post("/blogs", (req, res) =>{

  //sanitize body text area
  req.body.blog.body = req.sanitize(req.body.blog.body);

  Blog.create(req.body.blog,(err, blogs) =>{
    if(err){
      console.log("Error!");
    }else{
      res.redirect("/blogs");
    }
  });
});

  //Show Route
app.get("/blogs/:id",(req, res)=>{
  Blog.findById(req.params.id,(err, foundBlog)=>{
    if(err){
      res.redirect("/blogs");
    }else{
      res.render("show", {blog: foundBlog})
    }
  });
});

  //Edit Route
app.get("/blogs/:id/edit",(req, res)=>{
  Blog.findById(req.params.id,(err, foundBlog)=>{
    if(err){
      res.redirect("/blogs");
    }else{
      res.render("edit", {blog: foundBlog})
    }
  });
});

  //Uptade Route
app.put("/blogs/:id",(req, res)=>{

  //sanitize body text area
  req.body.blog.body = req.sanitize(req.body.blog.body);

  Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, UptadeBlog)=>{
    if(err){
        res.redirect("/blogs");
    }else{
        res.redirect("/blogs/"+ req.params.id);
    }
  });
});

//Delete Rout
app.delete("/blogs/:id",(req, res)=>{
  Blog.findByIdAndRemove(req.params.id,(err)=>{
    if(err){
      res.redirect("/blogs");
      alert("An error has ocurred");
    }else{
      res.redirect("/blogs");
    }
  })
});

//Start server
app.listen(3000, ()=>{
  console.log("Server is running");
});
