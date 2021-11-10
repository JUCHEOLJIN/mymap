/* eslint-disable react-hooks/exhaustive-deps */
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import styled from "styled-components";
import { getMyPosts, getSavedPosts } from "../api/post";
import Collection from "../Components/Collection";
import CreateButton from "../Components/CreateButton";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
import { PostType } from "../Shared/type";
import {
  flexCenter,
  gap,
  theme,
  WrapperWithHeaderFooter,
} from "../styles/theme";
import InfiniteScroll from "react-infinite-scroll-component";
import { useRecoilValue } from "recoil";
import { ViewerInfo } from "../Shared/atom";
import { Close, LogoInactive, Thumbnail } from "../assets";
import Mini from "@karrotmarket/mini";

const mini = new Mini();

const Tab = ({
  selectedTab,
  setSelectedTab,
}: {
  selectedTab: "my" | "others";
  setSelectedTab: Dispatch<SetStateAction<"my" | "others">>;
}) => {
  const handleSelectedTab = (tab: "my" | "others") => {
    setSelectedTab(tab);
  };

  return (
    <TabWrapper>
      <TabBtn
        $isSelected={selectedTab === "my"}
        onClick={() => handleSelectedTab("my")}
      >
        내가 만든 테마
      </TabBtn>
      <TabBtn
        $isSelected={selectedTab === "others"}
        onClick={() => handleSelectedTab("others")}
      >
        저장한 테마
      </TabBtn>
    </TabWrapper>
  );
};

const Mypage = () => {
  const [selectedTab, setSelectedTab] = useState<"my" | "others">("my");
  const [isScrollUp, setIsScrollUp] = useState(false);

  // 내 리스트
  const [myPosts, setMyPosts] = useState<PostType[] | []>([]);
  const [myPostsHasMore, setMyPostsHasMore] = useState(true);
  const [myPostPage, setMyPostPage] = useState(1);

  const handleMyPostNext = () => {
    setMyPostPage(myPostPage + 1);
  };
  useEffect(() => {
    const fetchMyPosts = async () => {
      const data = (
        await getMyPosts({
          page: myPostPage,
        })
      ).posts;
      if (data.length < 1) {
        setMyPostsHasMore(false);
        return;
      }
      setMyPosts([...myPosts, ...data]);
    };
    fetchMyPosts();
  }, [myPostPage]);

  const viewerInfo = useRecoilValue(ViewerInfo);

  // 저장한 리스트
  const [savedPosts, setSavedPosts] = useState<PostType[] | []>([]);
  const [savedPostsHasMore, setSavedPostsHasMore] = useState(true);
  const [savedPostPage, setSavedPostPage] = useState(1);
  const handleSavedPostNext = () => {
    setSavedPostPage(savedPostPage + 1);
  };
  useEffect(() => {
    const fetchSavedPosts = async () => {
      const data = (
        await getSavedPosts({
          page: savedPostPage,
        })
      ).posts;
      if (data.length < 1) {
        setSavedPostsHasMore(false);
        return;
      }
      setSavedPosts([...savedPosts, ...data]);
    };
    fetchSavedPosts();
  }, [savedPostPage]);

  useEffect(() => {
    const targetElement = document.querySelector("#mypage-scroll")!;

    const onScroll = () => {
      setIsScrollUp(targetElement.scrollTop > 100);
    };
    targetElement.addEventListener("scroll", onScroll);
    return () => targetElement.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Wrapper id="mypage-scroll" {...{ isScrollUp }}>
      {isScrollUp && (
        <Header className="header-scroll" title={`${viewerInfo.userName}님`}>
          <Close className="close-btn" onClick={() => mini.close()} />
        </Header>
      )}
      <Close className="close-btn" onClick={() => mini.close()} />

      <Profile>
        {viewerInfo.profileImageUrl ? (
          <img
            className="photo"
            alt="profile"
            src={viewerInfo.profileImageUrl}
          />
        ) : (
          <Thumbnail className="photo" />
        )}
        <div className="user">
          <div className="name">{viewerInfo.userName}</div>
          <div className="place">{viewerInfo.regionName}</div>
        </div>
      </Profile>

      <Tab {...{ selectedTab, setSelectedTab }} />

      <div id="collections">
        {selectedTab === "my" ? (
          myPosts.length > 0 ? (
            <InfiniteScroll
              dataLength={myPosts.length}
              next={handleMyPostNext}
              hasMore={myPostsHasMore}
              loader={<div />}
              scrollableTarget="mypage-scroll"
            >
              {myPosts.map((post) => (
                <Collection key={post.postId} {...post} />
              ))}
            </InfiniteScroll>
          ) : (
            <div className="empty">
              <LogoInactive />
              <div>{`아직 만든 테마가 없어요.
나만의 테마를 만들어볼까요?`}</div>
            </div>
          )
        ) : savedPosts.length > 0 ? (
          <InfiniteScroll
            dataLength={savedPosts.length}
            next={handleSavedPostNext}
            hasMore={savedPostsHasMore}
            loader={<div />}
            scrollableTarget="mypage-scroll"
          >
            {savedPosts.map((post, i) => (
              <Collection key={i} {...post} />
            ))}
          </InfiniteScroll>
        ) : (
          <div className="empty">
            <LogoInactive />
            <div>{`아직 저장한 테마가 없어요.
추천 테마에서 이웃의 테마를 구경해 봐요!`}</div>
          </div>
        )}
      </div>

      <CreateButton targetId="mypage-scroll" />

      <Footer />
    </Wrapper>
  );
};

const Wrapper = styled.div<{ isScrollUp: boolean }>`
  ${WrapperWithHeaderFooter};
  overflow-y: scroll;
  position: relative;
  #collections {
    margin-top: -2.5rem;
    padding-bottom: 8.6rem;
    & > div > div > div:not(:first-child) {
      border-top: 0.6rem solid ${theme.color.gray1_5};
    }
  }
  .close-btn {
    position: absolute;
    top: 0.1rem;
    left: 0;
    fill: ${({ theme, isScrollUp }) =>
      isScrollUp ? theme.color.gray7 : theme.color.white};
    z-index: 100;
  }
  .empty {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    width: 100%;
    height: 100vh;
    padding-top: 7rem;
    box-sizing: border-box;
    ${flexCenter};
    flex-direction: column;
    text-align: center;
    white-space: pre-line;
    & > div {
      margin-top: 1.4rem;
      color: ${theme.color.gray5};
      line-height: 160%;
      font-weight: 500;
      font-size: 1.4rem;
    }
  }
`;

const Profile = styled.div`
  position: relative;
  width: 100%;
  height: 15rem;
  background-color: ${theme.color.orange};
  margin-top: -5rem;
  display: flex;
  align-items: center;
  padding: 0 2rem;
  padding-top: 4rem;
  box-sizing: border-box;
  color: ${theme.color.white};

  .photo {
    width: 5.2rem;
    height: 5.2rem;
    border-radius: 50%;
    border: 0.3rem solid ${theme.color.white};
    background-color: ${theme.color.gray4};
  }
  .user {
    margin-left: 1.2rem;
    .name {
      font-size: 1.8rem;
      line-height: 115%;
    }
    .place {
      font-size: 1.5rem;
      line-height: 115%;
      margin-top: 0.7rem;
    }
  }
`;

const TabWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 2.5rem 1.6rem;
  box-sizing: border-box;
  ${gap("0.5rem")}
  position: sticky;
  top: 0;
  background-color: #fff;
  z-index: 10;
`;

const TabBtn = styled.div<{ $isSelected: boolean }>`
  font-size: 1.5rem;
  line-height: 120%;
  padding: 1rem 1.2rem;
  border-radius: 3rem;
  color: ${({ $isSelected }) =>
    $isSelected ? theme.color.white : theme.color.gray6};
  font-weight: ${({ $isSelected }) => $isSelected && "bold"};
  background-color: ${({ $isSelected }) => $isSelected && theme.color.orange};
`;

export default Mypage;
