import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setNotifications } from "../redux/slice/user.slice";

function useGetAllNotifications() {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "https://socialnova-backend.onrender.com/users/notifications",
          {
            withCredentials: true,
          },
        );
        setResponse(res);
        setLoading(false);
        console.log("All Notifications:", res);
        dispatch(setNotifications(res.data.notifications));
      } catch (err) {
        navigate("/login");
      }
    };
    fetchData();
  }, []);

  return { response, loading };
}

export default useGetAllNotifications;
