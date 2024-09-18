import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import EditProfileModal from '../components/EditProfileModal';
import SettingsModal from '../components/SettingsModal';
import { axiosdata } from '../api/get-backend-data-api';
import { Link, useParams } from 'react-router-dom';
import SubscribersModal from '../components/SubscribersModal';
import SubscriptionsModal from '../components/SubscriptionsModal';

const Profile = ({ t_user }) => {
	const [user, setUser] = useState({});
	const [userPosts, setUserPosts] = useState([]);
	const [isEditModalOpen, setEditModalOpen] = useState(false);
	const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
	const [isOpenSubscribersModal, setIsOpenSubscribersModal] = useState(false);
	const [subscribersUser, setSubscribersUser] = useState([]);
	const [subscriptionUsers, setSubscriptionUsers] = useState([]);
	const [isOpenSubscriptions, setIsOpenSubscriptionModal] = useState(false);
	const [loading, setLoading] = useState(false);
	const { id } = useParams();

	const openEditModal = () => setEditModalOpen(true);
	const closeEditModal = () => setEditModalOpen(false);

	const openSettingsModal = () => setSettingsModalOpen(true);
	const closeSettingsModal = () => setSettingsModalOpen(false);

	const openSubscribersModal = async () => {
		const res = await axiosdata.get(`/get-subscribers-users/${id}`);
		setSubscribersUser(res.data.users);
		setIsOpenSubscribersModal(true);
	};
	const closeSubscribersModal = () => setIsOpenSubscribersModal(false);

	const openSubcriptionModal = async () => {
		const res = await axiosdata.get(`/get-subscriptions/${id}`);
		setSubscriptionUsers(res.data.users);
		setIsOpenSubscriptionModal(true);
	};

	const closeSubscriptionModal = () => setIsOpenSubscriptionModal(false);

	useEffect(() => {
		const getUserPosts = async () => {
			try {
				const res = await axiosdata.get('get-posts', {
					params: { userId: id },
				});
				setUserPosts(res.data.posts);
			} catch (error) {
				console.log(error);
			}
		};
		const getUsernfo = async () => {
			const res = await axiosdata.get(`/get-user-info/${id}`);
			setUser(res.data.user);
		};
		getUsernfo();
		getUserPosts();
	}, [id]);

	const subscribe = async () => {
		setLoading(true);
		try {
			const res = await axiosdata.post(`/subscribe/${id}`);

			setUser((prevUser) => ({
				...prevUser,
				subscribers: [...prevUser.subscribers, t_user._id],
			}));
		} catch (error) {
			console.error('Error subscribing:', error);
		} finally {
			setLoading(false);
		} 
	};

	const unsubscribe = async () => {
		setLoading(true);
		try {
			const res = await axiosdata.post(`/unsubscribe/${id}`);
			console.log(res);
			setUser((prevUser) => ({
				...prevUser,
				subscribers: prevUser.subscribers.filter((sub) => sub !== t_user._id),
			}));
		} catch (error) {
			console.error('Error unsubscribing:', error);
		} finally {
			setLoading(false);
		}
	};

	if (!user) {
		return <h1>Loading...</h1>;
	}

	return (
		<div className='min-h-screen bg-gray-900 text-white flex'>
			<div className='w-[20vw]'>
				<Sidebar />
			</div>
			<div className='flex-1 p-6'>
				<div className='flex justify-between items-center'>
					<div className='flex items-center space-x-6'>
						<img
							className='w-32 h-32 rounded-full border-4 border-gray-800'
							src={user.profileImage}
							alt='Profile'
						/>
						<div>
							<h2 className='text-2xl font-semibold'>@{user.username}</h2>
							<p className='text-gray-400'>{user.fullname}</p>
							<p className='mt-2 text-sm text-gray-300'>{user.bio}</p>
						</div>
					</div>

					{t_user._id === user._id ? (
						<div className='flex space-x-4'>
							<button
								className='bg-gray-800 px-4 py-2 rounded-md text-sm'
								onClick={openEditModal}
							>
								Edit Profile
							</button>
							<button
								className='bg-gray-800 px-4 py-2 rounded-md text-sm'
								onClick={openSettingsModal}
							>
								Settings
							</button>
						</div>
					) : (
						<>
							{loading ? (
								<button className='bg-gray-800 px-4 py-2 rounded-md text-sm'>
									Loading...
								</button>
							) : t_user?.subscriptions?.includes(user?._id) ? (
								<button
									className='bg-gray-800 px-4 py-2 rounded-md text-sm'
									onClick={unsubscribe}
								>
									Unsubscribe
								</button>
							) : (
								<button
									className='bg-sky-600 px-4 py-2 rounded-md text-sm'
									onClick={subscribe}
								>
									Subscribe
								</button>
							)}
						</>
					)}
				</div>

				<div className='flex space-x-8 mt-4'>
					<div className='text-center'>
						<p className='text-xl font-bold'>{userPosts.length}</p>
						<p className='text-gray-400'>Publications</p>
					</div>
					<div className='text-center'>
						<p className='text-xl font-bold'>
							{user.subscribers ? user.subscribers.length : 0}
						</p>
						<p
							className='text-gray-400 cursor-pointer'
							onClick={openSubscribersModal}
						>
							Subscribers
						</p>
					</div>
					<div className='text-center'>
						<p className='text-xl font-bold'>
							{user.subscriptions ? user.subscriptions.length : 0}
						</p>
						<p
							className='text-gray-400 cursor-pointer'
							onClick={() => openSubcriptionModal(true)}
						>
							Subscriptions
						</p>
					</div>
				</div>

				<div className='flex justify-center space-x-12 mt-6 border-t border-gray-800 pt-4'>
					<button className='text-gray-400 hover:text-white'>
						Publications
					</button>
				</div>

				<div className='mt-10 grid grid-cols-3 gap-5'>
					{userPosts.map((item, index) => (
						<div
							key={index}
							className='aspect-square relative group cursor-pointer'
						>
							<Link to={`/p/${item._id}`}>
								<img
									src={`http://localhost:4040/${item.picture}`}
									alt={`Post ${index + 1}`}
									className='object-cover w-full h-full transition-transform transform group-hover:scale-105 rounded'
								/>
							</Link>
						</div>
					))}
				</div>
			</div>
			<SubscribersModal
				isOpen={isOpenSubscribersModal}
				onClose={closeSubscribersModal}
				users={subscribersUser}
			/>

			<SubscriptionsModal
				isOpen={isOpenSubscriptions}
				onClose={closeSubscriptionModal}
				users={subscriptionUsers}
			/>

			<EditProfileModal
				isOpen={isEditModalOpen}
				onClose={closeEditModal}
				user={user}
			/>
			<SettingsModal
				isOpen={isSettingsModalOpen}
				onClose={closeSettingsModal}
			/>
		</div>
	);
};

export default Profile;
