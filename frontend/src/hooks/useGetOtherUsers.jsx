import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setOtherUsers } from "../../redux/userSlice";

const useGetOtherUsers = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchOtherUsers = async () => {
      try {
        const res = await axios.get("https://talknest-real-time-chat-application.onrender.com/api/v1/friends/list", {
          withCredentials: true,
        });

        console.log("✅ Fetched users:", res.data);

        // ✅ FIX: dispatch the array (res.data.friends), not the object
        dispatch(setOtherUsers(res.data.friends || []));
      } catch (error) {
        console.error("❌ Error fetching users:", error.response || error);
        dispatch(setOtherUsers([])); // fallback to empty array to avoid crash
      }
    };

    fetchOtherUsers();
  }, [dispatch]);
};

export default useGetOtherUsers;
