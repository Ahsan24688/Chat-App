import { Link, Outlet } from 'react-router'

const Home = () => {
  return (
    <div className='min-h-screen w-full bg-amber-200 px-4 py-6 sm:px-8 sm:py-10'>
      <nav className='mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 rounded-2xl bg-amber-400 px-5 py-5 shadow-md sm:flex-row sm:px-8'>
        <Link to='/' className='text-2xl font-bold text-amber-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-950'>
          Chat App
        </Link>
        <ul className='flex flex-wrap justify-center gap-4 font-medium sm:gap-6'>
          <li>
            <Link to='/' className='rounded-sm hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-950'>Home</Link>
          </li>
          <li>
            <Link to='/register' className='rounded-sm hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-950'>Register</Link>
          </li>
          <li>
            <Link to='/login' className='rounded-sm hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-950'>Login</Link>
          </li>
        </ul>
      </nav>

      <main className='mx-auto mt-8 w-full max-w-7xl'>
        <section className='rounded-2xl bg-amber-200 px-5 py-8 shadow-md sm:px-10 sm:py-12'>
          <div className='mx-auto max-w-2xl text-center'>
            <p className='mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-amber-900'>Welcome</p>
            <h1 className='text-3xl font-bold leading-tight text-amber-950 sm:text-4xl'>Your conversations start here</h1>
            <p className='mt-4 text-base leading-7 text-amber-950/80 sm:text-lg'>
              Enter your credentials to register or log in to your account.
            </p>
          </div>
          <div className='mt-8 rounded-xl bg-amber-400 p-4 sm:mt-10 sm:p-8'>
            <Outlet />
          </div>
        </section>

        <footer className='mt-8 px-4 pb-2 text-center'>
          <p className='text-lg font-semibold text-amber-900'>Hello</p>
        </footer>
      </main>
    </div>
  )
}

export default Home