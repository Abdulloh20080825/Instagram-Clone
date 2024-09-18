var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema(
	{
		fullname: { type: String, required: true },
		username: { type: String, required: true, unique: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		profileImage: {
			type: String,
			default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
		},
		bio: { type: String },
		subscribers: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
		subscriptions: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
	},
	{ timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
