import React from "react";
import { setProfileData } from "../redux/slice/user.slice";
import { useNavigate } from "react-router-dom";
import profileImage from "../assets/userImage.avif";
import axios from "axios";
import { useDispatch } from "react-redux";

function UserProfile({ i }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const clickHandler = async (username) => {
    try {
      const res = await axios.get(
        `https://socialnova-backend.onrender.com/users/${username}`,
        {
          withCredentials: true,
        },
      );

      console.log(res.data.user);
      dispatch(setProfileData(res.data.user));
      navigate("/profile");
    } catch (err) {
      navigate("/home");
    }
  };
  return (
    <div className="flex items-center justify-between border-b border-slate-600 pb-3">
      <div className="flex items-center gap-3">
        <img
          className="w-9 h-9 rounded-full cursor-pointer bg-gradient-to-r from-[#6C5CE7] to-[#00D4FF]"
          onClick={() => clickHandler(i?.username)}
          src={i?.profilePicture ? i?.profilePicture : profileImage}
        />
        <div className="flex flex-col gap-0.5">
          <span
            className="text-md font-bold"
            onClick={() => clickHandler(i?.username)}
          >
            {i?.username}
          </span>
          <span className="text-sm opacity-85">{i?.fullName}</span>
        </div>
      </div>
      <button className="text-md text-[#00D4FF]">Follow +</button>
    </div>
  );
}

export default UserProfile;
