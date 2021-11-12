import { useEffect, useReducer, useState } from "react";
import styled from "styled-components";
import { getMyPostNames } from "../../api/post";
import { PlacePlus, Unselect } from "../../assets";
import { PostType } from "../../Shared/type";
import { theme } from "../../styles/theme";

type State =
  | {
      _t: null;
    }
  | {
      _t: "make";
    }
  | {
      _t: "theme";
      selected: number;
    };

type Action =
  | {
      _t: "make";
    }
  | {
      _t: "select";
      selected: number;
    };

const reducer: React.Reducer<State, Action> = (prevState, action) => {
  switch (action._t) {
    case "make":
      return {
        _t: "make",
      };
    case "select":
      return {
        _t: "theme",
        selected: action.selected,
      };
  }
};

const SaveModal = () => {
  const [state, dispatch] = useReducer(reducer, {
    _t: null,
  });
  const [posts, setPosts] = useState<PostType[] | []>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await getMyPostNames();
      setPosts(data.posts);
    };
    fetchPosts();
  }, []);

  return (
    <Wrapper>
      <div className="background" />
      <div className="modal">
        <div>테마에 장소 추가</div>
        <div>저장</div>

        <div className="list">
          <Theme>
            <PlacePlus />
            <div>새로운 테마 만들기</div>
          </Theme>

          {posts.map((post) => (
            <Theme key={post.postId}>
              <Unselect />
              <div>{post.title}</div>
            </Theme>
          ))}
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 500;
  height: 100vh;
  width: 100%;
  .modal {
    position: fixed;
    bottom: 0;
    left: 0;
    background-color: #fff;
    width: 100%;
    height: calc(100vh / 3 * 2);
    z-index: 500;
    box-shadow: 0 0 1.6rem rgba(0, 0, 0, 0.15);
    border-radius: 2rem 2rem 0 0;
    padding: 0 2rem;
    box-sizing: border-box;
    & > div:nth-child(1) {
      width: 100%;
      margin-top: 2.9rem;
      text-align: center;
      color: ${theme.color.gray7};
      font-weight: 500;
      font-size: 1.6rem;
      line-height: 135%;
    }
    & > div:nth-child(2) {
      position: absolute;
      right: 2.1rem;
      top: 2.9rem;
      font-weight: 700;
      font-size: 1.6rem;
      line-height: 135%;
      color: ${theme.color.orange};
    }
    .list {
      overflow-y: scroll;
      height: 100%;
      margin-top: 1.8rem;
      padding-bottom: 7.7rem;
      box-sizing: border-box;
      & > div:not(:first-child) {
        border-top: 0.1rem solid ${theme.color.gray1_7};
      }
    }
  }
`;

const Theme = styled.div`
  display: flex;
  align-items: center;
  padding: 1.8rem 0;
  font-weight: 500;
  font-size: 1.5rem;
  line-height: 135%;
  & > div {
    margin-left: 1rem;
  }
`;

export default SaveModal;
