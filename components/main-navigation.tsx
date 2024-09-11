"use client";

import { Fragment, type FunctionComponent } from "react";
import type { AuthorizationServerInformation, SessionUser } from "@/core/interfaces/Auth";
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import { usePathname } from "next/navigation";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import { getResource } from "@/core/api";
import Link from "next/link";
import Image from "next/image";

const navigation = [
  { name: "Home", href: "/", key: "" },
  { name: "Star Systems", href: "/systems", key: "systems" },
  { name: "Stations", href: "/systems", key: "stations" },
  { name: "Carrier Trips", href: "/fleet-carriers", key: "fleet-carriers" },
  { name: "Galnet News", href: "/galnet", key: "galnet" },
  { name: "Map [alpha]", href: "/galaxy-map", key: "galaxy-map" },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const MainNavigation: FunctionComponent = () => {
  const { data } = useSession();
  const user = data && data?.user
    ? (data.user as SessionUser)
    : null;
  
  const currentPath = usePathname().split("/")[1];

  const makeFrontierSSOLoginRequest = async () => {
    const { data: authorizationDetails } =
      await getResource<AuthorizationServerInformation>("auth/frontier/login");
    window.location.href = authorizationDetails.authorization_url;
  };

  return (
    <Disclosure as="nav" className="main-nav__nav">
      {({ open }) => (
        <>
          <div className="main-nav__menu lg:px-18 border-b border-neutral-900 px-6 uppercase md:px-12">
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
                  <i className="icarus-terminal-logo text-5xl"></i>
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          currentPath === item.key ? "font-bold text-glow__orange" : "text-gray-300 hover:text-glow__blue", // Set current based on the current URL
                          "rounded-md px-3 py-2 text-sm hover:text-glow__blue"
                        )}
                        aria-current={currentPath === item.key ? "page" : undefined}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <div className="hidden absolute inset-y-0 right-0 md:flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {!user ? (
                  <button
                    className="flex items-center gap-1 rounded-lg border border-neutral-900 bg-neutral-900 px-3 py-1 uppercase hover:scale-x-105"
                    onClick={makeFrontierSSOLoginRequest}
                  >
                    <i className="icarus-terminal-planet text-lg"></i>
                    <span className="text-glow text-sm">Login with frontier</span>
                  </button>
                ) : (
                  <Menu as="div" className="relative ml-3">
                  <div className="flex items-center gap-3">
                    <MenuButton className="align-items flex items-center gap-3 text-sm focus:outline-none">
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
                    <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <MenuItem>
                        {({ active }) => (
                          <Link
                            href="#"
                            className={classNames(
                              active ? "bg-zinc-100" : "",
                              "block px-4 py-2 text-sm text-gray-700",
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
                              active ? "bg-zinc-100" : "",
                              "block px-4 py-2 text-sm text-gray-700",
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
                              active ? "bg-zinc-100" : "",
                              "block px-4 py-2 text-sm text-gray-700",
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
            <div className="space-y-1 bg-black/80 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <DisclosureButton
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    currentPath === item.key ? "text-glow__orange" : "text-gray-300",
                    "block rounded-md px-3 py-2 text-base font-medium",
                  )}
                  aria-current={currentPath === item.key ? "page" : undefined}
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
