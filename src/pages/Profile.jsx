import { useEffect, useState } from "react";
import ProfileHeader from "../components/ProfileHeader";
import {
  COLLECTIONS_ID_PROFILES,
  DEV_db_id,
  databases,
} from "../appwriteConfig";
import { Query } from "appwrite";
import Thread from "../components/Thread";
import { useParams } from "react-router-dom";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [threads, setThreads] = useState([]);
  const [profile, setProfile] = useState({});
  const { username } = useParams();

  useEffect(() => {
    getProfile();
  }, []);

  const getThreads = async (owner_id) => {
    const res = await databases.listDocuments(
      DEV_db_id,
      "64c8cd8b23af84476ef7",
      [Query.orderDesc("$createdAt"), Query.equal("owner_id", owner_id)]
    );
    setThreads(res.documents);
  };

  const getProfile = async () => {
    const profile = await databases.listDocuments(
      DEV_db_id,
      COLLECTIONS_ID_PROFILES,
      [Query.equal("username", username.replace("@", ""))]
    );
    getThreads(profile?.documents[0]?.$id);
    setProfile(profile.documents[0]);
    setLoading(false);
  };

  if (loading) return;

  return (
    <>
      <ProfileHeader profile={profile} setProfile={setProfile} />
      <div className="border-t-2 border-gray-500">
        {threads?.length > 0 &&
          threads?.map((thread, idx) => (
            <Thread key={idx} thread={thread} setThreads={setThreads} />
          ))}
      </div>
    </>
  );
};

export default Profile;
