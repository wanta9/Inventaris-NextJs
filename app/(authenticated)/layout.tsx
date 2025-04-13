'use client';

import React from 'react';
import { HomeOutlined, InboxOutlined, UserOutlined } from '@ant-design/icons';
import MyIcon from '../assets/icons/my-icon.svg';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme } from 'antd';
import { useRouter } from 'next/navigation';
import { Card } from 'antd';
import styled from 'styled-components';
import { akunRepository } from '#/repository/akun';

const { Header, Content, Sider } = Layout;
const { Meta } = Card;

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

// style Menu Sider
const StyledMenu = styled(Menu)`
  .ant-menu-item-selected {
    background-color: rgba(88, 45, 210, 0.33) !important;
    color: #3259ff !important;
  }

  .ant-menu-item-selected .anticon,
  .ant-menu-item-selected img {
    color: #3259ff !important;
    filter: invert(31%) sepia(66%) saturate(5934%) hue-rotate(242deg) brightness(88%) contrast(101%);
  }

  .ant-menu-item-selected .ant-menu-title-content {
    color: #3259ff !important;
  }

  .ant-menu-item-selected a {
    color: #3259ff !important;
  }
`;

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({ children }) => {
  const router = useRouter();
  const { data: akun } = akunRepository.hooks.useAuth();

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const menu: MenuProps['items'] = [
    { key: '/dashboard', icon: <HomeOutlined />, label: 'Dashboard' },
  ];
  const role = akun?.data?.peran?.Role;

  if (role === 'admin') {
    menu.push(
      { key: '/petugas', icon: <UserOutlined />, label: 'Petugas' },
      {
        key: '/peminjam',
        icon: <img src="/peminjam.svg" style={{ width: '18px' }} />,
        label: 'Peminjam',
      },
      { key: '', label: 'Menu', type: 'group' },
      {
        key: '/letakbarang',
        icon: <img src="/letakbarang.svg" style={{ width: '18px' }} />,
        label: 'Letak Barang',
      },
      {
        key: '/barang',
        icon: <img src="/barang.svg" alt="barang Icon" style={{ width: '18px' }} />,
        label: 'Barang',
      },
      {
        key: '/barangmasuk',
        icon: <img src="/barangmasuk.svg" style={{ width: '18px' }} />,
        label: 'Barang Masuk',
      },
      {
        key: '/barangkeluar',
        icon: <img src="/barangkeluar.svg" style={{ width: '18px' }} />,
        label: 'Barang Keluar',
      },
      // {
      //   key: '/barangrusak',
      //   icon: <img src="/barangrusak.svg" style={{ width: '18px' }} />,
      //   label: 'Barang Rusak',
      // },
      {
        key: '/peminjaman',
        icon: <img src="/peminjaman.svg" style={{ width: '18px' }} />,
        label: 'Peminjaman',
      },
      {
        key: '/riwayat',
        icon: <img src="/riwayat.svg" style={{ width: '18px' }} />,
        label: 'Riwayat',
      }
    );
  }
  if (role === 'petugas') {
    menu.push(
      { key: '', label: 'Menu', type: 'group' },
      {
        key: '/letakbarang',
        icon: <img src="/letakbarang.svg" style={{ width: '18px' }} />,
        label: 'Letak Barang',
      },
      {
        key: '/barang',
        icon: <img src="/barang.svg" alt="barang Icon" style={{ width: '18px' }} />,
        label: 'Barang',
      },
      {
        key: '/barangmasuk',
        icon: <img src="/barangmasuk.svg" style={{ width: '18px' }} />,
        label: 'Barang Masuk',
      },
      {
        key: '/barangkeluar',
        icon: <img src="/barangkeluar.svg" style={{ width: '18px' }} />,
        label: 'Barang Keluar',
      },
      {
        key: '/barangrusak',
        icon: <img src="/barangrusak.svg" style={{ width: '18px' }} />,
        label: 'Barang Rusak',
      },
      {
        key: '/peminjaman',
        icon: <img src="/peminjaman.svg" style={{ width: '18px' }} />,
        label: 'Peminjaman',
      },
      {
        key: '/riwayat',
        icon: <img src="/riwayat.svg" style={{ width: '18px' }} />,
        label: 'Riwayat',
      }
    );
  }
  if (role === 'peminjam') {
    menu.push(
      {
        key: '/barang',
        icon: <img src="/barang.svg" alt="barang Icon" style={{ width: '18px' }} />,
        label: 'Barang',
      },
      {
        key: '/koleksi',
        icon: <img src="/koleksi.svg" alt="barang Icon" style={{ width: '18px' }} />,
        label: 'Koleksi',
      },
      {
        key: '/peminjaman',
        icon: <img src="/peminjaman.svg" style={{ width: '18px' }} />,
        label: 'Peminjaman',
      },
      {
        key: '/riwayat',
        icon: <img src="/riwayat.svg" style={{ width: '18px' }} />,
        label: 'Riwayat',
      }
    );
  }

  return (
    <Layout>
      <Sider
        width={250}
        style={{
          background: colorBgContainer,
          height: '100vh', // Pastikan sidebar memiliki tinggi penuh
          position: 'fixed', // Sidebar tetap di tempatnya
          left: 0, // Pastikan tetap di kiri
          top: 0, // Mulai dari atas
          bottom: 0, // Sampai bawah
          overflowY: 'auto', // Jika menu banyak, sidebar bisa di-scroll sendiri
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px 5px' }}>
          {/* Logo */}
          <img
            src="/INVENSCHOOL NO BG PJBL.png"
            style={{ width: '200px', marginTop: '20px', marginBottom: '20px' }}
          />
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

      {/* Tambahkan marginLeft agar konten tidak tertutup sidebar */}
      <Layout
        style={{
          marginLeft: 250, // Sesuaikan dengan lebar sidebar
          padding: '0 24px 24px',
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Content style={{ padding: '75px 50px 50px' }}>{children}</Content>
      </Layout>
    </Layout>
  );
};

export default AuthenticatedLayout;
