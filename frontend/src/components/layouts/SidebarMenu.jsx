import React from 'react'
import UserLayout from './UserLayout'
import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react';

const SidebarMenu = ({menuItems}) => {

const location = useLocation();

const [activeMenuItem, setActiveMenuItem] = useState(location.pathname);

const handleMenuItemClick =(menuItemUrl)=>{
    setActiveMenuItem(menuItemUrl);
}
  return (
    <>  
    <div className="list-group mt-5 ">
        {menuItems?.map((menuItem, index)=>(
      <Link
      key={index}
        to={menuItem.url}
        className={`fw-bold list-group-item list-group-item-action 
        ${activeMenuItem.includes(menuItem.url)?"active":""}`}
        onClick={()=> handleMenuItemClick(menuItem.url)}
        aria-current={
            activeMenuItem.includes(menuItem.url) ? "true" : "false"
        }
      >
        <i className={`${menuItem.icon} fa-fw pe-2`}></i> {menuItem.name}
      </Link>
        ))}
    
    </div>

    </>
  )
}

export default SidebarMenu
