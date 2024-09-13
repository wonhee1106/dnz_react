import styles from './Mypage.module.css';

function Mypage() {
    return (
        <div className={styles.container}>
            {/* 상단 헤더 */}
            <header className={styles.header}>
                <div className={styles.userInfo}>
                    <img src="https://via.placeholder.com/80" alt="Profile" className={styles.profileImage} />
                    <div className={styles.userDetails}>
                        <h1>John Doe</h1>
                        <p className={styles.email}>johndoe@example.com</p>
                        <button className={styles.editProfileButton}>프로필 수정</button>
                    </div>
                </div>
            </header>

            {/* 메인 콘텐츠 */}
            <div className={styles.mainContent}>
                {/* 최근 활동 섹션 */}
                <section className={styles.activityFeed}>
                    <h2>리뷰</h2>
                    <div className={styles.activityList}>
                        <p>최근 작성한 리뷰: <span>"이 음식점은 정말 좋았습니다!"</span></p>
                        <p>최근 저장한 음식점: <span>"맛있는 피자집"</span></p>
                    </div>
                </section>

                {/* 예약한 음식점 섹션 */}
                <section className={styles.reservedRestaurantsSection}>
                    <h2>예약한 음식점</h2>
                    <div className={styles.collection}>
                        <div className={styles.card}>
                            <img src="https://via.placeholder.com/200" alt="Reserved Restaurant" />
                            <div className={styles.cardContent}>
                                <p>예약한 음식점 1</p>
                                <p className={styles.cardSubtitle}>2024-09-30 19:00</p>
                            </div>
                        </div>
                        <div className={styles.card}>
                            <img src="https://via.placeholder.com/200" alt="Reserved Restaurant" />
                            <div className={styles.cardContent}>
                                <p>예약한 음식점 2</p>
                                <p className={styles.cardSubtitle}>2024-10-01 20:00</p>
                            </div>
                        </div>
                        {/* 추가적으로 예약한 아이템들 */}
                    </div>
                </section>

                {/* 사용자 통계 섹션 */}
                <section className={styles.statsSection}>
                    <h2>사용자 통계</h2>
                    <div className={styles.statsContainer}>
                        <div className={styles.statsItem}>
                            <h3>저장한 음식점</h3>
                            <p>12개</p>
                        </div>
                        <div className={styles.statsItem}>
                            <h3>작성한 리뷰</h3>
                            <p>8개</p>
                        </div>
                    </div>
                </section>


                {/* 도움말 및 지원 섹션 */}
                <section className={styles.helpSection}>
                    <h2>도움말 및 지원</h2>
                    <div className={styles.helpButtons}>
                        <button className={styles.supportButton}>공지사항</button>
                    </div>
                </section>

                {/* 사용자 배지 섹션 */}
                <section className={styles.badgesSection}>
                    <h2>사용자 배지</h2>
                    <div className={styles.badgeList}>
                        <p>활동가 배지: 리뷰 작성 10회 달성!</p>
                    </div>
                </section>

         
            </div>
        </div>
    );
}

export default Mypage;
