import React from 'react';
import { api } from '../../../config/config'; // API 설정을 가져옵니다.
import Swal from 'sweetalert2'; // SweetAlert2 라이브러리를 가져옵니다.
import { useAuthStore } from 'utils/store'; // 상태 관리 저장소를 가져옵니다.
import { useNavigate } from 'react-router-dom'; // 라우팅을 위한 navigate를 가져옵니다.

const Withdrawal = ({ userId }) => {
    const { token, setToken } = useAuthStore((state) => ({
        token: state.token,
        setToken: state.setToken,
    }));

    const navigate = useNavigate();

    const handleAccountDeletion = (userId) => {
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
                api.delete(`/members/delete/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Authorization 헤더에 토큰 추가
                    },
                })
                .then(() => {
                    Swal.fire('탈퇴 완료!', '회원 탈퇴가 완료되었습니다.', 'success');
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
            <h4>회원 탈퇴</h4>
            <button onClick={() => handleAccountDeletion(userId)}>탈퇴하기</button>
        </div>
    );
};

export default Withdrawal;
