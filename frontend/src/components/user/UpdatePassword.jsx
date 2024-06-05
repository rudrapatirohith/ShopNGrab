import React, { useEffect, useState } from 'react'
import UserLayout from '../layouts/UserLayout'
import { useUpdatePasswordMutation } from '../../redux/api/userApi';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import PageTitle from '../layouts/PageTitle';

const UpdatePassword = () => {

    const [oldPassword,setOldpassword] = useState("");
    const [NewPassword,setNewPassword] = useState("");


    const navigate = useNavigate();

const [UpdatePassword,{isLoading,error,isSuccess}] = useUpdatePasswordMutation();

const {user} = useSelector((state)=>state.auth);

useEffect(()=>{

  if(error){
    toast.error(error?.data?.message?error?.data?.message:"Old Password is Incorrect");
  }

  if(isSuccess){
    toast.success("Password Updated");
    navigate("/me/profile");
  }

},[error,isSuccess]);

const submitHandler = (e) =>{
  e.preventDefault();

  const userData = {
   oldPassword,
   NewPassword,
  };

  UpdatePassword(userData);

  console.log(userData);
}

  return (
    
    <UserLayout>
   <PageTitle title={"Update Password"}/>
    <div className="row wrapper ">
      <div className="col-10 col-lg-8">
        <form className="shadow rounded bg-body" onSubmit={submitHandler}>
          <h2 className="mb-4">Update Password</h2>
          <div className="mb-3">
            <label htmlFor="old_password_field" className="form-label">
              Old Password
            </label>
            <input
              type="password"
              id="old_password_field"
              className="form-control"
              value={oldPassword}
              onChange={(e)=>setOldpassword(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="new_password_field" className="form-label">
              New Password
            </label>
            <input
              type="password"
              id="new_password_field"
              className="form-control"
              value={NewPassword}
              onChange={(e)=>setNewPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn update-btn w-100" disabled={isLoading}>
            {isLoading?"Updating Password...":"Update Password"}
          </button>
        </form>
      </div>
    </div>
    </UserLayout>
  )
}

export default UpdatePassword
