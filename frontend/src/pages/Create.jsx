import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { axiosdata } from '../api/get-backend-data-api';
import { useNavigate } from 'react-router-dom';

const Create = () => {
	const [image, setImage] = useState(null);
	const [description, setDescription] = useState('');
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState(null);
	const navigate = useNavigate();
	const handleImageUpload = (e) => {
		const file = e.target.files[0];
		if (file) {
			setImage(URL.createObjectURL(file));
		}
	};
	const handleDescriptionChange = (e) => {
		setDescription(e.target.value);
	};

	const handleAddPost = async (e) => {
		e.preventDefault();
		setLoading(true);
		if (!image || !description) {
			setMessage('All field is required');
			return;
		}
		try {
			const formData = new FormData();
			formData.append('picture', e.target.picture.files[0]);
			formData.append('body', description);

			const res = await axiosdata.post('create-post', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
			setLoading(false);
			navigate('/');
		} catch (error) {
			setLoading(false);
			console.log(error);
		}
	};

	return (
		<div className='min-h-screen bg-gray-900 text-white flex'>
			<div className='w-[20vw]'>
				<Sidebar />
			</div>

			<div className='flex-1 p-6'>
				<h1 className='text-2xl font-semibold mb-6'>Create New Post</h1>

				<form
					className='flex flex-col items-center justify-center'
					onSubmit={handleAddPost}
				>
					<p>{message}</p>
					{image ? (
						<div className='mb-6'>
							<img
								src={image}
								alt='Preview'
								className='w-64 h-64 object-cover rounded-lg border-2 border-gray-700'
							/>
						</div>
					) : (
						<div className='mb-6 w-64 h-64 flex items-center justify-center bg-gray-800 border-2 border-dashed border-gray-600 rounded-lg'>
							<p className='text-gray-400'>No image uploaded</p>
						</div>
					)}

					<input
						type='file'
						accept='image/*'
						name='picture'
						onChange={handleImageUpload}
						className='hidden'
						id='imageUpload'
					/>
					<label
						htmlFor='imageUpload'
						className='cursor-pointer bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-all'
					>
						Choose Image
					</label>

					<div className='mt-6 w-full max-w-lg'>
						<textarea
							value={description}
							onChange={handleDescriptionChange}
							placeholder='Write a caption...'
							className='w-full px-4 py-2 bg-gray-800 text-gray-400 rounded-lg outline-none focus:ring-2 focus:ring-gray-600 resize-none'
							rows='4'
						/>
					</div>
					<button
						className='mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-all cursor-pointer'
						disabled={!image || !description}
						type='submit'
					>
						{loading ? 'Loading...' : 'Post'}
					</button>
				</form>
			</div>
		</div>
	);
};

export default Create;
