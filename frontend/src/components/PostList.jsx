import { useEffect, useState } from 'react';
import { FaComment, FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { axiosdata } from '../api/get-backend-data-api';

const PostList = ({ item }) => {
	const [user, setUser] = useState({});
	useEffect(() => {
		const getUser = async () => {
			const res = await axiosdata.get(`/get-user-info/${item.user}`);
			setUser(res.data.user);
		};
		getUser();
	}, []);

	if (!user) {
		return <h1>Loading...</h1>;
	}

	return (
		<div className='bg-gray-900 p-6 rounded-lg'>
			<div className='flex items-center justify-between'>
				<div className='flex items-center'>
					<img
						src={user.profileImage}
						alt='Profile'
						className='w-12 h-12 rounded-full'
					/>
					<Link to={`/${user._id}`}>
						<span className='ml-3 font-semibold'>{user.username}</span>
					</Link>
				</div>
			</div>

			<div className='mt-4'>
				<img
					src={`http://localhost:4040/${item.picture}`}
					alt='Post'
					className='w-full rounded-lg'
				/>
			</div>
			<div className='flex flex-col items-start mt-4'>
				<div className='flex space-x-4'>
					<button>
						<FaHeart className='text-2xl text-gray-400 hover:text-white transition duration-200' />
					</button>
				</div>
				<p className='text-lg font-semibold'>0 {'"Likes"'}</p>
			</div>

			<div className='mt-3'>
				<p>
					<span className='font-semibold'>{user.username} </span>
					{item.body}
				</p>
				<Link to={`/p/${item._id}`}>
					<p className='text-gray-400 text-sm mt-1 cursor-pointer hover:underline'>
						View all comments
					</p>
				</Link>
			</div>
		</div>
	);
};

export default PostList;
