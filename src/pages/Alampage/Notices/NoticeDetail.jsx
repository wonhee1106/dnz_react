import React, { useState, useRef } from 'react';
import Modal from 'react-modal';
import styles from './NoticeDetail.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import axios from 'axios';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '50%',
        maxWidth: '800px',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        maxHeight: '80vh',
        overflowY: 'auto',
        zIndex: 2000,
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        zIndex: 1500,
    },
};

const NoticeDetail = ({
    notice,
    isOpen,
    onRequestClose,
    fetchNotices,
    serverUrl,
    jwtToken,
    setIsEditMode,
    setSelectedPost,
    editorRef
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(notice.title.replace(/\[.*?\]/, '').trim());
    const [content, setContent] = useState(notice.content);
    const [category, setCategory] = useState(notice.category || '공지');

    // Markdown을 HTML로 변환하고 이미지 렌더링
    const getSanitizedContent = (content) => {
        const rawHtml = marked(content || "내용이 없습니다.", {
            renderer: new marked.Renderer()
        });

        // 이미지에 인라인 스타일을 추가하여 크기 조정
        const sanitizedHtml = rawHtml.replace(/<img/g, '<img style="max-width:100%;height:auto;display:block;margin:0 auto;"');

        return { __html: DOMPurify.sanitize(sanitizedHtml) };
    };

    // 에디터 내용 변경 함수
    const handleEditorChange = () => {
        const updatedContent = editorRef.current?.getInstance()?.getMarkdown() || '';
        setContent(updatedContent);
    };

    // 수정 완료 핸들러
    const handleEditSubmit = async () => {
        try {
            const formattedTitle = `[ ${category || '공지'} ] ${title}`;

            const formData = new FormData();
            formData.append('post', new Blob([JSON.stringify({
                title: formattedTitle,
                content: content,
                category: category || '공지',
            })], { type: 'application/json' }));

            await axios.put(`${serverUrl}/api/posts/${notice.postId}`, formData, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                }
            });

            await fetchNotices();
            onRequestClose();
        } catch (error) {
            console.error("게시물 수정 중 오류 발생:", error);
        }
    };

    // 삭제 핸들러
    const handleDelete = async () => {
        try {
            await axios.delete(`${serverUrl}/api/posts/${notice.postId}`, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                },
            });
            await fetchNotices();
            onRequestClose();
        } catch (error) {
            console.error("게시물 삭제 중 오류 발생:", error);
        }
    };

    // 수정 버튼 클릭 시
    const handleEditClick = () => {
        setIsEditMode(true);
        setIsEditing(true);
    };

    // 모달 닫기 시 상태 초기화
    const handleClose = () => {
        onRequestClose();
        setIsEditing(false);
        setSelectedPost(null);
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={handleClose}
            style={customStyles}
            contentLabel="게시물 세부내용"
        >
            <button onClick={handleClose} className={styles.closeIconButton}>
                <FontAwesomeIcon icon={faTimes} className={styles.closeIcon} />
            </button>
            {isEditing ? (
                <div>
                    <h2>글 수정하기</h2>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className={styles.categorySelect}>
                        <option value="공지">공지</option>
                        <option value="이벤트">이벤트</option>
                    </select>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={styles.titleInput}
                    />
                    <Editor
                        ref={editorRef}
                        previewStyle="vertical"
                        height="300px"
                        initialEditType="wysiwyg"
                        useCommandShortcut={false}
                        onChange={handleEditorChange}
                        initialValue={content}
                        hooks={{
                            addImageBlobHook: async (blob, callback) => {
                                const formData = new FormData();
                                formData.append('file', blob);
                        
                                try {
                                    const response = await axios.post(`${serverUrl}/api/posts/upload`, formData, {
                                        headers: {
                                            Authorization: `Bearer ${jwtToken}`,
                                            'Content-Type': 'multipart/form-data',
                                        },
                                    });
                                    const imageUrl = response.data.url;
                                    callback(imageUrl);
                                } catch (error) {
                                    console.error('이미지 업로드 중 오류 발생:', error);
                                }
                            },
                        }}
                    />
                    <div className={styles.modalButtons}>
                        <button onClick={handleEditSubmit} className={styles.submitButton}>수정 완료</button>
                        <button onClick={handleClose} className={styles.closeButton}>닫기</button>
                    </div>
                </div>
            ) : (
                <div>
                    <h2>{notice.title}</h2>
                    <div
                        dangerouslySetInnerHTML={getSanitizedContent(notice.content)}
                        className={styles.noticeContent}
                    />
                    <div className={styles.noticeDates}>
                        <p><strong>작성일:</strong> {notice.createdAt ? new Date(notice.createdAt).toLocaleString() : '날짜 정보 없음'}</p>
                        <p><strong>수정일:</strong> {notice.updatedAt ? new Date(notice.updatedAt).toLocaleString() : '날짜 정보 없음'}</p>
                    </div>
                    <div className={styles.bottomButtons}>
                        <button onClick={handleEditClick} className={styles.actionButton}>수정</button>
                        <button onClick={handleDelete} className={styles.actionButton}>삭제</button>
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default NoticeDetail;
