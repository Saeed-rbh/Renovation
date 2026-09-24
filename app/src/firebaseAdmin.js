// Auth and Storage are only needed by the admin panel, so they live here
// instead of firebase.js to keep them out of the public site's bundle.
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import app from "./firebase";

export const auth = getAuth(app);
export const storage = getStorage(app);
