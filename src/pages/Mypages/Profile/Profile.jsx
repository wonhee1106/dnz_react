import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';  // 'jwt-decode'에서 기본 수입
import styles from './Profile.module.css';
import img from '../../../img/img2.png';
import { api } from '../../../config/config';
import { useAuthStore } from 'utils/store';

const Profile = () => {
    const navigate = useNavigate();
    const { token } = useAuthStore((state) => ({
        token: state.token,
    }));

    const [profileImage, setProfileImage] = useState(null);  // 프로필 이미지 상태
    const [userProfile, setUserProfile] = useState({        // 사용자 프로필 상태
        userId: '',
        userName: '',
        userPassword: '',
        userBirthDate: '',
        userPhoneNumber: '',
        userEmail: ''
    });

    const [modifiedFields, setModifiedFields] = useState({});  // 변경된 필드 상태
    const [isEditable, setIsEditable] = useState(false);  // 입력 필드 수정 가능 상태

    const fileInputRef = useRef(null);  // 파일 입력 참조

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
        })
        .catch(error => {
            console.error('Error fetching user profile:', error);
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserProfile((prev) => ({ ...prev, [name]: value }));

        // 변경된 필드 추적
        setModifiedFields((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    const handleProfileUpdate = () => {
        if (Object.keys(modifiedFields).length === 0) {
            alert('변경된 값이 없습니다.');
            return;
        }

        api.put(`/members/update`, modifiedFields, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        .then(() => {
            alert("Profile updated successfully!");
            setIsEditable(false);  // 수정 완료 후 입력 필드 비활성화
        })
        .catch((error) => {
            console.error('Error updating profile:', error);
        });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(URL.createObjectURL(file)); 
        }
    };

    const handleEditToggle = () => {
        setIsEditable((prev) => !prev);
    };

    return (
        <div className={styles.container}>
            <div className={styles.imageContainer} onClick={() => fileInputRef.current.click()}>
                <img src={profileImage || img} alt="Profile" />
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} style={{ display: 'none' }} />
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
