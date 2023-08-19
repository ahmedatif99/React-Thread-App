import React, { useEffect, useState } from "react";
import { Edit, Instagram, MoreHorizontal, Trash } from "react-feather";
import { useAuth } from "../context/AuthContext";
import {
  COLLECTIONS_ID_PROFILES,
  DEV_db_id,
  databases,
} from "../appwriteConfig";
import { useNavigate } from "react-router-dom";

const ProfileHeader = ({ profile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFollowerOpen, setIsFollowerOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollower, setIsFollower] = useState(false);
  const [profileInctance, setProfileInstance] = useState(profile);
  const { user } = useAuth();
  const navigate = useNavigate();

  console.log(user);
  console.log(profileInctance);

  useEffect(() => {
    checkIsFolowingProcess();
  }, []);

  const checkIsFolowingProcess = async () => {
    const followers = profile.followers;
    const following = profile?.following;
    const currentUserId = user?.$id;

    if (followers.includes(currentUserId)) {
      setIsFollowing(true);
    } else {
      if (following.includes(currentUserId)) {
        setIsFollower(true);
      } else {
        setIsFollowing(false);
        setIsFollower(false);
      }
    }
  };

  const toggleFollow = async () => {
    const followers = profile?.followers;
    const following = user?.profile?.following;

    const followers_users = profile?.followers_users;
    const following_users = user?.profile?.following_users;

    const currentUserId = user?.$id;
    const currentUsername = user?.profile?.username;
    const thisProfileId = profile?.$id;
    const thisProfileUsername = profile?.username;

    if (followers.includes(currentUserId)) {
      const index1 = followers.indexOf(currentUserId);
      followers.splice(index1, 1);
      const index2 = following.indexOf(thisProfileId);
      following.splice(index2, 1);

      const index3 = followers_users.indexOf(currentUsername);
      followers_users.splice(index3, 1);
      const index4 = following_users.indexOf(thisProfileUsername);
      following_users.splice(index4, 1);

      setIsFollowing(false);
    } else {
      followers.push(currentUserId);
      following.push(thisProfileId);

      followers_users.push(currentUsername);
      following_users.push(thisProfileUsername);

      setIsFollowing(false);
      setIsFollower(false);

      if (following.includes(currentUserId)) {
        setIsFollower(true);
      }
    }

    const payload1 = {
      followers,
      followers_users,
      follower_count: followers.length,
    };
    const payload2 = {
      following,
      following_users,
      follow_count: following.length,
    };

    const res1 = await databases.updateDocument(
      DEV_db_id,
      COLLECTIONS_ID_PROFILES,
      profile?.$id,
      payload1
    );
    const res2 = await databases.updateDocument(
      DEV_db_id,
      COLLECTIONS_ID_PROFILES,
      user?.profile?.$id,
      payload2
    );

    setProfileInstance(res1);
  };

  const handleDeleteProfile = async () => {
    try {
      await databases.deleteDocument(
        DEV_db_id,
        COLLECTIONS_ID_PROFILES,
        user?.$id
      );

      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  const handleGo = () => {
    window.open(`${profileInctance?.instagramLink}`);
  };

  return (
    <React.Fragment>
      {/**  Header */}
      <div className="flex justify-between px-4">
        <div className="flex flex-col gap-3">
          <strong className="text-4xl">{profileInctance?.name}</strong>
          <span className="flex items-center gap-2 text-lg">
            {profileInctance?.username}{" "}
            <a
              href={`https://www.threads.net/@${profileInctance?.username}`}
              target="_blank"
              className="bg-[#1e1e1e] text-xs font-light text-[#666c66] hover:text-[#666c66] cursor-pointer p-1 rounded-2xl"
              rel="noreferrer"
            >
              threads.net
            </a>
          </span>
        </div>
        <img
          className="w-20 h-20 object-cover rounded-full"
          src={profileInctance?.profile_pic}
        />
      </div>
      {/**  BIO */}
      <p className="px-4 pb-3">{profileInctance?.bio}</p>
      {/** Followers & Links */}
      <div className="flex justify-between p-4">
        <div className="flex gap-1  text-[#666c66] hover:text-[#666c66] font-normal text-sm">
          <div className="flex gap-1">
            <div className="cursor-pointer">
              <button
                className="hover:underline"
                onClick={() => setIsFollowerOpen(!isFollowerOpen)}
              >
                {profileInctance?.follower_count} followers
              </button>

              {isFollowerOpen && (
                <div className="origin-top-right absolute overflow-y-scroll left-10 mt-2 p-3 w-48 max-h-64 rounded-md shadow-lg bg-[rgba(30,30,30,1)] ring-1 ring-black ring-opacity-5">
                  <div
                    className="flex flex-col gap-4 transition "
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="options-menu"
                  >
                    {profileInctance?.followers_users.map((users, idx) => (
                      <strong
                        className="py-2 px-2 border-b rounded-full border-[#b6b5b5] hover:text-[#b6b5b5] hover:bg-[#525252]"
                        key={idx}
                      >
                        @{users}
                      </strong>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          {profileInctance?.link && (
            <>
              <p>.</p>
              <p className="hover:underline cursor-pointer">
                <a
                  className="text-[#666c66]  hover:text-[#666c66]"
                  href={profileInctance?.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  {profileInctance?.link.replace("https://", "")}
                </a>
              </p>
            </>
          )}
        </div>
        <div className="flex gap-4">
          <Instagram onClick={handleGo} size={30} className="cursor-pointer" />
          {user?.$id === profileInctance?.$id && (
            <div className="rounded-full border-4 cursor-pointer">
              <MoreHorizontal
                size={25}
                type="button"
                onClick={() => setIsOpen(!isOpen)}
              />

              {isOpen && (
                <div className="origin-top-right absolute right-10 mt-2 p-3 w-48 rounded-md shadow-lg bg-[rgba(30,30,30,1)] ring-1 ring-black ring-opacity-5">
                  <div
                    className="py-1"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="options-menu"
                  >
                    <div
                      onClick={handleDeleteProfile}
                      className="flex gap-3 py-2 text-lg text-red-600 hover:text-red-500"
                      role="menuitem"
                    >
                      <Trash size={22} />
                      <strong>Delete Profile</strong>
                    </div>
                    <a
                      href={`/edit/@${profileInctance?.username}`}
                      className="flex gap-3 py-2 text-lg text-[#7f7f85]  hover:text-[#5c5c5c]"
                      role="menuitem"
                    >
                      <Edit />
                      <strong>Edit Profile</strong>
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Follwo Button */}
      {user?.$id !== profileInctance?.$id && (
        <div className="flex justify-around py-4">
          <button
            onClick={toggleFollow}
            className="bg-white px-12 py-2 text-black text-xl font-medium rounded hover:bg-[#7a7a7a] hover:text-[#ddd] transition"
          >
            {isFollowing ? "Following" : isFollower ? "Follow back" : "Follow"}
          </button>
          <button className="bg-white px-12 py-2 text-black text-xl font-medium rounded hover:bg-[#7a7a7a] hover:text-[#ddd] transition">
            Mention
          </button>
        </div>
      )}
    </React.Fragment>
  );
};

export default ProfileHeader;
