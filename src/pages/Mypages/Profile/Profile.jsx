import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // jwtDecode import 수정
import Swal from 'sweetalert2'; // SweetAlert2 import
import styles from './Profile.module.css';
import img from '../../../img/defaultImages.png';
import { api } from '../../../config/config';
import { useAuthStore } from 'utils/store';

const Profile = () => {
    const navigate = useNavigate();
    const { token } = useAuthStore((state) => ({
        token: state.token,
    }));

    const serverBaseUrl = "http://192.168.1.10";

    const [profileImage, setProfileImage] = useState(img);
    const [userProfile, setUserProfile] = useState({
        userId: '',
        userName: '',
        userPassword: '',
        userBirthDate: '',
        userPhoneNumber: '',
        userEmail: '',
        userSeq: ''
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
                text: '수정 후 저장을 시도해주세요!',
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
                title: '프로필 업데이트 완료!',
                text: '프로필이 성공적으로 업데이트되었습니다.',
            });
            setIsEditable(false);
        })
        .catch((error) => {
            Swal.fire({
                icon: 'error',
                title: '업데이트 오류',
                text: '프로필 업데이트 중 오류가 발생했습니다. 다시 시도해주세요.',
            });
            console.error('Error updating profile:', error);
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
                    title: '이미지 업데이트 완료!',
                    text: '프로필 이미지가 성공적으로 업데이트되었습니다.',
                });
            })
            .catch((error) => {
                Swal.fire({
                    icon: 'error',
                    title: '이미지 업로드 오류',
                    text: '프로필 이미지 업로드 중 오류가 발생했습니다. 다시 시도해주세요.',
                });
                console.error('Error uploading profile image:', error);
            });
        }
    };

    const handleEditToggle = () => {
        setIsEditable((prev) => !prev);
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
            />
        </div>
    );
};

const ProfileForm = ({ userProfile, handleInputChange, handleProfileUpdate, isEditable, handleEditToggle }) => {
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
            <div className={styles.field}>
                <p>비밀번호:</p>
                <input
                    type="password"
                    name="userPassword"
                    value={userProfile.userPassword}
                    onChange={handleInputChange}
                    disabled={!isEditable}
                />
            </div>
            {isEditable ? (
                <button onClick={handleProfileUpdate}>프로필 변경</button>
            ) : (
                <button onClick={handleEditToggle}>수정하기</button>
            )}
        </div>
    );
};

export default Profile;
