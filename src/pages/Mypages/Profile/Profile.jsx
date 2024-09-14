import styles from './Profile.module.css'
import img from '../../../img/img2.png'
import { useRef, useState } from 'react';

const Profile = () => {
    const [uploadImage, setUploadImage] = useState();
    const fileInput = useRef(null);

    return (
        <div className={styles.container}>

            <div className={styles.img} >
                <img src={img} />
                <input type="file" />
            </div>
            <div className={styles.myname}>
                <p>닉네임</p>
            </div>

            <div className={styles.introduction}>
                <input type="text" placeholder='소개글' />
            </div>
            <div className={styles.location}>
                <input type="text" placeholder='활동지역' />
            </div>
            <div className={styles.update}>
                <button> 프로필 수정 </button>
            </div>
        </div>
    )

}

export default Profile