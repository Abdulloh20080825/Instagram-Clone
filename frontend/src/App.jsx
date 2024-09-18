import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Search from './pages/Search';
import Profile from './pages/Profile';
import Create from './pages/Create';
import ViewPost from './pages/ViewPost';
import { useEffect, useState } from 'react';
import { axiosdata } from './api/get-backend-data-api';

const App = () => {
	const [user, setUser] = useState({});
	const token = localStorage.getItem('token');

	useEffect(() => {
		const getUserData = async () => {
			try {
				const res = await axiosdata.get('/get-user');
				setUser(res.data.user);
			} catch (error) {
				console.log(error);
			}
		};
		getUserData();
	}, [token, user]);
	
	return (
		<Routes>
			<Route path='/' element={<Home user={user} />} />
			<Route path='/search' element={<Search />} />
			<Route path='/create' element={<Create />} />
			<Route path='/:id' element={<Profile t_user={user} />} />
			<Route path='/p/:id' element={<ViewPost _user_={user} />} />
			<Route path='/signup' element={<SignUp />} />
			<Route path='/login' element={<Login />} />
		</Routes>
	);
};

export default App;
