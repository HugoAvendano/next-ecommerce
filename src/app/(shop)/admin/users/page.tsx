
export const revalidate = 0;
import { redirect } from 'next/navigation';

import { getPaginatedAllUsers } from '@/actions';
import { Pagination, Title } from '@/components';


import { UsersTable } from './ui/UsersTable';
import { auth } from '@/auth.config';

interface Props {
  searchParams: {
    page?: string,
    take?: string
  }
}



export default async function UsersPage({ searchParams }: Props) {

  const session = await auth();

  if(session?.user.role !== 'admin'){
    redirect('/')
  }

  const page = searchParams.page ? parseInt(searchParams.page) : 1;

  const resp = await getPaginatedAllUsers({page});
  const {ok, users,totalPages} = resp
  
  if(!resp?.ok){
    redirect('/auth/login');
  }

  



  return (
    <>
      <Title title="User Maintaince" />

      <div className="mb-10">
        <UsersTable users={users}/>
        <Pagination totalPages={totalPages!} />
      </div>
    </>
  );
}