import { Avatar, Button, Card, Col, Input } from "antd";

import React, {  useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import avatar from "../assets/images/avatar.jpg";
import "../assets/styles/schedule.css";
import Main from "../components/layout/Main";
import { userController } from "../controllers/userController";
import { useTranslation } from "react-i18next";

export default function CommunityPosts() {
  const [t, i18n] = useTranslation();
  const userData = useSelector((state) => state);
  const dispatch = useDispatch();
  const [showAddComment, setShowAddComment] = useState(false); 
  const [loadMore, setLoadMore] = useState(
    userData.communityPosts.pageNumber === -1
  );
  const [loadMoreComments, setLoadMoreComments] = useState(false);
  const [postSelectedIndex, setPostSelectedIndex] = useState(-1);
  const [commentText, setCommentText] = useState("");
  useEffect(() => {
    if (
      userData.communityPosts.pageNumber <=
        userData.communityPosts.totalNumberOfPages &&
      loadMore
    )
      userController
        .getCommunityPosts({
          pageNumber:
            userData.communityPosts.pageNumber === -1
              ? 1
              : userData.communityPosts.pageNumber,
          recordsByPage: 3,
          searchText: "null",
        })
        .then((response) => {
          let data = response.data.communityPosts;
          for (let i = 0; i < data.length; i++) {
            data[i].communityPostComments = {
              pageNumber: -1,
              totalNumberOfPages: 1,
              comments: [],
            };
          }
          dispatch({
            type: "SET_COMMUNITY_POSTS",
            communityPosts: {
              pageNumber:
                userData.communityPosts.pageNumber === -1
                  ? 2
                  : userData.communityPosts.pageNumber + 1,
              totalNumberOfPages: response.data.totalNumberOfPages,
              posts: [...userData.communityPosts.posts, ...data],
            },
          });
          setLoadMore(false);
        });
  }, [loadMore]);

  const [addPostVisibility, setAddPostVisibility] = useState(false);
  const [postDetails, setPostDetails] = useState({
    postDescription: "",
    postService: "",
  });
  function updatePostDetails(key, value) {
    let tempPostDetails = { ...postDetails };
    tempPostDetails[key] = value;
    setPostDetails(tempPostDetails);
  }
  function addPost() {
    userController
      .addCommunityPost({
        body: {
          postService: postDetails.postService,
          postDescription: postDetails.postDescription,
          userFk: userData.userInfo.userId,
        },
      })
      .then((response) => {

      });
     
  }
  useEffect(() => {
    if (postSelectedIndex !== -1 && loadMoreComments) {
      let postCommentsDetails =
        userData.communityPosts.posts[postSelectedIndex].communityPostComments;
      if (
        postCommentsDetails.pageNumber <= postCommentsDetails.totalNumberOfPages
      ) {
        userController
          .getCommunityPostComment({
            postId: userData.communityPosts.posts[postSelectedIndex].postId,
            pageNumber:
              postCommentsDetails.pageNumber === -1
                ? 1
                : postCommentsDetails.pageNumber,
            recordsByPage: 3,
          })
          .then((response) => {
            let data = response.data;
            let tempCommunityPosts = [...userData.communityPosts.posts];
            tempCommunityPosts[
              postSelectedIndex
            ].communityPostComments.totalNumberOfPages =
              data.totalNumberOfPages;
            tempCommunityPosts[
              postSelectedIndex
            ].communityPostComments.pageNumber =
              tempCommunityPosts[postSelectedIndex].communityPostComments
                .pageNumber === -1
                ? 2
                : tempCommunityPosts[postSelectedIndex].communityPostComments
                    .pageNumber + 1;
            tempCommunityPosts[
              postSelectedIndex
            ].communityPostComments.comments = [
              ...tempCommunityPosts[postSelectedIndex].communityPostComments
                .comments,
              ...data.postComments,
            ];
            dispatch({
              type: "SET_COMMUNITY_POSTS",
              communityPosts: {
                pageNumber:
                  userData.communityPosts.pageNumber === -1
                    ? 2
                    : userData.communityPosts.pageNumber + 1,
                totalNumberOfPages: response.data.totalNumberOfPages,
                posts: [...tempCommunityPosts],
              },
            });
            setLoadMoreComments(false);
          });
      }
    }
  }, [loadMoreComments]);
  console.log("comments",userData.communityPosts.posts)
  function addComment() {
    userController.addCommunityPostComment({
      body: {
        userFk: userData.userInfo.userId,
        postFk: userData.communityPosts.posts[postSelectedIndex].postId,
        commentDescription: commentText,
      },
    });
  
  }
  return (
    <Main>
      <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
        {/* <Button
        className="ms-3"
          type="primary"
          onClick={() => setAddPostVisibility(!addPostVisibility)}
        >
          {t("post")}
        </Button> */}
      
          <Card bordered={false} className="criclebox h-full mb-2">
            <Input
              type="text"
              className="patient-details-input mb-4"
              placeholder=    {t("service_title")}
              onChange={(e) => updatePostDetails("postService", e.target.value)}
            />
            <Input
              type="text"
              placeholder=    {t("service_description")}
              className="patient-details-input"
              value={postDetails.postDescription}
              onChange={(e) =>
                updatePostDetails("postDescription", e.target.value)
              }
            />

            <div className="d-flex w-100 justify-content-end mt-4">
              <Button type="primary" onClick={() => addPost()}>
              {t("add_post")}
              </Button>
            </div>
          </Card>
        
        <Card bordered={false} className="criclebox h-full">
        <div className="d-flex flex-column">
  {userData.communityPosts.posts.map((post, index) => {
    return (
      <div
        style={{ cursor: "pointer" }}
        onClick={() => {
          setPostSelectedIndex(index);
          setLoadMoreComments(true);
        }}
        key={"post" + index}
        className="col-lg-5 col-md-5 col-sm-12 appointment-card mt-1 mb-2 pt-2 ps-3 pe-3 w-100"
      >
        <div className="d-flex align-items-center">
          <Avatar.Group>
            <Avatar
              className="appointment-profile me-2"
              size={50}
              shape="circle"
              src={
                post?.profilePicture ? post?.profilePicture : avatar
              }
            />
          </Avatar.Group>
          <div className="txt">
            {post.firstName + " " + post.lastName}
          </div>
        </div>
        <div className="community-post-txt mt-2">
          {t("service") + ":"} {post.postService}
        </div>
        <div className="community-post-txt mt-2 ">
          {t("description") + ":"}
          {post.postDescription}
        </div>
        <div className="comment-count mt-2 d-flex justify-content-end">
          {post.commentCount} {t("comments")}
        </div>

        {/* Add comment section */}
        {postSelectedIndex === index && (
          <div>
          
            <div className="d-flex m-auto">
              <textarea
                className="patient-details-input w-100 mt-3"
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={t("add_comment") + "..."}
              />
            </div>
            <Button
              type="primary"
              onClick={() => addComment()}
              className="me-3 mt-3"
            >
              {t("add_comment")}
            </Button>
            {/* <Button
              type="primary"
              onClick={() => setPostSelectedIndex(-1)}
              className="me-3 mt-3"
            >
              {t("back")}
            </Button> */}
            {post.communityPostComments.comments.map((com) => {
              return (
                <div className="mt-3 d-flex align-items-center">
                
                     <Avatar.Group>
            <Avatar
              className="appointment-profile me-2"
              size={50}
              shape="circle"
              src={
               com?.profilePicture ? com?.profilePicture : avatar
              }
            />
          </Avatar.Group>
          <div className="d-flex  flex-column post-names ">
                  <div className=" txt">
                    {com.firstName + " " + com.lastName}
                  </div>
                 
                  <div className="">{com.commentDescription}</div>
                </div>
                </div>
              );
            })}
            {post.communityPostComments.pageNumber <=
              post.communityPostComments.totalNumberOfPages && (
              <Button
                type="primary"
                onClick={() => setLoadMoreComments(true)}
                className="mt-2"
              >
                {t("load")}
              </Button>
            )}
          </div>
        )}
      </div>
    );
  })}
  {userData.communityPosts.pageNumber !== -1 &&
    userData.communityPosts.pageNumber <=
      userData.communityPosts.totalNumberOfPages && (
      <Button type="primary" onClick={() => setLoadMore(true)} className="w-30 m-auto">
        {t("load")}
      </Button>
    )}
</div>
        </Card>
      </Col>
    </Main>
   
  );
}
