"use client";

import { Fragment, type FunctionComponent } from "react";
import type { AuthorizationServerInformation, SessionUser } from "@/core/interfaces/Auth";
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { getResource } from "@/core/api";
import Link from "next/link";
import Image from "next/image";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Star Systems", href: "/systems" },
  { name: "Galnet News", href: "/galnet" },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const MainNavigation: FunctionComponent = () => {
  const { data } = useSession();
  const pathname = usePathname();
  const user = data && data?.user
    ? (data.user as SessionUser)
    : null;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const makeFrontierSSOLoginRequest = async () => {
    const { data: authorizationDetails } =
      await getResource<AuthorizationServerInformation>("auth/frontier/login");
    window.location.href = authorizationDetails.authorization_url;
  };

  return (
    <Disclosure as="nav" className="main-nav__nav">
      {({ open }) => (
        <>
          <div className="main-nav__menu lg:px-18 backdrop-blur border-b border-orange-900/40 px-6 uppercase md:px-12">
            <div className="relative flex h-10 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <DisclosureButton className="hover:text-glow__orange inline-flex items-center justify-center rounded-md p-2 text-gray-400 focus:outline-none">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </DisclosureButton>
              </div>
              <div className="flex flex-1 items-center justify-center sm:justify-start">
                <div className="flex items-center gap-3">
                  <i className="icarus-terminal-logo text-glow__orange text-3xl"></i>
                </div>
                <div className="hidden sm:ml-6 sm:block lg:hidden">
                  <div className="flex space-x-4">
                    {navItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          isActive(item.href) ? "font-bold text-glow__orange active" : "text-neutral-400 hover:text-white",
                          "fx-nav-link px-3 py-2 text-xs uppercase tracking-widest transition-colors",
                        )}
                        aria-current={isActive(item.href) ? "page" : undefined}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {!user ? (
                  <button
                    className="hidden flex items-center gap-1 rounded-lg border border-neutral-900 bg-neutral-900 px-3 py-1 uppercase hover:scale-x-105"
                    onClick={makeFrontierSSOLoginRequest}
                  >
                    <i className="icarus-terminal-planet text-lg"></i>
                    <span className="text-glow text-xs">Login with frontier</span>
                  </button>
                ) : (
                  <Menu as="div" className="relative ml-3">
                  <div className="flex items-center gap-3">
                    <MenuButton className="align-items flex items-center gap-3 text-xs focus:outline-none">
                      <span className="text-glow__orange text-xs[ hidden md:flex">
                        CMDR {user.commander.name}
                      </span>
                      <Image
                        className="h-10 w-10 rounded-lg border-2 border-neutral-700"
                        width={32}
                        height={32}
                        src="/me.jpg?v=2.0"
                        alt=""
                      />
                      <i className="icarus-terminal-chevron-down text-glow__white"></i>
                    </MenuButton>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <MenuItems className="absolute right-0 z-10 mt-2 w-52 origin-top-right border border-orange-900/40 bg-black/95 backdrop-blur focus:outline-none">
                      {/* Corner bracket accents */}
                      <div className="pointer-events-none absolute -left-px -top-px h-3 w-3 border-l-2 border-t-2 border-orange-500" />
                      <div className="pointer-events-none absolute -right-px -top-px h-3 w-3 border-r-2 border-t-2 border-orange-500" />
                      <div className="pointer-events-none absolute -bottom-px -left-px h-3 w-3 border-b-2 border-l-2 border-orange-500" />
                      <div className="pointer-events-none absolute -bottom-px -right-px h-3 w-3 border-b-2 border-r-2 border-orange-500" />
                      <MenuItem>
                        {({ active }) => (
                          <Link
                            href="#"
                            className={classNames(
                              active ? "bg-orange-900/20 text-orange-300" : "text-neutral-400",
                              "block border-b border-orange-900/20 px-4 py-2.5 text-xs uppercase tracking-widest transition-colors",
                            )}
                          >
                            Your Profile
                          </Link>
                        )}
                      </MenuItem>
                      <MenuItem>
                        {({ active }) => (
                          <Link
                            href="#"
                            className={classNames(
                              active ? "bg-orange-900/20 text-orange-300" : "text-neutral-400",
                              "block border-b border-orange-900/20 px-4 py-2.5 text-xs uppercase tracking-widest transition-colors",
                            )}
                          >
                            Settings
                          </Link>
                        )}
                      </MenuItem>
                      <MenuItem>
                        {({ active }) => (
                          <Link
                            href="#"
                            className={classNames(
                              active ? "bg-orange-900/20 text-orange-300" : "text-neutral-400",
                              "block px-4 py-2.5 text-xs uppercase tracking-widest transition-colors",
                            )}
                          >
                            Sign out
                          </Link>
                        )}
                      </MenuItem>
                    </MenuItems>
                  </Transition>
                </Menu>
                )}
              </div>
            </div>
          </div>

          <DisclosurePanel className="sm:hidden">
            <div className="space-y-1 border-b border-orange-900/20 bg-black/90 px-2 pb-3 pt-2 backdrop-blur">
              {navItems.map((item) => (
                <DisclosureButton
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    isActive(item.href) ? "text-glow__orange font-bold" : "text-neutral-400",
                    "block px-3 py-2 text-xs uppercase tracking-widest transition-colors",
                  )}
                  aria-current={isActive(item.href) ? "page" : undefined}
                >
                  {item.name}
                </DisclosureButton>
              ))}
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
};

export default MainNavigation;
