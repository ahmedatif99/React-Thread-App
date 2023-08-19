import { useEffect, useRef, useState } from "react";
import {
  BUCKET_ID_IMAGES,
  COLLECTIONS_ID_PROFILES,
  DEV_db_id,
  databases,
  storage,
} from "../appwriteConfig";
import { ID } from "appwrite";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const { user } = useAuth();
  const [profileImage, setProfileImage] = useState(user?.profile?.profile_pic);
  const fileRef = useRef(null);
  const profileForm = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    profileForm.current.name.value = user?.profile?.name;
    profileForm.current.email.value = user?.email;
    profileForm.current.username.value = user?.profile?.username;
    profileForm.current.bio.value = user?.profile?.bio;
    profileForm.current.link.value = user?.profile?.link;
    profileForm.current.link.image = user?.profile?.link;
  }, []);

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
    setProfileImage(imagePreview?.href);
  };

  const handleProfileEditSubmit = async (e) => {
    e.preventDefault();
    const name = profileForm.current.name.value;
    const email = profileForm.current.email.value;
    const username = profileForm.current.username.value;
    const password = profileForm.current.password.value;
    const bio = profileForm.current.bio.value;
    const link = profileForm.current.link.value;
    const profile_pic = profileImage;

    const payload = {
      name,
      username,
      bio,
      profile_pic,
    };

    const res = await databases.updateDocument(
      DEV_db_id,
      COLLECTIONS_ID_PROFILES,
      user?.$id,
      payload
    );

    navigate(`/@${username}`);
  };

  return (
    <div className="p-4">
      <form ref={profileForm} onSubmit={handleProfileEditSubmit}>
        <input
          style={{ display: "none" }}
          type="file"
          ref={fileRef}
          name="image"
          onChange={handleFileChange}
        />

        <div className="flex flex-col px-2 items-center border-x border-[rgba(49,49,50,1)] py-2">
          <img
            src={profileImage}
            onClick={handleClick}
            className="my-4 cursor-pointer w-28 h-28 object-cover rounded-full"
          />

          <input
            className="w-full p-3 rounded-sm my-4 bg-neutral-900"
            required
            type="text"
            name="name"
            placeholder="Name"
          />

          <input
            className="w-full p-3 rounded-sm my-4 bg-neutral-900"
            required
            type="email"
            name="email"
            placeholder="Email"
          />

          <input
            className="w-full p-3 rounded-sm my-4 bg-neutral-900"
            required
            type="text"
            name="username"
            placeholder="username"
          />

          <input
            className="w-full p-3 rounded-sm my-4 bg-neutral-900"
            type="password"
            name="password"
            placeholder="password"
            minLength={8}
          />

          <textarea
            className="rounded-lg w-full p-4 my-4 bg-neutral-900"
            required
            name="bio"
            placeholder="Bio"
          ></textarea>

          <input
            className="w-full p-3 rounded-sm my-4 bg-neutral-900"
            type="url"
            name="link"
            placeholder="Add Link to your profile"
          />

          <input
            type="submit"
            value="Save"
            className="bg-white text-black py-2 px-4 my-4 text-sm border border-black rounded"
          />
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
