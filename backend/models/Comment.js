var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var commentSchema = new Schema(
	{
		body: { type: String },
		likes: { type: mongoose.Schema.Types.ObjectId },
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		post: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Post',
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Comment', commentSchema);
