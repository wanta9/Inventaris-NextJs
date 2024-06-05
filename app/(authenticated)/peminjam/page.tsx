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

const Peminjam = () => {
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

  interface DataType {
    id: string;
    nama: string;
    namapengguna: string;
    telp: number;
    nisn: string;
    status: string;
    foto: string;
  }

  const initialData: DataType[] = [
    {
      id: '1',
      nama: 'John Brown',
      namapengguna: 'johnny',
      telp: 123456789,
      nisn: '1234567890',
      status: 'Diterima',
      foto: 'image 5.png',
    },
    {
      id: '2',
      nama: 'Jim Green',
      namapengguna: 'jimmy',
      telp: 987654321,
      nisn: '0987654321',
      status: 'Ditolak',
      foto: 'image 5.png',
    },
    {
      id: '3',
      nama: 'Joe Black',
      namapengguna: 'joey',
      telp: 543216789,
      nisn: '5432167890',
      status: 'Pending',
      foto: 'image 5.png',
    },
  ];

  useEffect(() => {
    setData(initialData);
  }, []);

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleChangeStatus = (key: string) => {
    // Implement your status change logic here
    console.log('Status changed for:', key);
  };

  const filteredData = data.filter(
    (item) =>
      item.nama.toLowerCase().includes(searchText.toLowerCase()) ||
      item.namapengguna.toLowerCase().includes(searchText.toLowerCase()) ||
      item.nisn.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleRowClick = (id: string) => {
    window.location.href = `http://localhost:3001/editpeminjam?id=${id}`;
  };

  const handleButtonClick = (e: any, id: string) => {
    e.stopPropagation();
    handleChangeStatus(id);
  };

  return (
    <div>
      <div>
        <title>Peminjam</title>
        <h1 style={{ fontSize: '25px', fontWeight: 'bold' }}>Peminjam</h1>
      </div>
      <Card style={{ marginTop: '50px' }}>
        <div style={{ marginTop: '20px' }}>
          <Search
            placeholder="Cari nama, nama pengguna, atau NISN"
            allowClear
            enterButton
            onSearch={handleSearch}
            style={{ width: 300 }}
          />
          <Table
            dataSource={filteredData}
            style={{ paddingTop: '40px' }}
            pagination={{ pageSize: 5 }}
            onRow={(record) => ({
              onClick: () => handleRowClick(record.id),
              style: { cursor: 'pointer' },
            })}
            rowClassName="clickable-row"
          >
            <Column
              title="Nama"
              key="fotoNama"
              render={(record: DataType) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar src={record.foto} />
                  <span style={{ marginLeft: 8 }}>{record.nama}</span>
                </div>
              )}
            />
            <Column title="Nama Pengguna" dataIndex="namapengguna" key="namapengguna" />
            <Column title="Telepon" dataIndex="telp" key="telp" />
            <Column title="NISN" dataIndex="nisn" key="nisn" />
            <Column
              title="Status"
              dataIndex="status"
              key="status"
              render={(status: string, record: DataType) => (
                <Button type="primary" onClick={(e) => handleButtonClick(e, record.id)}>
                  {status}
                </Button>
              )}
            />
          </Table>
        </div>
      </Card>
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
                <img
                  src="ikon.png"
                  style={{ width: '70px', marginRight: '5px', marginLeft: '-10px' }}
                />
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

export default Peminjam;
