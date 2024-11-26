'use client';

import { saveRole } from '@/actions/users/save-role-user';
import { User } from '@/interfaces/user.interface';
import Link from 'next/link';
import { ChangeEvent, useState } from 'react';

interface Props {
  users?: User[];
}


export const UsersTable = ({users} : Props) => {

  const [errorMsg, setErrorMsg] = useState('');
  


 const changeRole = async (event : ChangeEvent<HTMLSelectElement>, userId: string ) =>{
    setErrorMsg('');
    const newRole = event.target.value;
    const {ok, message} = await saveRole(newRole,userId);
    if (!ok){
      setErrorMsg(message ?? '');
    }else{
      event.target.value = newRole
    }
    
    
  }


  return (
    <div>
      {
        errorMsg && (
          <span className='text-sm text-red-500'> { errorMsg} </span>
        )
      }
      <table className="min-w-full">
        <thead className="bg-gray-200 border-b">
          <tr>
            <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left w-1/3">
              Email
            </th>
            <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left w-1/3">
              Full Name
            </th>
            <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left w-1/3">
              Role
            </th>           
            
          </tr>
        </thead>
        <tbody>

          {
            users!.map((user) => (

              <tr key={user.id} className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">

                
                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left w-1/3">
                  {user.email}
                </td>
                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left w-1/3">
                  {`${user.name}`}
                </td>
                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left w-1/3">
                  <select
                    className='text-sm text-gray-900 w-full p-2'
                    value= {user.role}
                    onChange={event => changeRole (event,user.id) }
                  >
                    <option value= 'admin'>
                      ADMIN
                    </option>
                    <option value= 'user'>
                      USER
                    </option>
                  </select>
                </td>
                

              </tr>

            ))
          }
        </tbody>
      </table>
    </div>
  )
}
