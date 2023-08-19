import { Account, Client, Databases, Functions, Storage } from "appwrite";

const client = new Client();
const endpoint = import.meta.env.VITE_END_POINT;
const projectId = import.meta.env.VITE_PROJECT_ID;
export const DEV_db_id = import.meta.env.VITE_DB_ID;
export const BUCKET_ID_IMAGES = import.meta.env.VITE_BUCKET_ID_IMAGES;
export const get_User_Function_id = import.meta.env.VITE_FUNCTION_ID_GET_USER;
export const COLLECTIONS_ID_THREADS = import.meta.env
  .VITE_COLLECTIONS_ID_THEADS;
export const COLLECTIONS_ID_THREAD_COMMENT = import.meta.env
  .VITE_COLLECTIONS_ID_THREAD_COMMENT;
export const COLLECTIONS_ID_PROFILES = import.meta.env
  .VITE_COLLECTIONS_ID_PROFILES;

client.setEndpoint(endpoint).setProject(projectId);

export const databases = new Databases(client);

export const func = new Functions(client);

export const storage = new Storage(client);

export const account = new Account(client);

export default client;
