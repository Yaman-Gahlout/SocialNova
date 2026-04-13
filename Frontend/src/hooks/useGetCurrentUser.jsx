import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/slice/user.slice";
import { useNavigate } from "react-router-dom";

function useGetCurrentUser() {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:8000/users", {
          withCredentials: true,
        });
        setResponse(res);
        setLoading(false);
        console.log("Current User:", res);
        dispatch(setUserData(res.data.user));
      } catch (err) {
        navigate("/login");
      }
    };
    fetchData();
  }, []);

  return { response, loading };
}

export default useGetCurrentUser;
