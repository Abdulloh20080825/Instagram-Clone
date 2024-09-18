import { useEffect, useState } from 'react';
import PostList from '../components/PostList';
import Sidebar from '../components/Sidebar';
import SuggestedUserList from '../components/SuggestedUserList';
import { useNavigate } from 'react-router-dom';
import { axiosdata } from '../api/get-backend-data-api';

const Home = ({ user }) => {
	const [suggestedUsers, setSuggestedUsers] = useState([]);
	const [posts, setPosts] = useState([]);
	const [loadingUsers, setLoadingUsers] = useState(true);
	const navigate = useNavigate();
	const token = localStorage.getItem('token');

	useEffect(() => {
		if (!token) {
			navigate('/login');
		} else {
			const getSuggestedUsers = async () => {
				try {
					const res = await axiosdata.get('/get-all-users');
					setSuggestedUsers(res.data.users);
				} catch (error) {
					console.error('Failed to fetch users:', error);
				} finally {
					setLoadingUsers(false);
				}
			};
			const getAllPosts = async () => {
				const res = await axiosdata.get('get-all-posts');
				setPosts(res.data.posts.reverse());
			};
			getAllPosts();

			getSuggestedUsers();
		}
	}, [token, navigate]);
	console.log('USER', user);

	return (
		<div className='bg-black min-h-screen flex'>
			<div className='w-[20vw]'>
				<Sidebar user={user} />
			</div>
			<main className='flex-grow space-y-5 bg-black text-white px-4 py-8 w-1/2'>
				{posts.map((item, idx) => (
					<PostList key={idx} item={item} />
				))}
			</main>
			<aside className='w-1/4 bg-black text-gray-400 p-6 hidden lg:block'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center space-x-3'>
						<img
							src={user.profileImage}
							alt='Your profile'
							className='w-12 h-12 rounded-full'
						/>
						<div>
							<span
								className='font-semibold text-white cursor-pointer'
								onClick={() => navigate(user._id)}
							>
								{user.username}
							</span>
							<p className='text-sm'>{user.fullname}</p>
						</div>
					</div>
					<button className='text-blue-400 hover:underline'>Switch</button>
				</div>
				<div className='mt-8'>
					<h3 className='font-semibold text-white'>New in Instagram</h3>
					<div className='mt-4 space-y-4'>
						{loadingUsers ? (
							<p>Loading users...</p>
						) : (
							<SuggestedUserList
								suggestedUsers={suggestedUsers}
								id={user._id}
							/>
						)}
					</div>
				</div>
			</aside>
		</div>
	);
};

export default Home;
3;
