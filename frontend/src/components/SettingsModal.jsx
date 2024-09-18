import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';

const SettingsModal = ({ isOpen, onClose }) => {
	const navigate = useNavigate();

	const onLogout = () => {
		localStorage.clear();
		navigate('/login');
	};

	return (
		<Modal
			isOpen={isOpen}
			onRequestClose={onClose}
			className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-70'
			overlayClassName='fixed inset-0'
			ariaHideApp={false}
		>
			<div className='bg-gray-800 text-white w-[90%] max-w-md p-6 rounded-lg shadow-lg'>
				<div className='space-y-4 text-center'>
					<button
						className='w-full py-2 text-lg bg-gray-700 rounded-md hover:bg-gray-600'
						onClick={() => onClose(false)}
					>
						Настройки и конфиденциальность
					</button>
					<button
						className='w-full py-2 text-lg bg-red-500 rounded-md hover:bg-red-600'
						onClick={onLogout}
					>
						Выйти
					</button>
					<button
						className='w-full py-2 text-lg bg-gray-700 rounded-md hover:bg-gray-600'
						onClick={() => onClose(false)}
					>
						Отмена
					</button>
				</div>
			</div>
		</Modal>
	);
};

export default SettingsModal;
