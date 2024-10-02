import { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import Modal from 'react-modal';

const SubscribersModal = ({ isOpen, onClose, users }) => {
	const [searchTerm, setSearchTerm] = useState('');
	const handleSearchChange = (event) => {
		setSearchTerm(event.target.value);
	};
	const filteredUsers = users.filter(
		(user) =>
			user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.fullname.toLowerCase().includes(searchTerm.toLowerCase())
	);
	console.log(users);

	return (
		<Modal
			isOpen={isOpen}
			onRequestClose={onClose}
			ariaHideApp={false}
			className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-70'
		>
			<div className='bg-gray-800 text-white w-[90%] max-w-md p-6 rounded-lg shadow-lg relative'>
				<IoMdClose
					className='absolute top-1 right-1 cursor-pointer'
					onClick={onClose}
				/>
				<input
					type='text'
					placeholder='Search'
					className='w-full p-2 mb-4 bg-gray-700 rounded-lg text-white outline-none focus:ring-2 focus:ring-gray-500'
					value={searchTerm}
					onChange={handleSearchChange}
				/>

				<div className='max-h-80 overflow-y-auto'>
					{filteredUsers.map((user, idx) => (
						<div
							key={idx}
							className='flex items-center justify-between py-2 border-b border-gray-700'
						>
							<div className='flex items-center space-x-4'>
								<img
									src={user.profileImage}
									alt={user.username}
									className='w-10 h-10 rounded-full'
								/>
								<div>
									<p className='font-medium'>{user.username}</p>
									<p className='text-sm text-gray-400'>{user.fullname}</p>
								</div>
							</div>

							<button className='text-red-500 bg-gray-700 p-1 px-3 rounded-lg hover:bg-gray-600'>
								Remove
							</button>
						</div>
					))}
				</div>
			</div>
		</Modal>
	);
};

export default SubscribersModal;
