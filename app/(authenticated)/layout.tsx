'use client';

import React from 'react';
import { HomeOutlined, InboxOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme } from 'antd';
import { useRouter } from 'next/navigation';
import { Card } from 'antd';
import styled from 'styled-components';

const { Header, Content, Sider } = Layout;
const { Meta } = Card;

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

// style Menu Sider
const StyledMenu = styled(Menu)`
  .ant-menu-item-selected {
    background-color: rgba(88, 45, 210, 0.33) !important;
    color: #582dd2 !important;
  }

  .ant-menu-item-selected .anticon,
  .ant-menu-item-selected img {
    color: #582dd2 !important;
    filter: invert(31%) sepia(66%) saturate(5934%) hue-rotate(242deg) brightness(88%) contrast(101%);
  }

  .ant-menu-item-selected .ant-menu-title-content {
    color: #582dd2 !important;
  }

  .ant-menu-item-selected a {
    color: #582dd2 !important;
  }
`;

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({ children }) => {
  const router = useRouter();

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const menu: MenuProps['items'] = [
    { key: '/dashboard', icon: <HomeOutlined />, label: 'Dashboard' },
    { key: '/petugas', icon: <UserOutlined />, label: 'Petugas' },
    {
      key: '/peminjam',
      icon: <img src="petugas.svg" style={{ width: '18px' }} />,
      label: 'Peminjam',
    },
    { key: '', label: 'Menu', type: 'group' },
    {
      key: '/letakbarang',
      icon: <img src="letakbarang.svg" style={{ width: '18px' }} />,
      label: 'Letak Barang',
    },
    {
      key: '/barang',
      icon: <img src="barang.svg" alt="barang Icon" style={{ width: '18px' }} />,
      label: 'Barang',
    },
    {
      key: '/barangmasuk',
      icon: <img src="barangmasuk.svg" style={{ width: '18px' }} />,
      label: 'Barang Masuk',
    },
    {
      key: '/barangkeluar',
      icon: <img src="barangkeluar.svg" style={{ width: '18px' }} />,
      label: 'Barang Keluar',
    },
    {
      key: '/barangrusak',
      icon: <img src="barangrusak.svg" style={{ width: '18px' }} />,
      label: 'Barang Rusak',
    },
    {
      key: '/peminjaman',
      icon: <img src="peminjaman.svg" style={{ width: '18px' }} />,
      label: 'Peminjaman',
    },
    {
      key: '/riwayat',
      icon: <img src="riwayat.svg" style={{ width: '18px' }} />,
      label: 'Riwayat',
    },
  ];

  return (
    <Layout>
      <Layout>
        <Sider width={250} style={{ background: colorBgContainer }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px 5px' }}>
            {/* Logo */}
            <img src="ikon.png" style={{ width: '80px' }} />
            {/* Judul */}
            <h3 style={{ marginTop: '6px', fontSize: '19px', fontWeight: 'bold' }}>INVENTARIS</h3>
          </div>
          <StyledMenu
            mode="inline"
            style={{ padding: '0 25px 20px' }}
            items={menu}
            onClick={({ key }) => {
              router.push(key);
            }}
          />
        </Sider>
        <Layout
          style={{
            padding: '0 24px 24px',
            height: 'calc(100vh - 64px)',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Content style={{ padding: '75px 50px 50px' }}>{children}</Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AuthenticatedLayout;
