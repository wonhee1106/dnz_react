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

function Mypage() {
    return (
        <div className={styles.container}>
            <div className={styles.mypageBox}>
                <p>마이페이지</p>
                <MyPageItem
                    icon={faUser}
                    title={'프로필'}
                    element={
                        <div>
                            <Profile />
                        </div>
                    }
                />

                <MyPageItem
                    icon={faPen}
                    title={'리뷰'}
                    element={<div>asdfsdf</div>}
                />

                <MyPageItem
                    icon={faList}
                    title={'예약내역'}
                    element={
                        <div>
                            <MyDining />
                        </div>
                    }
                />
                <MyPageItem
                    icon={faBookmark}
                    title={'북마크 '}
                    element={
                        <div>
                            <Bookmark />
                        </div>
                    }
                />
                <MyPageItem
                    icon={faStore}
                    title={'가게 관리'}
                    element={
                        // 가게 관리 추가
                        <div>
                            <StoreManagement />
                        </div>
                    }
                />
                <MyPageItem
                    icon={faQuestion}
                    title={'지원 및 도움'}
                    element={<div>asdfsdf</div>}
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

export default Mypage
