var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema(
	{
		body: { type: String, required: true },
		picture: { type: String },
		user: { type: mongoose.Types.ObjectId, ref: 'User' },
		likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
		comments: [{ type: mongoose.Types.ObjectId, ref: 'Comment' }],
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
