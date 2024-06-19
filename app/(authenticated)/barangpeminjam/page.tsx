'use client';

import React, { useEffect, useState } from 'react';
import { AudioOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { Avatar, Button, Input, Table, Card, Menu, Dropdown } from 'antd';
import type { UploadFile } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
const { Column } = Table;
const { Search } = Input;
const { Item } = Menu;

const Barangpeminjam = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [data, setData] = useState<DataType[]>([]);
  const [searchText, setSearchText] = useState('');
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem('access_token');
    router.push('/login');
  };

  // menu akun
  const menu = (
    <Menu>
      <Item key="1" onClick={() => logout()}>
        <a style={{ color: 'red' }} target="_blank" rel="noopener noreferrer">
          <ArrowLeftOutlined style={{ color: 'red', marginRight: '10px' }} />
          Keluar
        </a>
      </Item>
    </Menu>
  );

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const filteredData = data.filter(
    (item) =>
      item.nama.toLowerCase().includes(searchText.toLowerCase()) ||
      item.namapengguna.toLowerCase().includes(searchText.toLowerCase()) ||
      item.nisn.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleRowClick = (id: string) => {
    window.location.href = `http://localhost:3002/editpeminjam?id=${id}`;
  };

  return (
    <div>
      <div>
        <title>Peminjam</title>
        <h1 style={{ fontSize: '25px', fontWeight: 'bold' }}>Peminjam</h1>
      </div>
      <Search
            placeholder="Cari nama, nama pengguna, atau NISN"
            allowClear
            enterButton
            onSearch={handleSearch}
            style={{ width: 300 }}
          />
      <div
        style={{
          position: 'absolute',
          top: '20px',
          right: '100px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Dropdown overlay={menu} placement="bottomCenter">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              style={{
                width: '175px',
                height: '50px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src="ikon.png" alt="icon gambar" style={{ width: '70px', marginRight: '5px', marginLeft: '-10px' }}/>
                <div>
                  <div style={{ fontSize: '12px', color: 'black', marginRight: '20px' }}>
                    Halo, Elisabet
                  </div>
                  <div style={{ fontSize: '12px', color: 'grey ', marginRight: '47px' }}>Admin</div>
                </div>
              </div>
            </Button>
          </div>
        </Dropdown>
      </div>
    </div>
  );
};

export default Barangpeminjam;
