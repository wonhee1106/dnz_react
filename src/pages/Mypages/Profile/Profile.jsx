import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import styles from './Profile.module.css';
import img from '../../../img/defaultImages.png';
import { api } from '../../../config/config';
import { useAuthStore } from 'utils/store';
import Swal from 'sweetalert2';

const Profile = () => {
    const navigate = useNavigate();
    const { token, setToken } = useAuthStore((state) => ({
        token: state.token,
        setToken: state.setToken,
    }));

    const handleBack = () => {
        setIsEditable(false);
    };

    const serverBaseUrl = "http://192.168.1.10";

    const [profileImage, setProfileImage] = useState(img);
    const [userProfile, setUserProfile] = useState({
        userId: '',
        userName: '',
        userPassword: '',
        userBirthDate: '',
        userPhoneNumber: '',
        userEmail: ''
    });

    const [modifiedFields, setModifiedFields] = useState({});
    const [isEditable, setIsEditable] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (!token) {
            navigate('/login');
        } else {
            const decodedToken = jwtDecode(token);
            const userIdFromToken = decodedToken.sub;
            setUserProfile((prevState) => ({
                ...prevState,
                userId: userIdFromToken,
            }));
            fetchUserProfile(userIdFromToken);
        }
    }, [navigate, token]);

    const fetchUserProfile = (userId) => {
        api.get(`/members/userProfile/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(resp => {
                setUserProfile(resp.data);
                if (resp.data.imageUrl) {
                    setProfileImage(`${serverBaseUrl}${resp.data.imageUrl}`);
                } else {
                    setProfileImage(img);
                }
            })
            .catch(error => {
                console.error('Error fetching user profile:', error);
                Swal.fire({
                    icon: 'error',
                    title: '오류 발생',
                    text: '프로필 정보를 가져오는 데 실패했습니다.',
                });
            });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserProfile((prev) => ({ ...prev, [name]: value }));
        setModifiedFields((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleProfileUpdate = () => {
        if (Object.keys(modifiedFields).length === 0) {
            Swal.fire({
                icon: 'warning',
                title: '변경된 값이 없습니다.',
                text: '수정할 항목을 입력해주세요.',
            });
            return;
        }

        api.put(`/members/update`, modifiedFields, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then(() => {
                Swal.fire({
                    icon: 'success',
                    title: '프로필 변경 완료!',
                    text: '프로필이 성공적으로 업데이트되었습니다.',
                });
                setIsEditable(false);
            })
            .catch((error) => {
                console.error('Error updating profile:', error);
                Swal.fire({
                    icon: 'error',
                    title: '오류 발생',
                    text: '프로필 업데이트 중 오류가 발생했습니다. 다시 시도해 주세요.',
                });
            });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('profileImage', file);

            api.post('/members/updateProfileImage', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => {
                    setProfileImage(`${serverBaseUrl}${response.data}`);
                    Swal.fire({
                        icon: 'success',
                        title: '업데이트 완료!',
                        text: '프로필 이미지가 성공적으로 업데이트되었습니다.',
                    });
                })
                .catch((error) => {
                    console.error('Error uploading profile image:', error);
                    Swal.fire({
                        icon: 'error',
                        title: '오류 발생',
                        text: '프로필 이미지를 업로드하는 데 실패했습니다.',
                    });
                });
        }
    };

    const handleEditToggle = () => {
        setIsEditable((prev) => !prev);
    };

    const handleAccountDeletion = () => {
        const userId = userProfile.userId;
        const userSeq = userProfile.userSeq;

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
                        setToken(null);
                        navigate('/login');
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
        <div className={styles.container}>
            <div className={styles.imageContainer} onClick={() => fileInputRef.current.click()}>
                <img src={profileImage} alt="Profile" />
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                />
            </div>

            <ProfileForm
                userProfile={userProfile}
                handleInputChange={handleInputChange}
                handleProfileUpdate={handleProfileUpdate}
                isEditable={isEditable}
                handleEditToggle={handleEditToggle}
                handleBack={handleBack} // 뒤로가기 함수 전달
            />

            <button onClick={handleAccountDeletion} className={styles.deleteButton}>
                회원 탈퇴
            </button>
        </div>
    );
};

const ProfileForm = ({ userProfile, handleInputChange, handleProfileUpdate, isEditable, handleEditToggle, handleBack }) => {
    return (
        <div className={styles.profileDetails}>
            <div className={styles.field}>
                <p>아이디:</p>
                <input
                    type="text"
                    name="userId"
                    value={userProfile.userId}
                    readOnly
                />
            </div>
            <div className={styles.field}>
                <p>닉네임:</p>
                <input
                    type="text"
                    name="userName"
                    value={userProfile.userName}
                    onChange={handleInputChange}
                    disabled={!isEditable}
                />
            </div>
            <div className={styles.field}>
                <p>생년월일:</p>
                <input
                    type="text"
                    name="userBirthDate"
                    value={userProfile.userBirthDate}
                    onChange={handleInputChange}
                    disabled={!isEditable}
                />
            </div>
            <div className={styles.field}>
                <p>핸드폰 번호:</p>
                <input
                    type="text"
                    name="userPhoneNumber"
                    value={userProfile.userPhoneNumber}
                    onChange={handleInputChange}
                    disabled={!isEditable}
                />
            </div>
            <div className={styles.field}>
                <p>이메일:</p>
                <input
                    type="text"
                    name="userEmail"
                    value={userProfile.userEmail}
                    onChange={handleInputChange}
                    disabled={!isEditable}
                />
            </div>

            {/* 비밀번호는 수정할 때만 보이도록 설정 */}
            {isEditable && (
                <div className={styles.field}>
                    <p>비밀번호:</p>
                    <input
                        type="password"
                        name="userPassword"
                        value={userProfile.userPassword}
                        onChange={handleInputChange}
                    />
                </div>
            )}

            <div className={styles.buttonContainer}>
                {isEditable ? (
                    <>
                        <button className={styles.backButton} onClick={handleBack}>뒤로가기</button>
                        <button className={styles.editButton} onClick={handleProfileUpdate}>프로필 변경</button>
                    </>
                ) : (
                    <button className={styles.editButton} onClick={handleEditToggle}>수정하기</button>
                )}
            </div>
        </div>
    );
};


export default Profile;
