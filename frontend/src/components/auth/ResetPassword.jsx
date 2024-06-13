import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useResetPasswordMutation } from '../../redux/api/userApi';
import toast from 'react-hot-toast';
import PageTitle from '../layouts/PageTitle'

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const params = useParams();
  const navigate = useNavigate();
  const [resetPassword, { isLoading, error, isSuccess }] = useResetPasswordMutation();
  
  const { userAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userAuthenticated) {
      navigate('/');
    }

    if (error) {
      toast.error(error?.data?.message);
    }

    if (isSuccess) {
      toast.success('Password Reset Successfully');
      navigate('/login');
    }
  }, [userAuthenticated, error, isSuccess, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return toast.error('Password does not match. Try again!');
    }

    const data = { password, confirmPassword };
    console.log({token: params?.token, body: data});
    resetPassword({ token: params?.token, body: data });
  };

  return (
    <>
    <PageTitle title={"Reset Password"} />
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form className="shadow rounded bg-body" onSubmit={submitHandler}>
            <h2 className="mb-4">New Password</h2>

            <div className="mb-3">
              <label htmlFor="password_field" className="form-label">Password</label>
              <input
                type="password"
                id="password_field"
                className="form-control"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="confirm_password_field" className="form-label">Confirm Password</label>
              <input
                type="password"
                id="confirm_password_field"
                className="form-control"
                name="confirm_password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button id="new_password_button" type="submit" className="btn w-100 py-2" disabled={isLoading}>
              Set Password
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
