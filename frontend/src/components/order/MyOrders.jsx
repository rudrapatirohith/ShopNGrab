import React, { useEffect } from 'react'
import { useMyOrdersQuery } from '../../redux/api/orderApi'
import toast from 'react-hot-toast';
import Loader from "../layouts/Loader"
import {MDBDataTable} from 'mdbreact'
import { Link } from 'react-router-dom';

const MyOrders = () => {

    const {data, isLoading,error} = useMyOrdersQuery();
  
    useEffect(()=>{
        if(error){
            toast.error(error?.data?.message);
        }
    },[error])

    console.log(data);

    const setOrders = () => {

        const orders = {
            columns:[
                {
                    label:"ID",
                    field:"id",
                    sort:"asc",
                },
                {
                    label:"Amount",
                    field:"amount",
                    sort:"asc",
                },
                {
                    label:"Payment_Status",
                    field:"paymentStatus",
                    sort:"asc",
                },
                {
                    label:"Order_Status",
                    field:"orderStatus",
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

        data?.order?.forEach((order)=>{
            orders.rows.push({
                    id: order?._id,                                                                                                               
                    amount : `$${order?.totalAmount}`,
                    paymentStatus: order?.paymentInfo?.status?.toUpperCase(),
                    orderStatus: order?.orderStatus,
                    actions: (
                        <>

                        <Link to={`/me/order/${order?._id}`} className="btn btn-primary"><i className="fa fa-eye"></i></Link>
                        <Link to={`/invoice/order/${order?._id}`} className="btn btn-success ms-2"><i className="fa fa-print"></i></Link>

                        </>
                    ),
            })
        })

        return orders;
    }

    if(isLoading ) return <Loader />
    return (
    <>
     <div>
        <h1 className="my-5">{data?.order?.length} Orders</h1>

        <MDBDataTable

        data={setOrders()}
        className='px-3'
        bordered
        striped
        hover

        />
    </div>
    </>
  )
}

export default MyOrders
