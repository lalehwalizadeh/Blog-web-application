import methodOverride from "method-override"

import express from "express"
import bodyParser from "body-parser"
import multer from "multer"
import path from "path"
import { dirname } from "path"
import { fileURLToPath } from "url"
import { ok } from "assert"

const directory = dirname(fileURLToPath(import.meta.url))

// Set EJS as the view engine
const app = express()
const PORT = 3000
app.set("view engine", "ejs")

// Using multer to uploading image
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images")
  },
  filename: (req, file, cb) => {
    console.log(file)
    cb(null, Date.now() + path.extname(file.originalname))
  },
})
const upload = multer({ storage: storage })

// middlewares:
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))
// use method-override to use HTTP method instead of GET and POST:
app.use(methodOverride("_method"))

// parse JSON bodies (as sent by html form)
app.use(bodyParser.json())

// setting current date to the footer:
const date = new Date()
const year = date.getFullYear()

// define an Array as database:
let posts = [
  {
    title: "butterfly",
    description: "it is a kind of insect",
    picture: "/images/butterfly.jpg",
    id: 1,
  },
  {
    title: "Dark",
    description: "I feel good in dark environments!",
    picture: "/images/dark.jpg",
    id: 2,
  },
]

// Define routes
app.get("/", (req, res) => {
  res.render("index.ejs", {
    post: posts,
    Year: year,
  })
})

app.get("/new-post", (req, res) => {
  res.render("new-post.ejs", {
    Year: year,
  })
})

// Sending New Post :
app.post("/submit", upload.single("img"), (req, res) => {
  const { title, description } = req.body
  const pic_path = req.file.path
  const imageReplacement = pic_path.replace("public\\", "")

  let newPost = {
    id: posts.length + 1,
    title: title,
    description: description,
    picture: imageReplacement,
  }

  posts.push(newPost)
  res.render("index.ejs", {
    post: posts,
    Year: year,
  })
  console.log(newPost)
})

// Editing Post:
app.get("/edit/:id", upload.single("image"), (req, res) => {
  const postId = parseInt(req.params.id)
  const post = posts.find((p) => p.id === postId)

  if (!post) {
    return res.status(404).send("Post not Found")
  }
  res.render("edit", {
    post: post,
    Year: year,
  })
})

// sending edited post to the home page:
app.put("/update/:id", upload.single("image"), (req, res) => {
  const postId = parseInt(req.params.id)
  const updatedPostIndex = posts.findIndex((p) => p.id == postId)

  const pic_path = req.file.path
  const imageReplacement = pic_path.replace("public\\", "")

  if (updatedPostIndex === -1) {
    return res.status(404).send("post not found")
  }
  let updatedPost = {
    id: postId,
    title: req.body.title,
    description: req.body.description,
    picture: imageReplacement,
  }

  posts[updatedPostIndex] = updatedPost
  res.redirect("/")
})

//Deleting Post:
app.delete("/delete/:id", (req, res) => {
  const postId = parseInt(req.params.id)
  // Get the confirmation status from the request body
  const confirmation = req.body.confirmation

  if (confirmation === "true") {
    // If confirmed, delete the post
    posts = posts.filter((post) => post.id !== postId)
    // res.send("<h1>Post deleted successfully</h1>")

  } else {
    // If not confirmed, send a message indicating deletion was canceled
    res.send("<h1>Deletion canceled</h1>")
  }
  // Redirect to the homepage
  res.redirect("/")
})

// Start the server :
app.listen(PORT, () => {
  console.log("server started on port 3000")
})
