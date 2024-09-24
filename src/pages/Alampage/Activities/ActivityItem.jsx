import React from 'react';
import styles from './ActivityItem.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faEnvelopeOpen } from '@fortawesome/free-regular-svg-icons';

const ActivityItem = ({ activity, onClick }) => {
    return (
        <li
            className={`${styles.activityItem} ${activity.isRead ? styles.read : styles.unread}`}
            onClick={() => onClick(activity.activityId)}
        >
            <FontAwesomeIcon icon={activity.isRead ? faEnvelopeOpen : faEnvelope} className={styles.activityIcon} />
            <div className={styles.activityDescription}>
                {activity.activityDescription} - {new Date(activity.activityDate).toLocaleString()}
            </div>
        </li>
    );
};

export default ActivityItem;
