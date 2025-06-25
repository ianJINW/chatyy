import { Link } from 'react-router-dom'

const Navbar: React.FC = () => {
  return (
    <header className='bg-white dark:bg-gray-900 shadow-md'>
      <div className='container mx-auto flex justify-between items-center py-4 px-6'>
        {/* Logo */}
        <Link
          to='/'
          className='text-2xl font-bold text-blue-500 dark:text-blue-400'
        >
          Art-Home
        </Link>

        {/* Desktop nav links */}
        <nav className='hidden md:flex gap-6 items-center text-gray-700 dark:text-gray-200'>
          <Link
            to='/gallery'
            className='flex items-center gap-2 hover:text-blue-500 dark:hover:text-blue-400'
          >
            Gallery
          </Link>
          <Link
            to='/chat'
            className='flex items-center gap-2 hover:text-blue-500 dark:hover:text-blue-400'
          >
            Chat
          </Link>
          <Link
            to='/artists'
            className='flex items-center gap-2 hover:text-blue-500 dark:hover:text-blue-400'
          >
            Artists
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
