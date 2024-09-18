import { FaHome, FaPlus, FaSearch, FaUser } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ user }) => {
	const navigate = useNavigate();
	const location = useLocation();

	const menuItems = [
		{ icon: <FaHome className='text-xl' />, label: 'Home', path: '/' },
		{
			icon: <FaSearch className='text-xl' />,
			label: 'Search 	',
			path: '/search',
		},
		{ icon: <FaPlus className='text-xl' />, label: 'Create', path: '/create' },
		{
			icon: <FaUser className='text-xl' />,
			label: 'Profile',
			path: user?._id,
		},
	];

	return (
		<>
			<aside className='fixed top-0 w-[20vw] bg-black text-gray-400 p-6 h-screen'>
				<div className='text-white text-3xl mb-8 font-bold'>
					<img
						src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTovGeGxC8B2y44uIqatLVPUGqa2lRbahysIw&s'
						alt='Instagram'
						className='w-44'
					/>
				</div>
				<ul className='space-y-6'>
					{menuItems.map((item, idx) => (
						<li
							key={idx}
							className={`flex items-center space-x-3 cursor-pointer p-2 rounded-md transition-colors ${
								location.pathname === item.path
									? 'bg-gray-800 text-white'
									: 'hover:bg-gray-700'
							}`}
							onClick={() => navigate(item.path)}
						>
							{item.icon}
							<span>{item.label}</span>
						</li>
					))}
				</ul>
			</aside>
		</>
	);
};

export default Sidebar;
