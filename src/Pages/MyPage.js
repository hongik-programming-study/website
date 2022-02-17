import React, { useEffect, useState } from "react";

// react-router-dom
import { Link, Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

// redux
import { useDispatch, useSelector } from "react-redux";
import { getProfile, editProfile } from "../reducers/slices/userSlice";
import { updateUser } from "../reducers/slices/authSlice";

// styled-components
import styled from "styled-components";
import GlobalStyle from "../Styles/Globalstyle.js";
import { Button, Input, Container } from "../Styles/theme.js";

// icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";

// axios with auth
import axiosInstance from "../utils/axiosInstance";

import { API_URL } from "../config";

import noneProfileImg from "../images/none_profile_image.png";

// style
const MyPageWrapper = styled(Container)`
  & .profileImgArea {
    margin-right: 1.5rem;
    & .EditbuttonArea {
      margin-top: 0.5rem;
    }
  }

  & .nicknameArea {
    margin-bottom: 1rem;
  }

  & .introductionArea {
    color: #aaa;

    & h2 {
      font-weight: 400;
      margin-right: 5px;
    }

    & .editIcon {
      padding: 5px;
      color: #333;
      transition: all 0.3s;
      &:hover {
        color: var(--point-color-orange);
      }
    }
  }

  & #infoArea {
    margin-top: 5%;

    & .element {
      display: flex;

      & .sub {
        font-size: 20px;
        font-weight: bold;
      }

      & .result {
        font-size: 20px;
      }
    }
  }
`;

const MyPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(state => state.auth.user);
  const profileInfo = useSelector(state => state.user.profile);

  const [isNicknameChange, setIsNicknameChange] = useState(false);
  const [isIntroduceChange, setIsIntroduceChange] = useState(false);

  const [newNicknameValue, setNewNicknameValue] = useState("");
  const [newIntroduceValue, setNewIntroduceValue] = useState("");

  useEffect(() => {
    dispatch(getProfile(user.userId));
  }, []);

  const buttonClick = () => alert("버튼 클릭 임시 함수");

  const onChangeNickname = e => {
    setNewNicknameValue(e.currentTarget.value);
  };
  const onChangeIntroduce = e => setNewIntroduceValue(e.currentTarget.value);

  const changeNickname = async e => {
    e.preventDefault();
    const userData = {
      nickname: newNicknameValue,
      introduction: profileInfo.introduction,
      personalUrl: profileInfo.personalUrl,
      infoByEmail: profileInfo.infoByEmail,
      infoByWeb: profileInfo.infoByWeb,
    };
    await dispatch(editProfile({ userId: user.userId, userData }));
    await dispatch(updateUser());
    setIsNicknameChange(false);
  };
  const changeIntroduce = async e => {
    e.preventDefault();
    const userData = {
      nickname: profileInfo.nickname,
      introduction: newIntroduceValue,
      personalUrl: profileInfo.personalUrl,
      infoByEmail: profileInfo.infoByEmail,
      infoByWeb: profileInfo.infoByWeb,
    };
    await dispatch(editProfile({ userId: user.userId, userData }));
    await dispatch(updateUser());
    // try {
    //   const res = await axiosInstance.put(
    //     `${API_URL}/v1/users/${user.userId}`,
    //     data,
    //   );
    //   console.log(res);
    // } catch (e) {
    //   console.log(e.response);
    // }
    setIsIntroduceChange(false);
  };

  return (
    <MyPageWrapper>
      <GlobalStyle />
      {/* User Info */}
      <div className="flex flex-jc-c">
        <div className="profileImgArea">
          {/* profile image */}
          <div>
            {user.profileImage === "N" ? (
              <img src={noneProfileImg} width="100" height="100" />
            ) : (
              <img src={user.profileImage} width="100" height="100" />
            )}
          </div>
          <div className="EditbuttonArea">
            {/* profile image edit button */}
            <div
              className="linkBtn"
              style={{ marginBottom: "3%" }}
              onClick={buttonClick}
            >
              사진 변경
            </div>
            <Link to="" className="linkBtn" onClick={buttonClick}>
              사진 삭제
            </Link>
          </div>
        </div>
        {/* 자기소개 */}
        <div>
          <div className="nicknameArea">
            {!isNicknameChange ? (
              <>
                <h1>{user.nickname}</h1>
                <div
                  className="editIcon"
                  onClick={() => setIsNicknameChange(true)}
                >
                  <FontAwesomeIcon icon={faPen} />
                </div>
              </>
            ) : (
              <form onSubmit={changeNickname}>
                <Input
                  type="text"
                  name="nickname"
                  onChange={onChangeNickname}
                />
                <button type="submit">확인</button>
              </form>
            )}
          </div>
          <div className="introductionArea flex flex-ai-c">
            {!isIntroduceChange ? (
              <>
                <h2>자기소개</h2>{" "}
                <div
                  className="editIcon"
                  onClick={() => setIsIntroduceChange(true)}
                >
                  <FontAwesomeIcon icon={faPen} />
                </div>
              </>
            ) : (
              <form onSubmit={changeIntroduce}>
                <Input
                  type="text"
                  name="nickname"
                  onChange={onChangeIntroduce}
                />
                <button type="submit">확인</button>
              </form>
            )}
          </div>
        </div>
      </div>
      {/* 추가코드 이 밑으로 입력 */}
      <div id="infoArea">
        <div className="element">
          <span className="sub">이메일</span>
          <span className="result">{user.sub}</span>
        </div>
        <div className="element">
          <span className="sub">이메일 수신 설정</span>
          <input type="checkbox" />
        </div>
        <div className="flex flex-jc-c">
          <Link to="/leave" className="linkBtn">
            회원 탈퇴
          </Link>
        </div>
      </div>
    </MyPageWrapper>
  );
};

export default MyPage;
