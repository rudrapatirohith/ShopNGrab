import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import Loader from "../layouts/Loader"
import { Link, useNavigate } from 'react-router-dom';
import PageTitle from '../layouts/PageTitle';
import AdminLayout from '../layouts/AdminLayout'
import { PRODUCT_CATEGORIES } from '../../constants/constants';
import { useCreateProductMutation } from '../../redux/api/productsApi';

const NewProduct = () => {

    const naviagte = useNavigate();

    const [product,setProduct] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
        seller: "",
    })

    const [createProduct,{isSuccess,isLoading,error}]=useCreateProductMutation();

    const {name,description,price,category,stock,seller} = product;


    useEffect(()=>{
        if(error){
            toast.error(error?.data?.message);
        }
        if(isSuccess){
            toast.success("Product Created");
            naviagte("/admin/products")
        }
    },[error,isSuccess]);

    const onChange = (e) =>{
        setProduct({...product,[e.target.name]:e.target.value})
    }

    const submitHandler = (e) => {
        e.preventDefault();
        createProduct(product)
    }
  return (
    <AdminLayout>
        <PageTitle title={"Create New Product"}/>
      <div className="row wrapper">
      <div className="col-10 col-lg-10 mt-5 mt-lg-0">
        <form className="shadow rounded bg-body" onSubmit={submitHandler}>
          <h2 className="mb-4">New Product</h2>
          <div className="mb-3">
            <label for="name_field" className="form-label"> Name </label>
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
            <label for="description_field" className="form-label">
              Description
            </label>
            <textarea
              className="form-control"
              id="description_field"
              rows="8"
              name="description"
              value={description}
              onChange={onChange}
            ></textarea>
          </div>

          <div className="row">
            <div className="mb-3 col">
              <label for="price_field" className="form-label"> Price </label>
              <input
                type="text"
                id="price_field"
                className="form-control"
                name="price"
                value={price}
                onChange={onChange}
              />
            </div>

            <div className="mb-3 col">
              <label for="stock_field" className="form-label"> Stock </label>
              <input
                type="number"
                id="stock_field"
                className="form-control"
                name="stock"
                value={stock}
                onChange={onChange}
              />
            </div>
          </div>
          <div className="row">
            <div className="mb-3 col">
              <label for="category_field" className="form-label"> Category </label>
              <select className="form-select" id="category_field" name="category"   value={category} onChange={onChange}>
                {PRODUCT_CATEGORIES?.map((category)=>(
                    <option key={category} value={category}>{category}</option>
                    ))}
              </select>
            </div>
            <div className="mb-3 col">
              <label for="seller_field" className="form-label"> Seller Name </label>
              <input
                type="text"
                id="seller_field"
                className="form-control"
                name="seller"
                value={seller}
                onChange={onChange}
              />
            </div>
          </div>
          <button type="submit" className="btn w-100 py-2" disabled={isLoading}>{isLoading? "Creating ...":"CREATE"}</button>
        </form>
      </div>
    </div>

    </AdminLayout>
  )
}

export default NewProduct
