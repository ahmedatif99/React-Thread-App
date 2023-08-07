import { useEffect, useState } from "react";
import TimeAgo from "javascript-time-ago";
import ReactTimeAgo from "react-time-ago";

import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  Repeat,
  Send,
  Trash2,
} from "react-feather";
import {
  COLLECTIONS_ID_THREADS,
  DEV_db_id,
  databases,
  func,
  get_User_Function_id,
} from "../appwriteConfig";

import en from "javascript-time-ago/locale/en.json";
TimeAgo.addDefaultLocale(en);

const Thread = ({ thread, setThreads }) => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState();
  const [liked, setLiked] = useState(false);
  const [threadInstance, setThreadInstance] = useState(thread);
  
  useEffect(() => {
    getUser();
    checkIsLiked();
  }, []);

  const getUser = async () => {
    const payload = {
      owner_id: thread.owner_id,
    };
    const res = await func.createExecution(
      get_User_Function_id,
      JSON.stringify(payload)
    );
    setUserData(JSON.parse(res.response));
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
    const currentUserId = "64c8ce7c4de3d6e12198";

    if (users_who_liked.includes(currentUserId)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  };

  const toggleLike = async () => {
    const users_who_liked = thread?.users_who_liked;
    const currentUserId = "64c8ce7c4de3d6e12198";

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
  if (loading) return;
  return (
    <div className="flex p-4 border-b border-slate-600">
      <img
        className="w-10 h-10 rounded-full object-cover"
        src={userData?.profile_pic}
        alt="Avatar"
      />
      <div className="w-full px-2 pb-4">
        {/**  Threads Header */}
        <div className="flex justify-between gap-3">
          <strong className="hover:underline hover:cursor-pointer">
            {userData?.name}
          </strong>
          <div className="flex justify-between items-center gap-5">
            <p className="text-gray-400">
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
        <div className="flex justify-start pt-4 gap-4 cursor-pointer text-center text-gray-400">
          <div className="flex gap-2">
            <p className="hover:underline">5 replies</p>
            <p>.</p>
            <p className="hover:underline">
              {threadInstance?.likes && threadInstance?.likes > 1
                ? `${threadInstance?.likes} likes`
                : `${threadInstance?.likes} like`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Thread;
