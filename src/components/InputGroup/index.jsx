import styles from "./index.module.css"
import { useEffect, useState } from 'react';

const InputGroup = ({ type, title, description, placeholder="", btnComment, click, keyUp, genderValue }) => {


    const [gender, setGender] = useState('M');

    return (
        <div className={styles.Container}>
            <div className={styles.label}>
                <p>{title}</p>
                <p>{description}</p>
            </div>
            <div className={styles.Content}>
                {type !== "gender" ? 
                    <input type={type} placeholder={placeholder} onKeyUp={(e)=> {keyUp(e.target.value);}} />
                    :
                    <>
                        <label htmlFor="genderM" id={gender == "M" && styles.genderM} onClick={()=>{setGender("M"); genderValue("M");}}  className={styles.gender} >남</label>
                        <label htmlFor="genderF" id={gender == "F" && styles.genderF} onClick={()=>{setGender("F"); genderValue("F");}}  className={styles.gender} >여</label>
                        <input type="radio" id="genderM" name="gender" value="M" checked hidden  />
                        <input type="radio" id="genderF" name="gender" value="F" hidden/>
                    </>
                }
                {btnComment && 
                    <button onClick={()=>click()}>{btnComment}</button>
                }
            </div>
        </div>
    );
}

export default InputGroup;