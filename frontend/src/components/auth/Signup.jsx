import React, { useEffect, useState } from 'react'
import { useSignUpMutation } from '../../redux/api/authApi';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PageTitle from '../layouts/PageTitle'

const Signup = () => {
  
    const navigate = useNavigate();

    const [user,setUser]=useState({
        name: "",
        email: "",
        password: "",
    });

    const [confirmPassword, setConfirmPassword]= useState('');

    const {name,email,password} = user;


    const [register , {isLoading,data,error}]=useSignUpMutation();

    const {isAuthenticated} = useSelector((state)=>state.auth)

    useEffect(()=>{
      if(isAuthenticated){
        navigate('/');
      }
        if(error) {
        toast.error(error?.data?.message);
        }
    },[error,isAuthenticated]);


    // console.log(data);

   const SubmitHandler=(e)=>{
        e.preventDefault();

        const signup = {name,email,password};
        register(signup);
    };


    const onChange = (e) =>{
        setUser({...user,[e.target.name]:e.target.value})
    }


  return (
    <>
    <PageTitle title={"SignUp"} />
    <div className="row wrapper">
      <div className="col-10 col-lg-5">
        <form
          className="shadow rounded bg-body"
          onSubmit={SubmitHandler}
        >
          <h2 className="mb-4">Register</h2>

          <div className="mb-3">
            <label for="name_field" className="form-label">Name</label>
            <input
              type="text"
              id="name_field"
              className="form-control"
              name="name"
              value={name}
              onChange={onChange}
            />
          </div>

          <div className="mb-3">
            <label for="email_field" className="form-label">Email</label>
            <input
              type="email"
              id="email_field"
              className="form-control"
              name="email"
              value={email}
              onChange={onChange}
            />
          </div>

          <div className="mb-3">
            <label for="password_field" className="form-label">Password</label>
            <input
              type="password"
              id="password_field"
              className="form-control"
              name="password"
              value={password}
              onChange={onChange}
            />
          </div>
          <div className="mb-3">
            <label for="password_field" className="form-label">Confirm Password</label>
            <input
              type="password"
              id="password_field"
              className="form-control"
              name="password"
              value={confirmPassword}
              onChange={(e)=>setConfirmPassword(e.target.value)}
            />
          </div>

          <button id="register_button" type="submit" className="btn w-100 py-2" disabled={password!==confirmPassword }>
            REGISTER
          </button>
        </form>
      </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js"></script>

    <script src="https://kit.fontawesome.com/9edb65c86a.js"></script>
    </>
     )
}

export default Signup
