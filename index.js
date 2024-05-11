import methodOverride from 'method-override';
import express from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;

const directory = dirname(fileURLToPath(import.meta.url));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// middleware:
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// use method-override to use HTTP method instead of GET and POST:
app.use(methodOverride('_method'));

// parse JSON bodies (as sent by html form)
app.use(bodyParser.json());

// Using multer to uploading image
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'public/images/');
	},
	filename: (req, file, cb) => {
		console.log(file);
		cb(null, Date.now() + path.extname(file.originalname));
	},
});
const upload = multer({ storage: storage });

// setting current date to the footer:
const date = new Date();
const year = date.getFullYear();

// define an Array as database:
let posts = [
	{
		title: 'The Keeper of Stars',
		description:
			"'Keeper of Stars' is a heartwarming tale of love, loss, and redemption set against the backdrop of a small town in the mountains. The story follows a young woman who inherits her grandmother's old bookstore and discovers a hidden journal that reveals secrets from the past. As she delves deeper into the mysteries of her family history, she uncovers a connection to the stars that changes her life forever",
		picture: '/images/the keeper.jpg',
		id: 1,
	},
	{
		title: 'You Become What You Think',
		description:
			"'You Become What You Think' is a powerful self-help book that explores the connection between our thoughts and our reality. Through practical exercises and insightful guidance, the author shows readers how to harness the power of positive thinking to transform their lives. This book serves as a roadmap for creating a mindset that aligns with one's goals and aspirations",
		picture: '/images/you become what you think.jpg',
		id: 2,
	},
	{
		title: 'You Better Be Lighting',
		description:
			"'You Better Be Lighting' is a captivating novel that explores the complexities of love, loss, and redemption. With vivid imagery and compelling characters, this book will keep you on the edge of your seat until the very last page. A must-read for anyone who enjoys a thought-provoking and emotionally charged story",
		picture: '/images/you better be.jpg',
		id: 3,
	},
	{
		title: 'Where the Forest Meets the Stars',
		description:
			"'Where the Forest Meets the Stars' is a captivating tale of love, loss, and redemption set in the tranquil beauty of a remote forest. The story follows a young girl who befriends a mysterious woman claiming to be an alien, leading to unexpected discoveries and profound connections. With lyrical prose and rich character development, this novel explores themes of healing and hope in the face of adversity",
		picture: '/images/forest meets the stars.jpg',
		id: 4,
	},
	{
		title: 'Five Feet Apart',
		description:
			"'Five Feet Apart' is a heart-wrenching novel about two teenagers with cystic fibrosis who fall in love while being forced to stay five feet apart to prevent cross-infection. The emotional rollercoaster of their forbidden romance will keep readers on the edge of their seats until the very end. This poignant story explores themes of love, loss, and the power of human connection in the face of adversity",
		picture: '/images/five feet.jpg',
		id: 5,
	},
	{
		title: 'Edge of Madness',
		description:
			" 'Edge of Madness' is a gripping psychological thriller that will keep you on the edge of your seat.With its intricate plot twists and complex characters, this book delves into the dark depths of the human mind.  Prepare to be taken on a thrilling journey to the edge of madness in this chilling and suspenseful novel.",
		picture: '/images/edge of madness.jpg',
		id: 6,
	},
];

// Define routes
app.get('/', (req, res) => {
	const { update, updateMessage, removeMessage, remove } = req.query;

	res.render('index', {
		post: posts,
		Year: year,
		update,
		updateMessage,
		remove,
		removeMessage,
	});
});

app.get('/new-post', (req, res) => {
	res.render('new-post', {
		Year: year,
	});
});

// Create New Post :
app.post('/submit', upload.single('img'), (req, res) => {
	const { title, description } = req.body;
	const pic_path = req.file ? '/images/' + req.file.filename : null;

	let newPost = {
		id: posts.length + 1,
		title: title,
		description: description,
		picture: pic_path,
	};

	posts.push(newPost);
	res.render('index', {
		post: posts,
		Year: year,
	});
	console.log(newPost);
});

// Editing Post:
app.get('/edit/:id', upload.single('image'), (req, res) => {
	const postId = parseInt(req.params.id);
	const post = posts.find((p) => p.id === postId);

	if (!post) {
		return res.status(404).send('Post not Found');
	}
	res.render('edit', {
		post: post,
		Year: year,
	});
});

// sending edited post to the home page:
app.put('/update/:id', upload.single('image'), (req, res) => {
	const postId = parseInt(req.params.id);
	const updatedPostIndex = posts.findIndex((p) => p.id == postId);

	const pic_path = req.file ? '/images/' + req.file.filename : null;

	if (updatedPostIndex === -1) {
		return res.status(404).send('post not found');
	}
	let updatedPost = {
		id: postId,
		title: req.body.title,
		description: req.body.description,
		picture: pic_path,
	};

	posts[updatedPostIndex] = updatedPost;

	let update = true;
	setTimeout(() => {
		update = false;
	}, 3000);

	res.redirect('/?update=true&&updateMessage=Post Updated Successfully!');
});

app.post('/action', (req, res) => {
	const postId = parseInt(req.body.postId);
	const action = req.body.action;

	// Handle the action accordingly
	if (action === 'edit') {
		// Redirect to the edit route
		res.redirect(`/edit/${postId}`);
	} else if (action === 'delete') {
		// Find the index of the post in the posts array
		const postIndex = posts.findIndex((post) => post.id === postId);

		// If post not found, return 404 error
		if (postIndex === -1) {
			return res.status(404).send('Post not found');
		}
		// Remove the post from the posts array
		posts.splice(postIndex, 1);
		let remove = true;
		setTimeout(() => {
			remove = false;
			console.log('disapear deleting notification');
		}, 5000);

		// Redirect back to the home page
		res.redirect('/?remove=true&&removeMessage=Post Deleted Successfully!');
	}
});

// Start the server :
app.listen(PORT, () => {
  console.log('server started on port 3000');
  
});
