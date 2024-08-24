"use client";

import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";
import Link from "next/link";
import Image from "next/image";

const navigation = [
  { name: "Home", href: "/", current: true },
  { name: "Star Systems", href: "/systems", current: false },
  { name: "Galaxy Map", href: "/galaxy-map", current: false },
  { name: "Carrier Journeys", href: "/fleet-carriers", current: false },
  { name: "Galnet News", href: "/galnet", current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function MainNavigation() {
  return (
    <Disclosure as="nav" className="main-nav__nav">
      {({ open }) => (
        <>
          <div className="main-nav__menu border-b border-neutral-900 px-6 uppercase md:px-12 lg:px-24">
            <div className="relative flex h-10 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-zinc-700 hover:text-white focus:outline-none">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
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
                          item.current ? "font-bold text-white" : "text-gray-300 hover:text-white",
                          "rounded-md px-3 py-2 text-sm",
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <Menu as="div" className="relative ml-3">
                  <div className="flex items-center gap-3">
                    <Menu.Button className="align-items flex items-center gap-3 text-sm focus:outline-none">
                      <span className="text-glow__orange text-xs[ hidden md:flex">
                        CMDR Shaki Kazaro
                      </span>
                      <Image
                        className="h-10 w-10 rounded-lg border-2 border-neutral-700"
                        width={32}
                        height={32}
                        src="/me.jpg?v=2.0"
                        alt=""
                      />
                      <i className="icarus-terminal-chevron-down text-glow__white"></i>
                    </Menu.Button>
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
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
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
                      </Menu.Item>
                      <Menu.Item>
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
                      </Menu.Item>
                      <Menu.Item>
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
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2 bg-black/80">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-orange-800 text-glow"
                      : "text-gray-300 hover:bg-zinc-700 hover:text-white",
                    "block rounded-md px-3 py-2 text-base font-medium",
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
