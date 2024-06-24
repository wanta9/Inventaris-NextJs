'use client';

import React, { useEffect, useState } from 'react';
import { AudioOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { Avatar, Button, Input, Table, Card, Menu, Dropdown, Select } from 'antd';
import type { UploadFile } from 'antd';

const { Column } = Table;
const { Search } = Input;
const { Item } = Menu;
const { Option } = Select;

const Barangpeminjam = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [data, setData] = useState<DataType[]>([]);
  const [searchText, setSearchText] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
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

  const handleLocationChange = (value: string) => {
    setSelectedLocation(value);
  };

  const filteredData = data.filter(
    (item) =>
      item.nama.toLowerCase().includes(searchText.toLowerCase()) ||
      item.namapengguna.toLowerCase().includes(searchText.toLowerCase()) ||
      item.nisn.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div>
      <div>
        <title>Barang</title>
        <h1 style={{ fontSize: '25px', fontWeight: 'bold' }}>Barang</h1>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Search
          placeholder="Telusuri Barang"
          allowClear
          enterButton
          onSearch={handleSearch}
          style={{ width: 300 }}
        />
        <Select
          placeholder="Pilih Letak Barang"
          style={{ width: 200 }}
          onChange={handleLocationChange}
        >
          <Option value="lokasi1">Lokasi 1</Option>
          <Option value="lokasi2">Lokasi 2</Option>
          <Option value="lokasi3">Lokasi 3</Option>
        </Select>
      </div>
      <div
        style={{
          position: 'absolute',
          top: '20px',
          right: '100px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div>
        </div>
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
                <img src="ikon.png" alt="icon gambar" style={{ width: '70px', marginRight: '5px', marginLeft: '-10px' }} />
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
      <div style={{ marginTop: '20px' }}>
        <Card
          hoverable
          style={{ width: 240 }}
          cover={<img src="gambar.svg" />}
        >
          <Card.Meta title="Judul Gambar" description="Deskripsi gambar" />
        </Card>
      </div>
    </div>
  );
};

export default Barangpeminjam;
