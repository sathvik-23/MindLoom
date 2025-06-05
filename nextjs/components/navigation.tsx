'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, X, Brain, BookOpen, Target, BarChart3, Settings, Sparkles, User, LogOut, LogIn, UserPlus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/app/context/AuthContext'

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, loading, signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  
  const isAuthenticated = !!user
  
  // Get navigation items based on auth state
  const getNavItems = () => {
    const baseItems = [
      { name: 'Home', href: '/', icon: Brain },
    ];
    
    // Only show these items to authenticated users
    if (isAuthenticated) {
      baseItems.push(
        { name: 'Journal', href: '/journal', icon: BookOpen },
        { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
        { name: 'Goals', href: '/goals', icon: Target },
        { name: 'Insights', href: '/insights', icon: Sparkles },
        { name: 'Settings', href: '/settings', icon: Settings }
      );
    }
    
    return baseItems;
  };
  
  const navigation = getNavItems();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <nav className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300",
      scrolled ? "bg-black/80 backdrop-blur-xl border-b border-white/10" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <Brain className="h-8 w-8 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                <Sparkles className="h-4 w-4 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <span className="font-bricolage text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                MindLoom
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center">
            <div className="ml-10 flex items-baseline space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-white/10 text-white"
                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </div>
            
            {/* Auth buttons - desktop */}
            <div className="ml-4 flex items-center">
              {!loading && (
                isAuthenticated ? (
                  <div className="relative">
                    <button 
                      className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-all"
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                    >
                      <User className="h-4 w-4" />
                      <span>{user?.email?.split('@')[0]}</span>
                    </button>
                    
                    {/* User dropdown menu */}
                    {userMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-black/60 backdrop-blur-lg border border-white/10">
                        <div className="py-1" role="menu">
                          <Link 
                            href="/profile" 
                            className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <User className="h-4 w-4 mr-2" />
                            Profile
                          </Link>
                          <button
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
                            onClick={() => {
                              setUserMenuOpen(false)
                              handleSignOut()
                            }}
                          >
                            <LogOut className="h-4 w-4 mr-2" />
                            Sign out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Link
                      href="/auth/signin"
                      className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm font-medium bg-white/10 border border-white/10 text-white hover:bg-white/20 transition-colors"
                    >
                      <LogIn className="h-4 w-4" />
                      <span>Sign in</span>
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
                    >
                      <UserPlus className="h-4 w-4" />
                      <span>Sign up</span>
                    </Link>
                  </div>
                )
              )}
            </div>
          </div>
          
          <div className="md:hidden flex items-center">
            {/* Mobile auth button */}
            {!loading && !isAuthenticated && (
              <Link
                href="/auth/signin"
                className="mr-2 flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
              >
                <LogIn className="h-3 w-3" />
                <span>Sign in</span>
              </Link>
            )}
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={cn(
        "md:hidden transition-all duration-300 ease-out",
        isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0 overflow-hidden"
      )}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-black/90 backdrop-blur-xl border-b border-white/10">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-all",
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            )
          })}
          
          {/* Mobile auth items */}
          {!loading && isAuthenticated && (
            <>
              <Link
                href="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-all"
              >
                <User className="h-5 w-5" />
                <span>Profile</span>
              </Link>
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleSignOut();
                }}
                className="flex w-full items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-all"
              >
                <LogOut className="h-5 w-5" />
                <span>Sign out</span>
              </button>
            </>
          )}
          
          {!loading && !isAuthenticated && (
            <Link
              href="/auth/signup"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium bg-indigo-600/30 text-white hover:bg-indigo-600/50 transition-all"
            >
              <UserPlus className="h-5 w-5" />
              <span>Create Account</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}