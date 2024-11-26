'use client'

import { logout } from "@/actions"
import { useUIStore } from "@/store"
import clsx from "clsx"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { IoCloseOutline, IoListOutline, IoLogIn, IoLogInOutline, IoLogOutOutline, IoPeopleOutline, IoPersonOutline, IoSearchOutline, IoShirtOutline, IoTicketOutline } from "react-icons/io5"

export const Sidebar = () => {

  const isSideMenuOpen = useUIStore(state => state.isSideMenuOpen);
  const closeMenu = useUIStore(state => state.closeSideMenu);

  const { data: session } = useSession();
  
  const isAuthenticated = !!session?.user;
  const isAdmin = isAuthenticated && session.user.role === 'admin';

  const onLogout = async () => {
    await logout();
    window.location.replace('/')
  }


  return (
    <div>
      {/* Background: black */}
      {
        isSideMenuOpen && (
          <div className="fixed top-0 left-0 w-screen h-screen z-10 bg-black opacity-30" />
        )
      }




      {/* Blur */}
      {
        isSideMenuOpen && (
          <div
            onClick={() => closeMenu()}
            className="fade-in fixed top-0 left-0 w-screen h-screen z-10 backdrop-filter backdrop-blur-sm"
          />
        )
      }


      {/* SideMenu */}

      <nav className={
        clsx(
          " fixed p-5 right-0 top-0 w-full sm:w-[500px] h-screen bg-white z-20 shadow-2xl transition-all duration-300",
          {
            "translate-x-full": !isSideMenuOpen
          }
        )
      }>

        <IoCloseOutline
          size={30}
          className="absolute top-5 right-5 cursor-pointer"
          onClick={() => closeMenu()}
        />

        <div className="relative mt-14">
          <IoSearchOutline size={20} className="absolute top-3 left-2" />
          <input
            type="text"
            placeholder="Search"
            className="w-full rounded bg-gray-100 pl-10 py-3  text-sm font-semibold focus:outline-none focus:border-gray-200 focus:border-2"
          />

        </div>

        {/* Menu */}
        {isAuthenticated && (
          <>
            <Link
              href="/profile"
              className="flex items-center mt-3 p-2 hover:bg-gray-100 rounded transition-all"
              onClick={() => closeMenu()}
            >
              <IoPersonOutline size={25} />
              <span className="ml-3 text-sm font-semibold">Profile</span>
            </Link>

            <Link
              href="/orders"
              className="flex items-center mt-3 p-2 hover:bg-gray-100 rounded transition-all"
              onClick={() => closeMenu()}
            >
              <IoTicketOutline size={25} />
              <span className="ml-3 text-sm font-semibold">Orders</span>
            </Link>
          </>
        )}

        {!isAuthenticated && (
          <Link
            href="/auth/login"
            className="flex items-center mt-3 p-2 hover:bg-gray-100 rounded transition-all"
            onClick={() => closeMenu()}
          >
            <IoLogInOutline size={25} />
            <span className="ml-3 text-sm font-semibold">Login</span>
          </Link>)
        }

        {isAuthenticated && (
          <button
            className="flex w-full items-center mt-3 p-2 hover:bg-gray-100 rounded transition-all"
            onClick={() => {onLogout(); closeMenu()}}
          >
            <IoLogOutOutline size={25} />
            <span className="ml-3 text-sm font-semibold">Logout</span>
          </button>)
        }

        

        {isAdmin && (
          <>
            <div className="w-full h-px bg-gray-200 my-10" />
            <Link
              href="/admin/products"
              className="flex items-center mt-3 p-2 hover:bg-gray-100 rounded transition-all"
              onClick={() => closeMenu()}
            >
              <IoShirtOutline size={25} />
              <span className="ml-3 text-sm font-semibold">Products</span>
            </Link>

            <Link
              href="/admin/orders"
              className="flex items-center mt-3 p-2 hover:bg-gray-100 rounded transition-all"
              onClick={() => closeMenu()}
            >
              <IoTicketOutline size={25} />
              <span className="ml-3 text-sm font-semibold">Orders</span>
            </Link>

            <Link
              href="/admin/users"
              className="flex items-center mt-3 p-2 hover:bg-gray-100 rounded transition-all"
              onClick={() => closeMenu()}
            >
              <IoPeopleOutline size={25} />
              <span className="ml-3 text-sm font-semibold">Users</span>
            </Link>
          </>
        )}

      </nav>

    </div>
  )
}
