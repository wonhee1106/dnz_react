import {
    faBook,
    faList,
    faLock,
    faPen,
    faQuestion,
} from '@fortawesome/free-solid-svg-icons'
import styles from './Mypage.module.css'
import MyPageItem from 'components/MyPage'
import { faBookmark, faUser } from '@fortawesome/free-regular-svg-icons'
import Profile from './Profile/Profile'
import Bookmark from './Bookmark/Bookmark'
import StoreManagement from './StoreManagement/StoreManagement'
import { faStore } from '@fortawesome/free-solid-svg-icons'
import MyDining from 'pages/MyDining/MyDining'
import Withdrawal from './Withdrawal/Withdrawal'
import { useAuthStore } from 'utils/store' // Assume you have user information here

function Mypage() {
    // Assume we get userProfile from the authentication store
    const userProfile = useAuthStore((state) => state.userProfile);

    return (
        <div className={styles.container}>
            <div className={styles.mypageBox}>
                <h3>마이페이지</h3>

                <MyPageItem
                    icon={faUser}
                    title={'프로필'}
                    element={<Profile />}
                />

                <MyPageItem
                    icon={faPen}
                    title={'리뷰'}
                    element={<div>asdfsdf</div>}
                />

                <MyPageItem
                    icon={faList}
                    title={'예약내역'}
                    element={<MyDining />}
                />

                <MyPageItem
                    icon={faBookmark}
                    title={'북마크 '}
                    element={<Bookmark />}
                />

                <MyPageItem
                    icon={faStore}
                    title={'가게 관리'}
                    element={<StoreManagement />}
                />

                <MyPageItem
                    icon={faQuestion}
                    title={'회원탈퇴'}
                    element={<Withdrawal userProfile={userProfile} />}
                />


                <MyPageItem
                    icon={faLock}
                    title={'보안 관리'}
                    element={<div>asdfsdf</div>}
                />
            </div>
        </div>
    )
}

export default Mypage;
