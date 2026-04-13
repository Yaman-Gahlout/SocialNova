import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setOldChatUsers } from "../redux/slice/message.slice";

function useGetOldChatUsers() {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "https://socialnova-backend.onrender.com/messages/prevUsers",
          {
            withCredentials: true,
          },
        );
        setResponse(res);
        setLoading(false);
        console.log("Old Chat Users:", res);
        dispatch(setOldChatUsers(res.data.prevUsers));
      } catch (err) {
        console.log("Error fetching previous chat users: ", err);
        navigate("/login");
      }
    };
    fetchData();
  }, []);

  return { response, loading };
}

export default useGetOldChatUsers;
