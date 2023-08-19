import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Thread from "../components/Thread";
import Comment from "../components/Comment";
import {
  COLLECTIONS_ID_THREADS,
  COLLECTIONS_ID_THREAD_COMMENT,
  DEV_db_id,
  databases,
} from "../appwriteConfig";
import { useAuth } from "../context/AuthContext";
import { ID, Query } from "appwrite";

const ThreadPage = () => {
  const [thread, setThread] = useState();
  const [comments, setComments] = useState();
  const [loading, setLoading] = useState(true);

  const [commentBody, setCommentbody] = useState("");
  const { user } = useAuth();
  const { id } = useParams();

  useEffect(() => {
    getThread();
    getComments();
  }, []);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      owner_id: user?.$id,
      body: commentBody,
      thread_id: id,
    };
    const res = await databases.createDocument(
      DEV_db_id,
      COLLECTIONS_ID_THREAD_COMMENT,
      ID.unique(),
      payload
    );

    const payload2 = {
      comments: comments?.length + 1,
    };

    const res2 = await databases.updateDocument(
      DEV_db_id,
      COLLECTIONS_ID_THREADS,
      id,
      payload2
    );

    setThread(res2);
    setCommentbody("");
    // console.log(res)
    setComments((prev) => [...prev, res]);
  };

  const getThread = async () => {
    let res = await databases.getDocument(
      DEV_db_id,
      COLLECTIONS_ID_THREADS,
      id
    );
    setThread(res);
    setLoading(false);
  };

  const getComments = async () => {
    const comments = await databases.listDocuments(
      DEV_db_id,
      COLLECTIONS_ID_THREAD_COMMENT,
      [Query.equal("thread_id", id), Query.orderAsc("$createdAt")]
    );

    setComments(comments.documents);
  };
  if (loading) return;
  return (
    <>
      <Thread thread={thread} />
      <div className="p-4">
        <form onSubmit={handleCommentSubmit}>
          <textarea
            className="rounded-lg w-full p-4 bg-neutral-900"
            required
            name="body"
            placeholder="Post a comment"
            value={commentBody}
            onChange={(e) => setCommentbody(e.target.value)}
          ></textarea>

          <div className="flex justify-end items-center border-y border-[rgba(49,49,50,1)] py-2">
            <input
              className="cursor-pointer border border-black rounded text-sm bg-white text-black py-2 px-4"
              type="submit"
              value="comment"
            />
          </div>
        </form>
      </div>
      <div>
        {comments?.map((com, idx) => (
          <Comment
            key={idx}
            threadID={thread?.$id}
            setThread={setThread}
            commLength={comments?.length}
            comment={com}
            setComment={setComments}
          />
        ))}
      </div>
    </>
  );
};

export default ThreadPage;
