import { NavLink } from 'react-router-dom'
import { X } from 'lucide-react'

interface navbarProps{
  isOpen:boolean,
  onClose():void
}
export default function RightNavbar({ isOpen, onClose }:navbarProps) {
  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-lighterGray bg-opacity-90 lg:hidden z-20"
          onClick={onClose}
        />
      )}
      
      <aside className={`
        fixed lg:sticky top-0 right-0 z-30
        h-full lg:h-[calc(100vh-4rem)] 
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        bg-white lg:bg-transparent
        w-[80%] sm:w-72 lg:w-1/6
        flex flex-col
      `}>
        <button 
          className='lg:hidden absolute top-3 right-3 text-gray-500 p-2'
          onClick={onClose}
        >
          <X size={20} />
        </button>
        
        <nav className='
          flex-1
          border-x-2 border-darkgray
          shadow-xl shadow-realyDarkGray
          h-full
        '>
          <ul className='
            flex flex-col 
              sm:text-lg lg:text-2xl 
            gap-4 sm:gap-6 
            p-4 sm:p-6 
            h-full
            font-bold
          '>
            <li className='mt-12 lg:mt-0 '>
              <NavLink
                className={({isActive}) => `nav-link block py-2 ${isActive ? 'text-whi' : 'text-darkOrange'}`}
                to={`/all-sales`}
                onClick={onClose}
              >
                البيع الكلي
              </NavLink>
            </li>
            <li>
              <NavLink
                className={({isActive}) => `nav-link block py-2 ${isActive ? 'text-whi' : 'text-darkOrange'}`}
                to={`/sales`}
                onClick={onClose}
              >
                كل البيع
              </NavLink>
            </li>
            <li>
              <NavLink
                className={({isActive}) => `nav-link block py-2 ${isActive ? 'text-whi' : 'text-darkOrange'}`}
                to={`/returns`}
                onClick={onClose}
              >
                كل المرتجع
              </NavLink>
            </li>
            <li>
              <NavLink
                className={({isActive}) => `nav-link block py-2 ${isActive ? 'text-whi' : 'text-darkOrange'}`}
                to={`/categories`}
                onClick={onClose}
              >
                البضاعة
              </NavLink>
            </li>
            <li>
              <NavLink
                className={({isActive}) => `nav-link block py-2 ${isActive ? 'text-whi' : 'text-darkOrange'}`}
                to={`/customers`}
                onClick={onClose}
              >
                العملاء
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  )
}