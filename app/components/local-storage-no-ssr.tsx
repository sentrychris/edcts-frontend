"use client"

import { useEffect, useState } from "react";


function useLocalStorage<T>(key: string, fallbackValue: string) {
  const [value, setValue] = useState(fallbackValue);
  useEffect(() => {
      let stored = localStorage.getItem(key);
      setValue(stored ? stored : fallbackValue);
  }, [fallbackValue, key]);

  useEffect(() => {
      localStorage.setItem(key, value as string);
  }, [key, value]);

  return value;
}

const LocalStorageNoSSR = () => {
  return (
    <></>
  )
}

export default LocalStorageNoSSR