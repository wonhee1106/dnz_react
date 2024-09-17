import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import styles from './Profile.module.css';
import img from '../../../img/img2.png';
import { api } from '../../../config/config';
import { useAuthStore } from 'utils/store';

const Profile = () => {
    const navigate = useNavigate();
    const { token } = useAuthStore((state) => ({
        token: state.token,
    }));
    const [uploadImage, setUploadImage] = useState(null);
    const [userInfo, setUserInfo] = useState({
        userId: '',
        userName: '',
        userPw: '',
        userBirthDate: '',
        userPhoneNumber: '',
        userEmail: ''
    });

    const fileInput = useRef(null);

    useEffect(() => {
        console.log('Token:', token);
        if (!token) {
            navigate('/login'); 
        } else {
            const decodedToken = jwtDecode(token);
            const userIdFromToken = decodedToken.sub; 
            setUserInfo((prevState) => ({
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
            console.log('API Response Data:', resp.data);
            setUserInfo(resp.data); // 응답 데이터로 상태 업데이트
        })
        .catch(error => {
            console.error('Error fetching user profile:', error);
        });
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploadImage(URL.createObjectURL(file)); // 업로드된 파일의 URL 생성
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.img} onClick={() => fileInput.current.click()}>
                <img src={uploadImage || img} alt="Profile" />
                <input type="file" ref={fileInput} onChange={handleFileUpload} style={{ display: 'none' }} />
            </div>

            <ProfileView userInfo={userInfo} />
        </div>
    );
};

const ProfileView = ({ userInfo }) => {
    console.log('User Info in ProfileView:', userInfo);

    return (
        <div className={styles.profileDetails}>
            <div className={styles.myname}>
                <p>닉네임: {userInfo.userName}</p>
            </div>
            <div className={styles.introduction}>
                <p>생년월일: {userInfo.userBirthDate}</p>
            </div>
            <div className={styles.location}>
                <p>핸드폰 번호: {userInfo.userPhoneNumber}</p>
            </div>
            <div className={styles.email}>
                <p>이메일: {userInfo.userEmail}</p>
            </div>
            <div className={styles.email}>
                <p>아이디: {userInfo.userId}</p>
            </div>
            <div className={styles.email}>
                <p>비밀번호: {userInfo.userPw}</p>
            </div>
        </div>
    );
};

export default Profile;
