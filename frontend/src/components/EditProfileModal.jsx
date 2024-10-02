import { useState } from 'react';
import Modal from 'react-modal';
import { axiosdata } from '../api/get-backend-data-api';
import { useNavigate } from 'react-router-dom';

const EditProfileModal = ({ isOpen, onClose, user }) => {
	const [image, setImage] = useState(null);
	const [username, setUsername] = useState(user.username || '');
	const [fullname, setFullName] = useState(user.fullname || '');
	const [bio, setBio] = useState(user.bio || '');
	const navigate = useNavigate();

	const handleSave = async (e) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append('username', username || user.username);
		formData.append('fullname', fullname || user.fullname);
		formData.append('bio', bio || user.bio);
		if (image) formData.append('picture', image);

		try {
			const res = await axiosdata.put('update-user', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
			navigate('/');
		} catch (error) {
			console.error(error);
		}
	};

	const getImage = (e) => {
		const img = e.target.files[0];
		setImage(img);
	};

	return (
		<Modal
			isOpen={isOpen}
			onRequestClose={onClose}
			className='fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50'
			overlayClassName='fixed inset-0'
			ariaHideApp={false}
		>
			<div className='relative bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mx-auto'>
				<div className='flex justify-between items-center border-b pb-3 mb-4'>
					<h2 className='text-xl font-semibold'>Edit Profile</h2>
					<button
						className='text-gray-600 hover:text-gray-800'
						onClick={onClose}
					>
						&times;
					</button>
				</div>
				<form className='space-y-4' onSubmit={handleSave}>
					<div className='flex items-center space-x-4'>
						<img
							src={user.profileImage}
							alt='Profile'
							className='w-16 h-16 rounded-full'
						/>
						<div className='space-y-2'>
							<h4 className='font-semibold'>@{user.username}</h4>
							<label className='block text-blue-500 hover:underline text-sm cursor-pointer'>
								<input
									type='file'
									className='hidden'
									accept='image/*'
									name='picture'
									onChange={getImage}
								/>
								Change Profile Photo
							</label>
						</div>
					</div>
					<div>
						<label className='block text-gray-600 text-sm mb-1'>Username</label>
						<input
							type='text'
							name='username'
							onChange={(e) => setUsername(e.target.value)}
							className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'
							defaultValue={user.username}
						/>
					</div>
					<div>
						<label className='block text-gray-600 text-sm mb-1'>Name</label>
						<input
							type='text'
							name='fullname'
							onChange={(e) => setFullName(e.target.value)}
							className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'
							defaultValue={user.fullname}
						/>
					</div>
					<div>
						<label className='block text-gray-600 text-sm mb-1'>Bio</label>
						<textarea
							className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'
							rows='3'
							defaultValue={user.bio}
							onChange={(e) => setBio(e.target.value)}
						></textarea>
					</div>

					<div className='flex justify-end space-x-5'>
						<button
							type='submit'
							className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600'
						>
							Save
						</button>
					</div>
				</form>
			</div>
		</Modal>
	);
};

export default EditProfileModal;
