import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setPostsData } from "../redux/slice/post.slice";

function useGetAllPosts() {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:8000/posts", {
          withCredentials: true,
        });
        setResponse(res);
        setLoading(false);
        console.log("All Posts:", res);
        dispatch(setPostsData(res.data.posts));
      } catch (err) {
        navigate("/login");
      }
    };
    fetchData();
  }, []);

  return { response, loading };
}

export default useGetAllPosts;
