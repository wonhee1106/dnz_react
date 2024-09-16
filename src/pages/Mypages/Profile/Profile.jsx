import { useEffect } from 'react';
import styles from './Profile.module.css';
import img from '../../../img/img2.png';
import { useRef, useState } from 'react';
import { api } from '../../../config/config';  // api 설정을 불러옵니다

const Profile = () => {
    const [uploadImage, setUploadImage] = useState(null);
    const [isEditing, setIsEditing] = useState(false);  // 수정 모드 관리
    const [userInfo, setUserInfo] = useState({
        userId: '',
        userPw: '',
        userName: '',
        userBirthDate: '', 
        userPhoneNumber: '',
        userEmail: ''
    });

    const fileInput = useRef(null);

    // 서버에서 프로필 정보를 가져오는 함수
    const userList = () => {
        try {
            const token = sessionStorage.getItem('token');  // 세션 스토리지에서 토큰을 가져옴
            api.get(`/auth/userList`, {
                headers: {
                    Authorization: `Bearer ${token}`  // JWT 토큰을 헤더에 추가
                }
            }).then((resp) => {
                setUserInfo(resp.data); 
            }).catch((error) => {
                console.error('Error fetching user list:', error);
            });
        } catch (error) {
            console.error('Error in userList function:', error);
        }
    };
    
    

    // 컴포넌트가 마운트될 때 유저 정보를 가져옵니다.
    useEffect(() => {
        userList();
    }, []);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        setUploadImage(URL.createObjectURL(file));
    };

    const toggleEditMode = () => {
        setIsEditing(!isEditing);  
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserInfo((prevInfo) => ({
            ...prevInfo,
            [name]: value,
        }));
    };

    return (
        <div className={styles.container}>
            <div className={styles.img} onClick={() => fileInput.current.click()}>
                <img src={uploadImage || img} alt="Profile" />
                <input type="file" ref={fileInput} onChange={handleFileUpload} />
            </div>
            
            {isEditing ? (
                <div className={styles.editForm}>
                    <div>
                        <input
                            type="text"
                            name="userId"
                            placeholder="아이디"
                            value={userInfo.userId}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            name="userPw"
                            placeholder="비밀번호"
                            value={userInfo.userPw}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            name="userName"
                            placeholder="이름"
                            value={userInfo.userName}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            name="userBirthDate"
                            placeholder="생년월일"
                            value={userInfo.userBirthDate}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            name="userPhoneNumber"
                            placeholder="전화번호"
                            value={userInfo.userPhoneNumber}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            name="userEmail"
                            placeholder="이메일"
                            value={userInfo.userEmail}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className={styles.update}>
                        <button onClick={toggleEditMode}>프로필 저장</button>
                    </div>
                </div>
            ) : (
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
                    <div className={styles.update}>
                        <button onClick={toggleEditMode}>프로필 수정</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
