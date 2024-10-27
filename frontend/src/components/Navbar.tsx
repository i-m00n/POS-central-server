import { Menu } from 'lucide-react'
interface navbarProps{
  onMenuClick:()=>void;
}
export default function Navbar({ onMenuClick }:navbarProps) {
  
  return (
    <div className='bg-paleOrange h-16 px-3 sm:px-5 text-black font-bold rounded-t-lg flex items-center justify-between'>
      <button 
        className='lg:hidden text-bg-color p-2'
        onClick={onMenuClick}
      >
        <Menu size={20} />
      </button>
      <h1 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl text-arabic text-bg-color'>علي بابا</h1>
    </div>
  )
}