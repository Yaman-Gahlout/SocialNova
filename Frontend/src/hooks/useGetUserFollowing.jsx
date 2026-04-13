import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFollowing } from "../redux/slice/user.slice";

function useGetUserFollowing() {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:8000/users/following", {
          withCredentials: true,
        });
        setResponse(res);
        setLoading(false);
        console.log("All following:", res);
        dispatch(setFollowing(res.data.following));
      } catch (err) {
        console.log("Error fetching following data: ", err);
        navigate("/login");
      }
    };
    fetchData();
  }, []);

  return { response, loading };
}

export default useGetUserFollowing;
