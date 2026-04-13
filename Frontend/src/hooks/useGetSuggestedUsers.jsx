import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setSuggestedUsers } from "../redux/slice/user.slice";
import { useNavigate } from "react-router-dom";

function useGetSuggestedUsers() {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "https://socialnova-backend.onrender.com/users/suggestedUsers",
          {
            withCredentials: true,
          },
        );
        setResponse(res);
        setLoading(false);
        console.log(res.data.users);
        dispatch(setSuggestedUsers(res.data.users));
      } catch (err) {
        navigate("/login");
      }
    };
    fetchData();
  }, []);

  return { response, loading };
}

export default useGetSuggestedUsers;
