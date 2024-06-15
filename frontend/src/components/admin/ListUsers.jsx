import React, { useEffect } from 'react'
import toast from 'react-hot-toast';
import Loader from "../layouts/Loader"
import {MDBDataTable} from 'mdbreact'
import { Link } from 'react-router-dom';
import PageTitle from '../layouts/PageTitle';
import AdminLayout from '../layouts/AdminLayout';
import { useGetAdminUsersQuery } from '../../redux/api/userApi';

const ListUsers = () => {

    const {data, isLoading,error} = useGetAdminUsersQuery();
  
    // const [deleteUser,{error: deleteError, isSuccess,isLoading:isDeleteLoading} ] = useDeleteOrderMutation();
    
    useEffect(()=>{
        if(error){
            toast.error(error?.data?.message);
        }      
        // if(deleteError){
        //     toast.error(deleteError?.data?.message);
        // }
        // if(isSuccess){
        //     toast.success("User Deleted");
        // }
        // console.log(deleteError);
        
    },[error])

    // console.log(data);
    // const deleteUserHandler = (id) => {
    //     deleteUser(id);
    // }
    


    const setUsers = () => {

        const users = {
            columns:[
                {
                    label:"ID",
                    field:"id",
                    sort:"asc",
                },
                {
                    label:"NAME",
                    field:"name",
                    sort:"asc",
                },
                {
                    label:"EMAIL",
                    field:"email",
                    sort:"asc",
                },
                {
                    label:"ROLE",
                    field:"role",
                    sort:"asc",
                },
                {
                    label:"Actions",
                    field:"actions",
                    sort:"asc",
                },
            ],
            rows:[],
        };

        data?.user?.forEach((user)=>{
            users.rows.push({
                    id: user?._id,                                                                                                               
                    name: user?.name,
                    email: user?.email,
                    role: user?.role,
                    actions: (
                        <>

                        <Link to={`/admin/users/delete/${user?._id}`} className="btn btn-outline-primary"><i className="fa fa-pencil"></i></Link>
                        <button  className="btn btn-outline-danger ms-2" 
                        // onClick={()=>deleteUserHandler(user?._id)} disabled={isDeleteLoading}
                        >
                            <i className="fa fa-trash" >  </i>
                            </button>

                        </>
                    ),
            })
        })
        console.log(users);
        return users;
    }

    
    if(isLoading ) return <Loader />
    return (
    <AdminLayout>
    <PageTitle title={"All Users"} />
     <div>
        <h1 className="my-5">{data?.user?.length} Users </h1>

        <MDBDataTable

        data={setUsers()}
        className='px-3'
        bproducted
        striped
        hover

        />
    </div>
    </AdminLayout>
  )
}

export default ListUsers
