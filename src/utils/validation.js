// utils/validation.js

export const validateSignupInputs = (signup) => {
    const idRegex = /^[a-zA-Z0-9]{6,20}$/;
    const nameRegex = /^[a-zA-Z0-9가-힣]{2,15}$/;
    const phoneRegex = /^\d{10,11}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2}$/;
    const pwRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/;

    const emailAddressArr = ['naver.com', 'gmail.com'];

    if (!idRegex.test(signup.userId)) {
        return "아이디는 6자 이상 20자 이하의 알파벳과 숫자로만 구성되어야 합니다.";
    }

    if (!nameRegex.test(signup.userName)) {
        return "닉네임은 2자 이상 15자로 구성되어야 합니다.";
    }

    if (!phoneRegex.test(signup.userPhoneNumber)) {
        return "핸드폰 번호는 숫자 10자리 또는 11자리로 입력해 주세요.";
    }

    if (!pwRegex.test(signup.userPw)) {
        return "비밀번호는 대소문자, 숫자, 특수문자를 포함하여 8~12자리로 입력해 주세요.";
    }

    if (signup.userPw !== signup.userPwConfirm) {
        return "비밀번호가 일치하지 않습니다.";
    }

    if (signup.userEmail.indexOf("@") !== -1) {
        const emailAddress = signup.userEmail.substring(signup.userEmail.indexOf("@") + 1, signup.userEmail.length);
        if (emailAddressArr.indexOf(emailAddress) === -1) {
            return "유효한 이메일 형식이 아닙니다.";
        }
    } else {
        return "유효한 이메일 형식이 아닙니다.";
    }

    return null;
};
