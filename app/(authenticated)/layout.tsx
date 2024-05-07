"use client";

import React from 'react';
import { HomeOutlined, InboxOutlined, UserOutlined, DropboxOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, Space, theme } from 'antd';
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
    // { key: '/petugas', icon: <UserOutlined />, label: 'Petugas' },
    // { key: '/peminjam', icon: <UserOutlined />, label: 'Peminjam' },
    // { key: '/letakbarang', icon: <InboxOutlined />, label: 'Letak barang' },
    // { key: '/barang', icon: <InboxOutlined />, label: 'Barang' },
    // { key: '/barangmasuk', icon: <InboxOutlined />, label: 'Barang Masuk' },
    // { key: '/barangkeluar', icon: <InboxOutlined />, label: 'Barang Keluar' },
    // { key: '/barangrusak', icon: <InboxOutlined />, label: 'Barang Rusak' },
    // { key: '/peminjaman', icon: <InboxOutlined />, label: 'Peminjaman' },
    // { key: '/riwayat', icon: <InboxOutlined />, label: 'Riwayat' },
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
              // console.log(`key ${key} route not found`);
            }}
          />
        </Sider>
        <Layout style={{ padding: '0 24px 24px', height: 'calc(100vh - 64px)', display: 'flex', justifyContent: 'space-between' }}>
            <Content style={{ padding: '75px 50px 50px'}}>
              <h1 style={{ fontSize: '25px', fontWeight: 'bold'}}>Dashboard</h1>
            <p style={{ paddingBottom: '20px'}}>Halo, Elisabet. Selamat Datang di Inventaris!</p>
            <Row gutter={[32, 32]}> {/* Mengatur jarak horizontal dan vertikal antara kartu-kartu */}
                <Col>
                  <Card className="shadow-card" style={{ width: '200px', height: '130px'}}>
                    <Meta
                      avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />}
                      style={{ padding: '15px 20px 10px'}}
                      title="20"
                      description="Barang"
                    />
                  </Card>
                </Col>
                <Col>
                  <Card className="shadow-card" style={{ width: '200px', height: '130px'}}>
                    <Meta
                      avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />}
                      style={{ padding: '15px 20px 10px'}}
                      title="3"
                      description="Peminjam"
                    />
                  </Card>
                </Col>
                <Col>
                  <Card className="shadow-card" style={{ width: '200px', height: '130px'}}>
                    <Meta
                      avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />}
                      style={{ padding: '15px 20px 10px'}}
                      title="5"
                      description="Aktif"
                    />
                  </Card>
                </Col>
              </Row>
        </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AuthenticatedLayout;
