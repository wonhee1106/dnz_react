import { useAuthStore } from 'utils/store';
import { api } from '../../../config/config';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import styles from './Withdrawal.module.css'
const Withdrawal = ({ userProfile }) => {
    const navigate = useNavigate();
    const { token, setToken } = useAuthStore((state) => ({
        token: state.token,
        setToken: state.setToken,
    }));

    const handleAccountDeletion = () => {
        const userId = userProfile?.userId;  // Optional chaining to avoid errors
        const userSeq = userProfile?.userSeq;

        if (!userId || !userSeq) {
            Swal.fire({
                icon: 'error',
                title: '오류 발생',
                text: '회원 정보를 찾을 수 없습니다. 다시 시도해주세요.',
            });
            return;
        }

        Swal.fire({
            title: '정말로 탈퇴하시겠습니까?',
            text: '탈퇴하시면 모든 데이터가 삭제됩니다.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '예, 탈퇴합니다!',
            cancelButtonText: '아니요, 취소합니다.'
        }).then((result) => {
            if (result.isConfirmed) {
                api.delete(`/members/delete/${userId}/${userSeq}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then(() => {
                    Swal.fire(
                        '탈퇴 완료!',
                        '회원 탈퇴가 완료되었습니다.',
                        'success'
                    );
                    setToken(null);  // 상태 저장소에서 토큰 제거
                    navigate('/login');  // 로그인 페이지로 리다이렉트
                })
                .catch((error) => {
                    console.error('Error deleting account:', error);
                    Swal.fire({
                        icon: 'error',
                        title: '오류 발생',
                        text: '회원 탈퇴 중 오류가 발생했습니다. 다시 시도해 주세요.',
                    });
                });
            }
        });
    };

    return (
        <div>
            <button onClick={handleAccountDeletion}>
                회원 탈퇴
            </button>
        </div>
    );
};

export default Withdrawal