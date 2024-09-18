import { Link } from 'react-router-dom';

const SuggestedUserList = ({ suggestedUsers, id }) => {
	console.log(suggestedUsers);
	console.log(id);
	return (
		<>
			{suggestedUsers.slice(0, 5).map((item, index) =>
				id === item._id ? null : (
					<div key={index} className='flex justify-between items-center'>
						<div className='flex items-center space-x-3'>
							<img
								src={item.profileImage}
								alt='Profile'
								className='w-10 h-10 rounded-full'
							/>
							<div>
								<Link to={`/${item._id}`}>
									<span className='font-semibold text-white cursor-pointer'>
										{item.username.length >= 15
											? `${item.username.slice(0, 15)}...`
											: item.username}
									</span>
								</Link>
								<p className='text-xs text-gray-400'>New to Instagram</p>
							</div>
						</div>
						<button className='text-blue-400 hover:underline'>Follow</button>
					</div>
				)
			)}
		</>
	);
};

export default SuggestedUserList;
