import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { axiosdata } from '../api/get-backend-data-api';
import { useNavigate } from 'react-router-dom';

const Search = () => {
	const [users, setUsers] = useState([]);
	const navigate = useNavigate();
	useEffect(() => {
		const getUsersData = async () => {
			const res = await axiosdata.get(`get-all-users`);
			setUsers(res.data.users);
		};
		getUsersData();
	}, []);
	if (!users) {
		return <h1>Loading...</h1>;
	}

	return (
		<div className='min-h-screen bg-gray-900 text-white flex'>
			<div className='w-[20vw]'>
				<Sidebar />
			</div>

			<div className='flex-1 p-6'>
				<div className='flex justify-center mb-6'>
					<input
						type='text'
						placeholder='Search users...'
						className='w-2/3 md:w-1/2 px-4 py-2 bg-gray-800 text-gray-400 rounded-full outline-none focus:ring-2 focus:ring-indigo-500 transition-all'
					/>
				</div>
				<div className='max-w-xl mx-auto space-y-6'>
					{users?.map((item, idx) => (
						<div
							key={idx}
							className='bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all flex space-x-5 cursor-pointer'
							onClick={() => navigate(`/${item._id}`)}
						>
							<img
								src={item.profileImage}
								alt={item.username}
								className='h-16 object-cover rounded-lg mb-4'
							/>
							<div>
								<h3 className='text-lg font-semibold mb-2'>{item.username}</h3>
								<p className='text-gray-400'>{item.bio}...</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Search;
