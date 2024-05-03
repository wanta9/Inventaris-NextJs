"use client";

import React from 'react';
import { HomeOutlined, InboxOutlined, UserOutlined, DropboxOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, Space, theme } from 'antd';
import { useRouter } from "next/navigation";
import { Card } from 'antd';




const { Header, Content, Sider } = Layout;

interface AuthenticatedLayoutProps {
  children: React.ReactNode
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({ children }) => {
  const router = useRouter();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();


  const menu: MenuProps['items'] = [
    { key: '/dashboard', icon: <HomeOutlined />, label: 'Dashboard' },
    { key: '/petugas', icon: <UserOutlined />, label: 'Petugas' },
    { key: '/peminjam', icon: <UserOutlined />, label: 'Peminjam' },
    { key: '/letakbarang', icon: <InboxOutlined />, label: 'Letak barang' },
    { key: '/barang', icon: <InboxOutlined />, label: 'Barang' },
    { key: '/barangmasuk', icon: <InboxOutlined />, label: 'Barang Masuk' },
    { key: '/barangkeluar', icon: <InboxOutlined />, label: 'Barang Keluar' },
    { key: '/barangrusak', icon: <InboxOutlined />, label: 'Barang Rusak' },
    { key: '/peminjaman', icon: <InboxOutlined />, label: 'Peminjaman' },
    { key: '/riwayat', icon: <InboxOutlined />, label: 'Riwayat' },
  ];

  return (
    <Layout>
      <Layout>
        <Sider width={200} style={{ background: colorBgContainer }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '16px' }}>
            {/* Logo */}
            <img src="ikon.png" style={{ width: '60px', marginLeft: '-6px' }} />
            {/* Judul */}
            <h3 style={{ marginTop: '6px' }}>INVENTARIS</h3>
          </div>
          <Menu
            mode="inline"
            style={{ height: '100%', borderRight: 0 ,}}
            items={menu}
            onClick={({ key }) => {
              router.push(key);
              // console.log(`key ${key} route not found`);
            }}
          />
        </Sider>
        <Layout style={{ padding: '0 24px 24px', height: 'calc(100vh - 64px)', display: 'flex', justifyContent: 'space-between' }}>
            <Content>
              <h1>Dashboard</h1>
            <p>Halo, Elisabet. Selamat Datang di Inventaris!</p>
        </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AuthenticatedLayout;
