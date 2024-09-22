import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faArrowLeft, faUserTie } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import './index.css';
import { useNavigate } from "react-router-dom";

const RegisterType = () => {

    const navigator = useNavigate();
    return (
        <div className="registerTypeContainer">
            
           <h1 className="logo">9900</h1>
           <p className="ment">어느 분께서 사용하실 건가요?</p>
           <div className="select">
                <div id="ownner" onClick={()=>navigator("/OwnnerSignUp")}>
                    <FontAwesomeIcon icon={faUserTie} style={ { width : "80px", height : "80px", printColorAdjust : "orange"}} />
                    <p>점주</p>
                </div>
                <div id="user">
                    <FontAwesomeIcon icon={faUser} style={ { width : "80px", height : "80px", printColorAdjust : "orange"}} />
                    <p>일반 사용자</p>
                </div>
           </div>
           <div className="goBack" onClick={()=>navigator("/")}>
                <FontAwesomeIcon id="back" icon={faArrowLeft} />
                <p>돌아기기</p>
            </div>
        </div>
    )
}

export default RegisterType;