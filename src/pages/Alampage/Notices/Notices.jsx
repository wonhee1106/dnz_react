import React from 'react';
import styles from './Notices.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Pagination from '@mui/material/Pagination';

const Notices = ({ notices, loading, error, currentPage, totalPages, onPageChange, onNoticeClick, onOpenModal }) => {
    return (
        <div className={styles.noticesContainer}>
            <button onClick={onOpenModal} className={styles.writeButton}>
                글쓰기
            </button>
            {loading ? (
                <p>공지사항을 불러오는 중...</p>
            ) : error ? (
                <p>{error}</p>
            ) : notices.length === 0 ? (
                <p>공지사항이 없습니다.</p>
            ) : (
                <>
                    <ul className={styles.noticeList}>
                        {notices.slice((currentPage - 1) * 5, currentPage * 5).map((notice, index) => (
                            <li
                                key={notice.postId || index}
                                className={styles.noticeItem}
                                onClick={() => onNoticeClick(notice)}
                            >
                                <div className={styles.noticeTitle}>{notice.title}</div>
                                <div className={styles.noticeDate}>
                                    {notice.updatedAt ? new Date(notice.updatedAt).toLocaleString() : '날짜 정보 없음'}
                                </div>
                            </li>
                        ))}
                    </ul>
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={(event, newPage) => onPageChange(newPage)}
                        color="primary"
                        className={styles.pagination}
                    />
                </>
            )}
        </div>
    );
};

export default Notices;
