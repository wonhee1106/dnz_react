import { useEffect, useRef, useState } from "react";
import "./style.css";

import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "@emotion/styled";

const Container = styled.div`
    width : 100%;
    background-color: #f6f6f6;
    box-shadow: 0px 16px 15px 0px #0000003a;
    border-radius: 12px;
    padding: 0px 12px;
    border: 0.5px solid #d7d7d7;
    transition : all 1s ease-in;
    margin-bottom : 10px;
`;

const Header = styled.div`
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: center;
    height : 50px;
`;

const Left = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    flex: 1 0 auto;
    gap: 10px;
`;

const Content = styled.div`
    padding : 12px;
    border-top : 0.5px solid #d3d3d3;
`;

export default function MyPageItem({ icon, title, element }) {
    const [isActive, setActive] = useState(false);
    const iconRef = useRef();

    useEffect(()=> {
        if(isActive) {
            iconRef.current.style.rotate = "-180deg";
        }
        else {
            iconRef.current.style.rotate = "0deg";
        }
    }, [isActive])
    return (
            <Container>
                <Header>
                    <Left>
                        <FontAwesomeIcon className="icon" icon={icon} color="#ed3300" style={{transition : "all 0.25s ease-in"}}/>
                        <h3 style={{margin : 0}}>{title}</h3>
                    </Left>
                    <div>
                        <FontAwesomeIcon ref={iconRef} icon={faChevronDown} onClick={() => setActive(!isActive)} color="#ed3300" style={ {transition : "all 0.25s ease-in"} } />
                    </div>
                </Header>
                    {isActive &&
                        <Content>
                            {element}
                        </Content>
                    }
            </Container>
            
    )
}