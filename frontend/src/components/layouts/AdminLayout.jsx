import React from 'react'
import SidebarMenu from './SidebarMenu'

const AdminLayout = ({children}) => {

    const menuItems=[{
        name:"Dashboard",
        url: "/admin/dashboard",
        icon:"fas fa-tachometer-alt",
    },
    {
        name:"New Product",
        url: "/admin/product/new",
        icon:"fas fa-plus",
    },
    {
        name:"Products",
        url: "/admin/products",
        icon:"fab fa-product-hunt",
    },
    {
        name:"Order",
        url: "/admin/orders",
        icon:"fas fa-receipt",
    },
    {
        name:"Users",
        url: "/admin/users",
        icon:"fas fa-user",
    },
    {
        name:"Reviews",
        url: "/admin/reviews",
        icon:"fas fa-star",
    },
    ];

  return (
    <div>
      <div className="container mt-4">

        <h2 className="text-center fw-bolder mb-4">Admin Dashboard</h2>

      </div>

 
        <div className="row justify-content-around">
            <div className="col-12 col-lg-3 mb-4">
                <SidebarMenu menuItems={menuItems}/>
            </div>
            <div className="col-12 col-lg-8 user-dashboard">{children}</div>
        </div>
      </div>
  )
}

export default AdminLayout
