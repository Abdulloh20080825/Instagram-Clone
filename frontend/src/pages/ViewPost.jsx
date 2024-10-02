import { useParams, useNavigate, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useEffect, useState } from 'react';
import { axiosdata } from '../api/get-backend-data-api';
import moment from 'moment';
import { MdDelete } from 'react-icons/md';
import Modal from 'react-modal'; // For modal functionality

Modal.setAppElement('#root'); // Setting root for accessibility

const ViewPost = ({ _user_ }) => {
	const [post, setPost] = useState({});
	const [user, setUser] = useState({});
	const { id } = useParams();
	const navigate = useNavigate(); // Replacing useHistory with useNavigate
	const [modalIsOpen, setModalIsOpen] = useState(false); // State for modal visibility

	useEffect(() => {
		const getPost = async () => {
			const res = await axiosdata.get(`get-post/${id}`);
			setPost(res.data.post);
			setUser(res.data.user);
		};
		getPost();
	}, [id]);

	const handleDelete = async () => {
		try {
			await axiosdata.delete(`delete-post/${id}`);
			alert('Post deleted successfully.');
			navigate('/');
		} catch (error) {
			console.error('Error deleting the post:', error);
			alert('Failed to delete the post. Please try again later.');
		} finally {
			setModalIsOpen(false);
		}
	};

	const openModal = () => {
		setModalIsOpen(true);
	};

	const closeModal = () => {
		setModalIsOpen(false);
	};

	return (
		<div className='min-h-screen bg-black text-white flex justify-center'>
			<div className='hidden lg:block w-[18vw]'>
				<Sidebar />
			</div>
			<div className='flex flex-col lg:flex-row w-full lg:px-8 mt-6'>
				<div className='lg:w-[60%] w-full'>
					<img
						src={`http://localhost:4040/${post.picture}`}
						alt='Post'
						className='w-full object-cover rounded-lg shadow-lg h-screen'
					/>
				</div>

				<div className='lg:w-[40%] w-full lg:pl-6 flex flex-col mt-6 lg:mt-0'>
					<div className='bg-gradient-to-r from-gray-800 via-gray-900 to-black p-6 rounded-xl shadow-xl mb-6'>
						<div className='flex justify-between items-center mb-2'>
							<p className='text-sm text-gray-300'>
								Posted by:{' '}
								<Link to={`/${user._id}`}>
									<span className='font-semibold text-white'>
										{user.username}
									</span>
								</Link>
							</p>
							<p className='text-xs text-gray-400 flex items-center space-x-2'>
								<span>{moment(post.createdAt).fromNow()}</span>
								{_user_.username === user.username ? (
									<MdDelete
										onClick={openModal}
										className='cursor-pointer text-gray-500 hover:text-red-600 transition-colors duration-200'
									/>
								) : null}
							</p>
						</div>
						<p className='text-lg font-light text-gray-200 mt-4 leading-relaxed'>
							{post.body}
						</p>
					</div>

					<div className='bg-gray-900 p-4 rounded-lg shadow-lg mb-4'>
						<div className='flex justify-between items-center text-gray-400'>
							<p className='hover:text-gray-200 cursor-pointer'>
								💬 {post.comments?.length || 0} Comments
							</p>
						</div>
					</div>
					<div className='flex-1 bg-gray-900 p-4 rounded-lg shadow-lg overflow-y-auto'>
						<h3 className='text-lg font-bold text-white mb-4'>Comments</h3>
						<div>
							{post.comments?.length > 0 ? (
								post.comments.map((comment, index) => (
									<div key={index} className='flex items-start mb-4'>
										<div className='w-8 h-8 rounded-full bg-gray-500 mr-3'></div>
										<div className='flex-1'>
											<p className='text-sm text-gray-300'>{comment}</p>
										</div>
									</div>
								))
							) : (
								<p className='text-gray-400'>No comments yet.</p>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Delete Modal */}
			<Modal
				isOpen={modalIsOpen}
				onRequestClose={closeModal}
				contentLabel='Delete Confirmation'
				className='fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center'
				overlayClassName='fixed inset-0 bg-black bg-opacity-75'
			>
				<div className='bg-gray-800 p-6 rounded-lg shadow-lg text-center'>
					<h2 className='text-lg font-semibold text-white mb-4'>
						Delete this post?
					</h2>
					<p className='text-gray-400 mb-6'>
						Are you sure you want to delete this post? This action cannot be
						undone.
					</p>
					<div className='flex justify-center space-x-4'>
						<button
							onClick={handleDelete}
							className='bg-red-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-700'
						>
							Delete
						</button>
						<button
							onClick={closeModal}
							className='bg-gray-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-gray-700'
						>
							Cancel
						</button>
					</div>
				</div>
			</Modal>
		</div>
	);
};

export default ViewPost;
