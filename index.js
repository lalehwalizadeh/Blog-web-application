import express from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const directory = dirname(fileURLToPath(import.meta.url));

// Set EJS as the view engine
const app = express();
const PORT = 3000;
app.set('view engine', 'ejs');

// Using multer to uploading image
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, './public/images');
	},
	filename: (req, file, cb) => {
		console.log(file);
		cb(null,file.fieldname,+'-'+ Date.now() + path.extname(file.originalname));
	},
});
const upload = multer({ storage });

// middlewares:
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// parse JSON bodies (as sent by html form)
app.use(bodyParser.json());

// setting current date to the footer:
const date = new Date();
const year = date.getFullYear();

// define an Array as database:
let posts = [
	{
		title: 'butterfly',
		description: 'it is a kinds of insects',
		picture: '/images/butterfly.jpg',
		id: 1,
	},
	{
		title: 'butterfly',
		description: 'it is a kinds of insects',
		picture: '/images/butterfly.jpg',
		id: 2,
	},
];

// Define routes
app.get('/', (req, res) => {
	res.render('index.ejs', {
		post: posts,
		Year: year,
	});
});

app.get('/new-post', (req, res) => {
	res.render('new-post.ejs', {
		Year: year,
	});
});

// Sending New Post :
app.post('/submit', upload.single('img'), (req, res) => {
	const { title, description, picture } = req.body;

	let newPost = {
		id: posts.length + 1,
		title: title,
		description: description,
		picture: picture,
	};
	posts.push(newPost);
	res.render('index.ejs', {
		post: posts,
		Year: year,
	});
	console.log(newPost);
});

// Editing Post:
app.get('/edit/:id', (req, res) => {
	const postId = parseInt(req.params.id);
	const post = posts.find((p) => p.id === postId);

	res.render('edit', {
		post: post,
		Year: year,
	});
});

// sending edited post to the home page:
app.post('/edit/:id',upload.single('image') ,(req, res) => {
	const postId = parseInt(req.params.id);
	const updatedPostIndex = posts.findIndex((p) => p.id === postId);
	
	if (updatedPostIndex === -1) {
		return res.status(404).send('post not found')
	}
	let updatedPost = {
        id: postId,
        title: req.body.title,
        description: req.body.description,
	};
	
	posts[updatedPostIndex] = updatedPost;
    res.redirect('/');
});

//Deleting Post:
app.post('/delete/:id', (req, res) => {
	const postId = parseInt(req.params.id);
	posts = posts.filter((post) => post.id !== postId);
	res.redirect('/');
});

// Start the server :
app.listen(PORT, () => {
	console.log('server started on port 3000');
});
