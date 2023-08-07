import { useEffect, useRef, useState } from "react";
import { Query, ID } from "appwrite";

import Thread from "../components/Thread";
import {
  BUCKET_ID_IMAGES,
  COLLECTIONS_ID_THREADS,
  databases,
  DEV_db_id,
  storage,
} from "../appwriteConfig";
import { Image } from "react-feather";

const Feed = () => {
  const [threads, setThreads] = useState([]);
  const [threadBody, setThreadbody] = useState("");
  const [threadImage, setThreadImage] = useState();
  const fileRef = useRef(null);

  useEffect(() => {
    getThreads();
  }, []);

  const getThreads = async () => {
    const res = await databases.listDocuments(
      DEV_db_id,
      COLLECTIONS_ID_THREADS,
      [Query.orderDesc("$createdAt")]
    );
    console.log(res);
    setThreads(res.documents);
  };

  const handleThreadSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      owner_id: "64c8ce7c4de3d6e12198",
      body: threadBody,
      image: threadImage,
      likes: 0,
    };
    const res = await databases.createDocument(
      DEV_db_id,
      COLLECTIONS_ID_THREADS,
      ID.unique(),
      payload
    );
    setThreads((prev) => [res, ...prev]);
    setThreadbody("");
    setThreadImage("");
  };

  const handleClick = async () => {
    fileRef.current.click();
  };

  const handleFileChange = async (e) => {
    const fileObj = e.target.files && e.target.files[0];

    if (!fileObj) return;

    const res = await storage.createFile(
      BUCKET_ID_IMAGES,
      ID.unique(),
      fileObj
    );

    const imagePreview = storage.getFilePreview(BUCKET_ID_IMAGES, res?.$id);
    setThreadImage(imagePreview?.href);
  };

  return (
    <div className="container mx-auto max-w-[600px]">
      <div className="p-4">
        <form onSubmit={handleThreadSubmit}>
          <textarea
            className="rounded-lg w-full p-4 bg-neutral-900"
            required
            name="body"
            placeholder="Say Sth.."
            value={threadBody}
            onChange={(e) => setThreadbody(e.target.value)}
          ></textarea>
          <img src={threadImage} />
          <input
            style={{ display: "none" }}
            type="file"
            ref={fileRef}
            onChange={handleFileChange}
          />

          <div className="flex justify-between items-center border-y border-[rgba(49,49,50,1)] py-2">
            <Image onClick={handleClick} size={24} className="cursor-pointer" />
            <input
              className="cursor-pointer border border-black rounded text-sm bg-white text-black py-2 px-4"
              type="submit"
              value="Post"
            />
          </div>
        </form>
      </div>
      {threads?.length > 0 &&
        threads?.map((thread, idx) => (
          <Thread key={idx} thread={thread} setThreads={setThreads} />
        ))}
    </div>
  );
};

export default Feed;
