"use client";

import React, {useEffect, useState} from 'react';
import { render } from 'react-dom';
import {Button, DatePicker, message} from 'antd';
import {useRouter} from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    if(router) {
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <div style={{}}>
    </div>
  );
}
