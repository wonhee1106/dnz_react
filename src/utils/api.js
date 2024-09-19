// utils/api.js

import axios from 'axios';
import { api } from '../config/config';

export const requestEmailVerification = (email) => {
    return api.post(`/auth/requestEmailVerification/${email}`);
};

export const verifyEmailCode = (email, code) => {
    return api.post(`/auth/verifyEmail`, { userEmail: email, verificationCode: code });
};

export const checkIdExist = (id) => {
    return api.post(`/auth/existId`, { userId: id });
};

export const checkNameExist = (name) => {
    return api.post(`/auth/existName`, { userName: name });
};

export const checkEmailExist = (email) => {
    return api.post(`/auth/existEmail`, { userEmail: email });
};

export const checkPhoneExist = (phone) => {
    return api.post(`/auth/existPhoneNumber`, { userPhoneNumber: phone });
};
