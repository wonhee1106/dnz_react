import React, { useState, useRef } from 'react';
import Modal from 'react-modal';
import styles from './WriteModal.module.css';
import { Editor } from '@toast-ui/react-editor';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const WriteModal = ({
    isOpen,
    onRequestClose,
    fetchNotices,
    serverUrl,
    jwtToken,
    isEditMode,
    selectedPost,
    setIsEditMode,
    setSelectedPost,
    editorRef
}) => {
    const [editorContent, setEditorContent] = useState(isEditMode && selectedPost ? selectedPost.content : '');
    const [title, setTitle] = useState(isEditMode && selectedPost ? selectedPost.title.replace(/\[.*?\]/, '').trim() : '');
    const [category, setCategory] = useState(isEditMode && selectedPost ? selectedPost.category : '공지');

    // 에디터 내용 변경 함수
    const handleEditorChange = () => {
        const content = editorRef.current?.getInstance()?.getMarkdown() || '';
        setEditorContent(content);
    };

    // 이미지 업로드 함수
    const handleImageUploadInEditor = async (blob, callback) => {
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
    };

    // 글쓰기 또는 수정 완료 버튼 클릭 시 호출
    const handleSubmit = async () => {
        try {
            const formattedTitle = `[ ${category || '공지'} ] ${title}`;
            
            const formData = new FormData();
            formData.append('post', new Blob([JSON.stringify({
                title: formattedTitle,
                content: editorContent,
                category: category || '공지',
            })], { type: 'application/json' }));

            if (isEditMode && selectedPost) {
                // 수정인 경우
                await axios.put(`${serverUrl}/api/posts/${selectedPost.postId}`, formData, {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    }
                });
            } else {
                // 새 게시물 작성인 경우
                await axios.post(`${serverUrl}/api/posts`, formData, {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    }
                });
            }

            await fetchNotices();  // 공지사항 갱신
            onRequestClose();  // 모달 닫기
            setTitle('');
            setEditorContent('');
            editorRef.current?.getInstance().setMarkdown('');
            setCategory('공지');
        } catch (error) {
            console.error("게시물 처리 중 오류 발생:", error);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            style={{
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
            }}
            contentLabel={isEditMode ? '글 수정하기' : '글쓰기 모달'}
        >
            <button onClick={onRequestClose} className={styles.closeIconButton}>
                <FontAwesomeIcon icon={faTimes} className={styles.closeIcon} />
            </button>
            <h2>{isEditMode ? '글 수정하기' : '글쓰기'}</h2>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={styles.categorySelect}>
                <option value="공지">공지</option>
                <option value="이벤트">이벤트</option>
            </select>
            <input
                type="text"
                placeholder="제목을 입력하세요"
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
                hooks={{
                    addImageBlobHook: handleImageUploadInEditor,
                }}
                initialValue={editorContent}
            />

            <div className={styles.modalButtons}>
                <button className={styles.submitButton} onClick={handleSubmit}>
                    {isEditMode ? '수정 완료' : '글쓰기 완료'}
                </button>
                <button className={styles.closeButton} onClick={onRequestClose}>닫기</button>
            </div>
        </Modal>
    );
};

export default WriteModal;
