
import Link from 'next/link'
import { Icons } from './Icon'
import { buttonVariants } from './ui/Button'
import { getAuthSession } from '@/lib/auth'
import UserAccount from './UserAccount'
import SearchBar from './SearchBar'

const Navbar = async () => {

  const session = await getAuthSession();

  return (
    <div className=' fixed top-0 inset-x-0 h-fit bg-zinc-100 border-b border-zinc-300 z-[10] py-2'>
      <div className=' container max-w-7xl h-full mx-auto flex items-center justify-between gap-2'>
        {/* {logo} */}
        <Link href='/' className=' flex gap-2 items-center'>
          <Icons.logo className=' h-8 w-8 sm:h-6 sm:w-6'/>
          <p className=' hidden text-zinc-700 text-sm font-medium md:block'>readit克龍體</p>
        </Link>
        {/* {search bar} */}
        <SearchBar />
        {
          session?.user ? (
            // <p>4</p>
            <UserAccount user={session.user} />
          ) : (
            <Link href='/sign-in' className={buttonVariants()}>登入</Link>
          )
        }
      </div>
    </div>
  )
}

export default Navbar