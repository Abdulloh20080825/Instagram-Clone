const express = require('express');
const User = require('./models/User');
const PORT = process.env.PORT || 4040;
const app = express();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { v4: uuid4 } = require('uuid');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const Post = require('./models/Post');
const cors = require('cors');
require('dotenv').config();

function isAuthToken(req, res, next) {
	const header = req.headers['authorization'];
	const token = header && header.split(' ')[1];

	if (!token) {
		return res.status(401).json({ message: 'Access token missing' });
	}

	jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
		if (err) {
			return res.status(403).json({ message: 'Invalid or expired token' });
		}
		req.user = user;
		next();
	});
}

function createJsonWebToken(user) {
	return jwt.sign({ user }, process.env.JWT_SECRET, {
		expiresIn: '90d',
	});
}

function getImageWithFile(file) {
	try {
		const fileName = uuid4() + path.extname(file.name);
		const staticDirectory = path.join(__dirname, 'static');
		const filePath = path.join(staticDirectory, fileName);

		if (!fs.existsSync(staticDirectory)) {
			fs.mkdirSync(staticDirectory, { recursive: true });
		}

		file.mv(filePath, (err) => {
			if (err) {
				console.error('Error saving file:', err);
				throw new Error('Error saving file');
			}
		});

		return fileName;
	} catch (error) {
		console.error('FileService save error:', error.message);
		throw new Error('Error saving file');
	}
}

async function getImageForProfile(file) {
	try {
		const fileName = uuid4() + path.extname(file.name);
		const staticDirectory = path.join(__dirname, 'static');
		const filePath = path.join(staticDirectory, fileName);

		if (!fs.existsSync(staticDirectory)) {
			fs.mkdirSync(staticDirectory, { recursive: true });
		}

		await new Promise((resolve, reject) => {
			file.mv(filePath, (err) => {
				if (err) {
					console.error('Error saving file:', err);
					reject(new Error('Error saving file'));
				} else {
					resolve();
				}
			});
		});

		return fileName;
	} catch (error) {
		console.error('FileService save error:', error.message);
		throw new Error('Error saving file');
	}
}

app.use(
	cors({
		origin: '*',
	})
);
app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('static'));

// AUTH
app.get('/', (req, res) => {
	return res.status(200).json('Backend is Working');
});

app.post('/api/create-account', async (req, res) => {
	try {
		const { fullname, username, email, password } = req.body;

		if (!fullname || !username || !email || !password) {
			return res.status(400).json({ message: 'All fields are required' });
		}

		if (
			password.length < 8 ||
			!/\d/.test(password) ||
			!/[a-zA-Z]/.test(password)
		) {
			return res.status(400).json({
				message:
					'Password must be at least 8 characters long and contain both letters and numbers',
			});
		}

		const [existingEmail, existingUsername] = await Promise.all([
			User.findOne({ email }),
			User.findOne({ username }),
		]);

		if (existingEmail)
			return res.status(400).json({ message: 'Email is already taken' });
		if (existingUsername)
			return res.status(400).json({ message: 'Username is already taken' });

		const user = new User({
			fullname,
			username,
			email,
			password,
		});
		const accessToken = createJsonWebToken(user);

		await user.save();

		return res
			.status(201)
			.json({ message: 'User created successfully', user, accessToken });
	} catch (error) {
		return res.status(500).json({
			message: 'Something went wrong, please try again later',
			error: error.message,
		});
	}
});

app.post('/api/login', async (req, res) => {
	try {
		const { username, password } = req.body;

		if (!username || !password)
			return res.status(400).json({ message: 'All fields are required' });

		const existingUser = await User.findOne({ username });
		if (!existingUser)
			return res.status(400).json({ message: 'User not found' });

		if (password != existingUser.password)
			return res.status(400).json({ message: 'Incorrect password' });

		const accessToken = createJsonWebToken(existingUser);

		return res
			.status(200)
			.json({ message: 'Login successful', user: existingUser, accessToken });
	} catch (error) {
		return res.status(500).json({
			message: 'Something went wrong, please try again later',
			error: error.message,
		});
	}
});

app.get('/api/get-user', isAuthToken, async (req, res) => {
	try {
		const { user } = req.user;
		const foundUser = await User.findOne({ username: user.username });

		if (!foundUser) return res.status(400).json({ message: 'User not found' });

		return res
			.status(200)
			.json({ message: 'User found successfully', user: foundUser });
	} catch (error) {
		return res.status(500).json({
			message: 'Something went wrong, please try again later',
			error: error.message,
		});
	}
});

app.get('/api/get-user-info/:id', isAuthToken, async (req, res) => {
	try {
		const id = req.params.id;
		const user = await User.findById(id);
		if (!user) {
			return res.status(400).json({
				message: 'User not found',
			});
		}
		return res.status(201).json({
			message: 'User found successfuly',
			user,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Something went wrong, please try again later',
			error: error.message,
		});
	}
});
app.put('/api/update-user', isAuthToken, async (req, res) => {
	try {
		const { fullname, username, bio } = req.body;
		const { user } = req.user;
		if (!fullname || !username) {
			return res.status(400).json({ message: 'All fields are required' });
		}
		const existingUsername = await User.findOne({ username });
		if (existingUsername) {
			return res.status(400).json({ message: 'Username already taken' });
		}
		let imgPath = user.profileImage;
		if (req.files && req.files.picture) {
			imgPath = await getImageForProfile(req.files.picture);
		}

		const updatedUser = await User.findByIdAndUpdate(user._id, {
			username,
			fullname,
			bio,
			profileImage: imgPath,
		});

		if (!updatedUser) {
			return res.status(404).json({ message: 'User not found' });
		}
		return res.status(200).json({
			message: 'User updated successfully',
			user: updatedUser,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Something went wrong, please try again later',
			error: error.message,
		});
	}
});

app.put('/api/update-password', isAuthToken, async (req, res) => {
	try {
		const { updatepass } = req.body;
		const { user } = req.user;

		const foundUser = await User.findOne({ username: user.username });
		const hashedPassword = await bcrypt.hash(updatepass, 10);

		const updatedUser = await User.findByIdAndUpdate(
			foundUser._id,
			{ password: hashedPassword },
			{ new: true }
		);

		return res
			.status(200)
			.json({ message: 'Password updated successfully', user: updatedUser });
	} catch (error) {
		return res.status(500).json({
			message: 'Something went wrong, please try again later',
			error: error.message,
		});
	}
});

app.delete('/api/delete-account/:id', isAuthToken, async (req, res) => {
	try {
		const username = req.params.id;
		const foundUser = await User.findOne({ username });

		const deletedUser = await User.findByIdAndDelete(foundUser._id);
		return res.status(200).json({
			message: `${deletedUser.fullname} has been deleted successfully`,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Something went wrong with deleting the account',
			error: error.message,
		});
	}
});
app.get('/api/get-all-users', isAuthToken, async function (req, res) {
	try {
		const users = await User.find();
		return res.status(201).json({
			message: 'Users founded successfuly',
			users,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Something went wrong, please try again later',
			error: error.message,
		});
	}
});

// POST

app.post('/api/create-post', isAuthToken, async (req, res) => {
	try {
		const { body } = req.body;
		const { user } = req.user;

		if (!body)
			return res.status(400).json({ message: 'Post body is required' });
		const picture = req.files ? req.files.picture : null;
		const picturePath = picture ? getImageWithFile(picture) : null;
		console.log(req.files);

		const newPost = new Post({
			body,
			picture: picturePath,
			user: user._id,
		});

		const savedPost = await newPost.save();
		return res
			.status(201)
			.json({ message: 'Post created successfully', post: savedPost });
	} catch (error) {
		return res.status(500).json({
			message: 'Something went wrong, please try again later',
			error: error.message,
		});
	}
});

app.delete('/api/delete-post/:id', isAuthToken, async function (req, res) {
	try {
		let id = req.params.id;
		if (!id) return res.status(400).json({ message: 'Post not found' });
		let deletedPost = await Post.findByIdAndDelete(id);
		return res.status(201).json({
			message: 'Post deleted successfuly',
			post: deletedPost,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Something went wrong, please try again later',
			error: error.message,
		});
	}
});

app.get('/api/get-all-posts', isAuthToken, async function (req, res) {
	try {
		const posts = await Post.find();
		return res.status(201).json({
			message: 'Posts founded successfuly',
			posts,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Something went wrong, please try again later',
			error: error.message,
		});
	}
});
app.get('/api/get-posts', isAuthToken, async function (req, res) {
	try {
		const { userId } = req.query;
		const posts = await Post.find({ user: userId });
		return res.status(200).json({
			message: 'Posts found successfuly',
			posts,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Something went wrong, please try again later',
			error: error.message,
		});
	}
});

app.get('/api/get-post/:id', isAuthToken, async (req, res) => {
	try {
		const id = req.params.id;
		const post = await Post.findById(id);
		const user = await User.findById(post.user);
		console.log(user);
		return res.status(200).json({
			message: 'Post found',
			post,
			user,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Something went wrong',
			error: error.message,
		});
	}
});

// app.get('/api/subscribers-posts', isAuthToken, async function (req, res) {
// 	try {
// 		const posts = [];
// 		const user = req.user;
// 		if (user.subscriptions) {
// 			for (let i = 0; i < user.subscriptions; i++) {
// 				const posts = await User
// 			}
// 		}
// 	} catch (error) {
// 		return res.status(500).json({
// 			message: 'Something went wrong, please try again later',
// 			error: error.message,
// 		});
// 	}
// });

// Sub...
app.post('/api/subscribe/:targetUserId', isAuthToken, async (req, res) => {
	const { targetUserId } = req.params;
	const { user } = req.user;
	console.log('Target User', targetUserId);
	console.log('Logged USer', user);
	try {
		const targetUser = await User.findById(targetUserId);
		const loggedInUser = await User.findById(user);

		if (!targetUser || !loggedInUser) {
			return res.status(404).json({ message: 'User not found' });
		}

		if (targetUser.subscribers.includes(user)) {
			return res.status(400).json({ message: 'Already subscribed' });
		}
		targetUser.subscribers.push(user);
		loggedInUser.subscriptions.push(targetUserId);
		await targetUser.save();
		await loggedInUser.save();

		res.status(200).json({
			message: 'Successfully subscribed',
			targetUser,
			loggedInUser,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
});

app.post('/api/unsubscribe/:targetUserId', isAuthToken, async (req, res) => {
	const { targetUserId } = req.params;
	const { user } = req.user;

	try {
		const targetUser = await User.findById(targetUserId);
		const loggedInUser = await User.findById(user._id);

		if (!targetUser || !loggedInUser) {
			return res.status(404).json({ message: 'User not found' });
		}

		if (!targetUser.subscribers.includes(user._id)) {
			return res.status(400).json({ message: 'Not subscribed' });
		}
		targetUser.subscribers = targetUser.subscribers.filter(
			(sub) => sub.toString() !== user._id.toString()
		);
		loggedInUser.subscriptions = loggedInUser.subscriptions.filter(
			(sub) => sub.toString() !== targetUserId.toString()
		);
		await targetUser.save();
		await loggedInUser.save();

		res
			.status(200)
			.json({ message: 'Successfully unsubscribed', targetUser, loggedInUser });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
});

app.get('/api/get-subscribers-users/:id', isAuthToken, async (req, res) => {
	try {
		const id = req.params.id;
		const users = [];
		const user = await User.findById(id);
		for (let i = 0; i < user.subscribers.length; i++) {
			const ur = await User.findById(user.subscribers[i]);
			users.push(ur);
		}

		return res.status(201).json({
			message: 'Subscribers founded successfuly',
			users,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Somwthing went wrong',
		});
	}
});

app.get('/api/get-subscriptions/:id', isAuthToken, async (req, res) => {
	try {
		const id = req.params.id;
		const users = [];
		const user = await User.findById(id);
		for (let i = 0; i < user.subscriptions.length; i++) {
			const ur = await User.findById(user.subscriptions[i]);
			users.push(ur);
		}

		return res.status(201).json({
			message: 'Subscribers founded successfuly',
			users,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Somwthing went wrong',
		});
	}
});

app.listen(PORT, () => {
	mongoose
		.connect(process.env.MONGO_URL)
		.then(() => console.log('DB connected'))
		.catch((error) => console.log('DB error' + error));
	console.log('Server has been started on host http://localhost:4040');
});
