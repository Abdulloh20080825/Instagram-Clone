const Header = () => {
	return (
		<nav className='bg-white border-b border-gray-300 py-4'>
			<div className='container mx-auto flex justify-between items-center'>
				<div className='flex items-center'>
					<img
						src='https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png'
						alt='Instagram Logo'
						className='w-10 h-10'
					/>
				</div>
				<div>
					<input
						type='text'
						placeholder='Search'
						className='px-4 py-1 border border-gray-300 rounded-full text-sm'
					/>
				</div>
				<div className='flex items-center space-x-4'>
					<button className='text-gray-600'>
						<i className='fas fa-home'></i>
					</button>
					<button className='text-gray-600'>
						<i className='fas fa-paper-plane'></i>
					</button>
					<button className='text-gray-600'>
						<i className='fas fa-compass'></i>
					</button>
					<button className='text-gray-600'>
						<i className='fas fa-heart'></i>
					</button>
					<img
						src='https://via.placeholder.com/30'
						alt='Profile'
						className='w-8 h-8 rounded-full'
					/>
				</div>
			</div>
		</nav>
	);
};

export default Header;
