import React, { useEffect, useState } from "react";
import {
  COLLECTIONS_ID_PROFILES,
  COLLECTIONS_ID_THREADS,
  COLLECTIONS_ID_THREAD_COMMENT,
  DEV_db_id,
  databases,
  func,
  get_User_Function_id,
} from "../appwriteConfig";
import { Link } from "react-router-dom";
import ReactTimeAgo from "react-time-ago";
import { Trash2 } from "react-feather";

const Comment = ({ comment, setComment, commLength, threadID, setThread }) => {
  const [userData, setUserData] = useState();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const payload = {
      owner_id: comment?.owner_id,
    };
    const res = await func.createExecution(
      get_User_Function_id,
      JSON.stringify(payload)
    );

    const profile = await databases.getDocument(
      DEV_db_id,
      COLLECTIONS_ID_PROFILES,
      comment?.owner_id
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
      COLLECTIONS_ID_THREAD_COMMENT,
      comment.$id
    );

    const payload2 = {
      comments: commLength - 1,
    };
    const res = await databases.updateDocument(
      DEV_db_id,
      COLLECTIONS_ID_THREADS,
      threadID,
      payload2
    );

    setThread(res);

    setComment((prev) => prev?.filter((comm) => comment?.$id !== comm.$id));
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
                date={new Date(comment?.$createdAt).getTime()}
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
          {comment?.body}
        </div>
      </div>
    </div>
  );
};

export default Comment;
