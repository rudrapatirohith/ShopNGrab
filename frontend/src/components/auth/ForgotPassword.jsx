import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useForgotPasswordMutation } from '../../redux/api/userApi';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import PageTitle from '../layouts/PageTitle';

const ForgotPassword = () => {
    const[email,setEmail] = useState("");
    const navigate = useNavigate();

    const[forgotPassword,{isLoading,error,isSuccess}] = useForgotPasswordMutation();

    const {userAuthenticated} = useSelector((state)=>state.auth);

useEffect(()=>{
  if(userAuthenticated){
    navigate("/");
  }

  if(error){
    toast.error(error?.data?.message);
  }

  if(isSuccess){
    toast.success("Email Sent. Please check your inbox");
  }

},[userAuthenticated,error,isSuccess]);

const submitHandler = (e) =>{
  e.preventDefault();

  forgotPassword(({email}));
  
}



  return (
    <>
    <PageTitle title={"Forgot Password"} />
      <div className="row wrapper">
      <div className="col-10 col-lg-5">
        <form
          className="shadow rounded bg-body"
          onSubmit={submitHandler}
        >
          <h2 className="mb-4">Forgot Password</h2>
          <div className="mt-3">
            <label htmlForor="email_field" className="form-label">Enter Email</label>
            <input
              type="email"
              id="email_field"
              className="form-control"
              name="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />
          </div>

          <button
            id="forgot_password_button"
            type="submit"
            className="btn w-100 py-2"
          >
            Send Email
          </button>
        </form>
      </div>
    </div>
    </>
  )
}

export default ForgotPassword
