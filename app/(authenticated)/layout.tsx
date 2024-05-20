"use client";

import React from 'react';
import { HomeOutlined, InboxOutlined, UserOutlined, DropboxOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme } from 'antd';
import { useRouter } from "next/navigation";
import { Card, Row, Col, Avatar } from 'antd';




const { Header, Content, Sider } = Layout;
const { Meta } = Card;

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
    { key: '', label: 'Menu', type: 'group'},
    { key: '/letakbarang', icon: <UserOutlined />, label: 'Letak Barang' }
  ];

  return (
    <Layout>
      <Layout>
        <Sider width={250} style={{ background: colorBgContainer }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px 5px'}}>
            {/* Logo */}
            <img src="ikon.png" style={{ width: '80px',  }} />
            {/* Judul */}
            <h3 style={{ marginTop: '6px', fontSize: '19px', fontWeight: 'bold' }}>INVENTARIS</h3>
          </div>
          <Menu
            mode="inline"
            style={{ padding: '0 25px 20px'}}
            items={menu}
            onClick={({ key }) => {
              router.push(key);
            }}
          />
        </Sider>
        <Layout style={{ padding: '0 24px 24px', height: 'calc(100vh - 64px)', display: 'flex', justifyContent: 'space-between' }}>
            <Content style={{ padding: '75px 50px 50px'}}>
              {children}
        </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AuthenticatedLayout;
