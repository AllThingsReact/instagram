import { useState, useEffect, useContext } from "react";
import { getUserByUserId } from "../services/firebase";
import UserContext from "../context/user";

export default function useUser() {
  const [activeUser, setActiveUser] = useState();
  const { user } = useContext(UserContext);

  useEffect(() => {
    async function getUserObjByUserId(userId) {
      const [userResponse] = await getUserByUserId(user.uid);
      setActiveUser(userResponse || {});
    }
    if (user?.uid) {
      getUserObjByUserId(user.uid);
    }
  }, [user]);

  return { user: activeUser };
}
