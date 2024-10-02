import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { instagram } from '../constants/instagramlogo';
import { axiosdata } from '../api/get-backend-data-api';

const Login = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState(null);
	const navigate = useNavigate();

	const handleLoginHandler = async (e) => {
		setLoading(true);
		e.preventDefault();
		if (!username || !password) {
			setMessage('All Field is required !!!');
			setLoading(false);
			return;
		}
		try {
			const res = await axiosdata.post('login', {
				username,
				password,
			});
			localStorage.setItem('token', res.data.accessToken);
			navigate('/');
			setLoading(false);
		} catch (error) {
			if (error.response.data.message) {
				setMessage(error.response.data.message);
			}
			setLoading(false);
			return console.log(error);
		}
	};

	return (
		<div className='flex flex-col items-center justify-center min-h-screen bg-gray-50'>
			<div className='w-full max-w-sm p-6 space-y-8 bg-white border border-gray-300 rounded-md shadow-md'>
				<div className='flex justify-center mb-6'>
					<img src={instagram} alt='Instagram logo' className='w-48' />
				</div>
				<p className='text-red-600 text-center font-semibold  '>{message}</p>
				<form className='space-y-4' onSubmit={handleLoginHandler}>
					<input
						type='text'
						placeholder='Username'
						name='username'
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						className='w-full px-4 py-2 text-sm border rounded-md focus:outline-none focus:border-blue-400'
					/>
					<input
						type='password'
						placeholder='Password'
						name='password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className='w-full px-4 py-2 text-sm border rounded-md focus:outline-none focus:border-blue-400'
					/>
					<button className='w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600'>
						{loading ? 'Loading...' : 'Log In'}
					</button>
				</form>
			</div>
			<div className='w-full max-w-sm p-4 mt-4 text-center bg-white border border-gray-300 rounded-md'>
				<p>
					Don't have an account?{' '}
					<Link to='/signup' className='font-semibold text-blue-500'>
						Sign up
					</Link>
				</p>
			</div>
		</div>
	);
};

export default Login;
