import { useEffect, useState } from "react";
import TimeAgo from "javascript-time-ago";
import ReactTimeAgo from "react-time-ago";

import { Heart, MessageCircle, Repeat, Send, Trash2 } from "react-feather";
import {
  COLLECTIONS_ID_PROFILES,
  COLLECTIONS_ID_THREADS,
  DEV_db_id,
  databases,
  func,
  get_User_Function_id,
} from "../appwriteConfig";

import en from "javascript-time-ago/locale/en.json";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { Query } from "appwrite";
TimeAgo.addDefaultLocale(en);

const Thread = ({ thread, setThreads }) => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState();
  const [liked, setLiked] = useState(false);
  const [likedUserImage, setLikedUserImage] = useState([]);
  const [threadInstance, setThreadInstance] = useState(thread);
  const { user } = useAuth();
  useEffect(() => {
    getUser();
    checkIsLiked();
    usersWhoLikedImage();
  }, [liked]);

  const getUser = async () => {
    const payload = {
      owner_id: thread.owner_id,
    };
    const res = await func.createExecution(
      get_User_Function_id,
      JSON.stringify(payload)
    );

    const profile = await databases.getDocument(
      DEV_db_id,
      COLLECTIONS_ID_PROFILES,
      thread?.owner_id
    );
    const newUserData = JSON.parse(res.response);
    newUserData["profile_pic"] = profile.profile_pic;
    newUserData["username"] = profile.username;
    setUserData(newUserData);
    setLoading(false);
  };

  const handleDelete = async () => {
    await databases.deleteDocument(
      DEV_db_id,
      COLLECTIONS_ID_THREADS,
      thread.$id
    );
    setThreads((prev) => prev?.filter((thr) => thread.$id !== thr.$id));
  };

  const checkIsLiked = async () => {
    const users_who_liked = thread?.users_who_liked;
    const currentUserId = user?.$id;

    if (users_who_liked.includes(currentUserId)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  };

  const toggleLike = async () => {
    const users_who_liked = thread?.users_who_liked;
    const currentUserId = user?.$id;

    if (users_who_liked.includes(currentUserId)) {
      const index = users_who_liked.indexOf(currentUserId);
      users_who_liked.splice(index, 1);
      setLiked(false);
    } else {
      setLiked(true);
      users_who_liked.push(currentUserId);
    }

    const payload = {
      users_who_liked,
      likes: users_who_liked.length,
    };

    const res = await databases.updateDocument(
      DEV_db_id,
      COLLECTIONS_ID_THREADS,
      thread?.$id,
      payload
    );

    setThreadInstance(res);
  };

  const usersWhoLikedImage = async () => {
    const likedUsersId = thread?.users_who_liked;

    let likes = [];

    for (let i = 0; i <= 1; i++) {
      const profile = await databases.listDocuments(
        DEV_db_id,
        COLLECTIONS_ID_PROFILES,
        [Query.equal("user_id", `${likedUsersId[i]}`), Query.limit(1)]
      );
      likes = [...likes, profile.documents[0]?.profile_pic];
    }

    setLikedUserImage(likes);
  };
  if (loading) return;
  return (
    <div className="flex p-4 border-b border-slate-600">
      <Link to={`/@${userData?.username}`}>
        <img
          className="w-10 h-10 rounded-full object-cover"
          src={userData?.profile_pic}
          alt="Avatar"
        />
      </Link>
      <div className="w-full px-2 pb-4">
        {/**  Threads Header */}
        <div className="flex justify-between gap-3">
          <strong className="hover:underline hover:cursor-pointer">
            <Link
              className="text-white hover:text-inherit"
              to={`/@${userData?.username}`}
            >
              {userData?.name}
            </Link>
          </strong>
          <div className="flex justify-between items-center gap-5">
            <p className="text-[#666c66]">
              <ReactTimeAgo
                date={new Date(thread?.$createdAt).getTime()}
                locale="en-US"
              />
            </p>
            <Trash2
              onClick={handleDelete}
              size={14}
              className="cursor-pointer"
            />
          </div>
        </div>
        {/**  Threads Body */}
        <Link
          to={`/@${userData?.username}/post/${thread?.$id}`}
          className="text-inherit hover:text-inherit"
        >
          <div
            className="flex flex-col gap-5 py-4"
            style={{ whiteSpace: "pre-wrap" }}
          >
            {thread.body}
            {thread?.image && (
              <img
                className="rounded-md object-cover border border-[rgba(49,49,50,1)]"
                src={thread?.image}
                alt={thread?.body}
              />
            )}
          </div>
        </Link>
        {/**  Threads Action */}
        <div className="flex gap-5 cursor-pointer">
          <Heart
            color={`${liked ? "red" : "white"}`}
            fill={`${liked ? "red" : "none"}`}
            onClick={toggleLike}
            size={22}
          />
          <MessageCircle size={22} />
          <Repeat size={22} />
          <Send size={22} />
        </div>
        {/**  Threads Interaction */}
        <div className="flex justify-start pt-4 gap-4 cursor-pointer text-center text-[#666c66]">
          <div className="flex gap-2">
            <div className="flex gap-2 hover:underline">
              <div className="flex">
                {likedUserImage?.map((image, idx) => {
                  if (image !== undefined)
                    return (
                      <img
                        key={idx}
                        className="w-5 h-5 rounded-full flex-none ml-[-5px]"
                        src={image}
                      />
                    );
                })}
              </div>
              <p>
                {threadInstance?.likes && threadInstance?.likes > 1
                  ? `${threadInstance?.likes} likes`
                  : `${threadInstance?.likes} like`}
              </p>
            </div>
            <p>.</p>
            <p className="hover:underline">
              {threadInstance?.comments && threadInstance?.comments > 1
                ? `${threadInstance?.comments} replies`
                : `${threadInstance?.comments} reply`}{" "}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Thread;
