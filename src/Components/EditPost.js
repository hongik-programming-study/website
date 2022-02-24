// react
import React, { useState, useRef, useEffect } from "react";

// redux
import { editPost, getPost } from "../reducers/slices/postSlice";
import axiosInstance from "../utils/axiosInstance";
import { useDispatch } from "react-redux";

// styled-components
import GlobalStyle from "../Styles/Globalstyle.js";
import { WriteContainer, TagsInput, Input } from "../Styles/theme";

// toast-ui editor
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/react-editor";

// react-router-dom
import { useParams, useNavigate } from "react-router-dom";

// api_url
import { API_URL } from "../config";

const EditPost = () => {
  // config
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const boardId = useParams().boardId;
  const postId = useParams().postId;

  // inputs
  const editorRef = useRef(null);

  const [title, setTitle] = useState("");
  const [tags, setTags] = useState([]);
  const [initText, setInitText] = useState("");

  const [currentTag, setCurrentTag] = useState("");

  // 태그 입력
  const onTagPush = () => {
    if (!tags.includes(currentTag)) setTags([...tags, currentTag]);
    setCurrentTag("");
  };

  // post 제출
  const postSubmit = async e => {
    e.preventDefault();

    const instance = editorRef.current.getInstance().getMarkdown();

    // 이미지 목록 생성
    const findImage = /!\[Image\]\([A-Za-z0-9\/:\-.]+\)/gi;
    let imgUrls =
      instance.match(findImage) &&
      instance.match(findImage).map(url => url.split("/").pop());
    imgUrls = imgUrls
      ? imgUrls.map(imgUrl => imgUrl.substring(0, imgUrl.length - 1))
      : [];

    const postData = {
      title: title,
      tags: tags,
      content: instance, //setPost에서 content 수정하면 바로 반영안되는 문제로 이렇게 해결함
      images: imgUrls,
      type: boardId,
    };

    try {
      await dispatch(editPost({ postId, postData }));
      navigate("/");
    } catch (e) {
      alert(e.msg);
    }
  };

  // 페이지 들어왔을 때, post데이터 가져오기
  useEffect(async () => {
    try {
      const res = await dispatch(getPost(postId));
      const data = res.payload.responseInfo;
      setTitle(data.title);
      setText(data.content);
      setInitText(data.tags);
      console.log(data.content);
    } catch (e) {
      alert("error");
    }
  }, []);

  // addImageBlobHook
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.getInstance().removeHook("addImageBlobHook");
      editorRef.current
        .getInstance()
        .addHook("addImageBlobHook", (blob, callback) => {
          (async function () {
            let formData = new FormData();
            formData.append("image", blob);

            const response = await axiosInstance.post(
              `${API_URL}/v1/file/upload`,
              formData,
              { header: { "content-type": "multipart/formdata" } },
            );

            const url = `${API_URL}${response.data.data.imageURL}`;
            callback(url, "Image");
          })();
          return false;
        });
    }
    return () => {};
  }, [editorRef]);

  return (
    <WriteContainer>
      <GlobalStyle />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "80%",
          margin: "3rem",
        }}
      >
        {/* 글 제목 */}
        <Input
          type="text"
          name="email"
          onChange={e => setTitle(e.target.value)}
          placeholder="Title"
          value={title}
        />
        {/* 내용 */}
        {text && (
          <Editor
            initialValue={initText}
            previewStyle="vertical"
            height="800px"
            initialEditType="markdown"
            useCommandShortcut={true}
            ref={editorRef}
          />
        )}
        {/* 태그 제출 */}
        <div className="tagCon">
          <TagsInput
            className="tagsInput"
            placeholder="Tags"
            onChange={e => setCurrentTag(e.target.value)}
            value={currentTag}
            onKeyPress={e => {
              if (e.key === "Enter") {
                onTagPush();
              }
            }}
          />
          {/* 태그 목록 */}
          <div className="tagArea flex flex-ai-c">
            {tags.map((tag, id) => (
              <div
                key={tag.name}
                className="postTag"
                onClick={() => {
                  setTags(tags.filter(t => t !== tag));
                }}
              >
                {tag.name}
              </div>
            ))}
          </div>
        </div>
        {/* post 제출 */}
        <div className="submitArea flex flex-jc-e">
          <button className="linkBtn black" onClick={postSubmit}>
            작성 완료
          </button>
        </div>
      </div>
    </WriteContainer>
  );
};

export default EditPost;
