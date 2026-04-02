"use client";

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [credentials, setCredentials] = useState({
      staffId: "",
      password: "",
    });

    const handleChange = (e) => {
      setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      console.log("Authenticating staff:", credentials);
      // TODO: Connect to Django backend for staff authentication
    };

  return (
    <>
      
    </>
  );
}
