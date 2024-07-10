'use client';

import React, { useEffect, useState } from 'react';
import { AudioOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { Avatar, Button, Input, Table, Card, Menu, Dropdown, Form } from 'antd';
import type { UploadFile } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { peminjamRepository } from '#/repository/peminjam';
import { akunRepository } from '#/repository/akun';

const { Column } = Table;
const { Search } = Input;
const { Item } = Menu;

const Peminjam = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [data, setData] = useState<DataType[]>([]);
  const [searchText, setSearchText] = useState('');
  const { data: listPeminjam } = peminjamRepository.hooks.usePeminjam();
  const { data: akun } = akunRepository.hooks.useAuth();
  const role = akun?.data?.peran?.Role;
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
    gambar: string;
    akun: string;
  }

  // const initialData: DataType[] = [
  //   {
  //     id: '1',
  //     nama: 'John Brown',
  //     namapengguna: 'johnny',
  //     telp: 123456789,
  //     nisn: '1234567890',
  //     status: 'Diterima',
  //     foto: 'image 5.png',
  //   },
  //   {
  //     id: '2',
  //     nama: 'Jim Green',
  //     namapengguna: 'jimmy',
  //     telp: 987654321,
  //     nisn: '0987654321',
  //     status: 'Ditolak',
  //     foto: 'image 5.png',
  //   },
  //   {
  //     id: '3',
  //     nama: 'Joe Black',
  //     namapengguna: 'joey',
  //     telp: 543216789,
  //     nisn: '5432167890',
  //     status: 'Pending',
  //     foto: 'image 5.png',
  //   },
  // ];

  // useEffect(() => {
  //   setData(initialData);
  // }, []);

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleButtonClick = (status: string) => {
    console.log('Button clicked for phone number:', status);
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
    window.location.href = `http://localhost:3002/peminjam/${id}`;
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
            dataSource={listPeminjam?.data}
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
              render={(text, record: DataType) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar src={record.akun?.gambar} style={{ marginRight: 8 }} />
                  <span>{record.akun?.nama}</span>
                </div>
              )}
            />
            <Column
              title="Nama Pengguna"
              dataIndex="namapengguna"
              key="namapengguna"
              render={(text, record: DataType) => {
                return record.akun?.username;
              }}
            />

            <Column
              title="Telepon"
              dataIndex="telp"
              key="telp"
              render={(text, record: DataType) => {
                return record.akun?.telp;
              }}
            />
            <Column title="NISN" dataIndex="NISN" key="nisn" />
            <Column
              title="Status"
              dataIndex="Status"
              key="status"
              render={(status: string, record: DataType) => (
                <Button
                  type="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (record.akun?.status) {
                      handleButtonClick(record.akun.status);
                    }
                  }}
                >
                  {record.akun?.status}
                </Button>
              )}
            />
          </Table>
        </div>
      </Card>
        {/* menu inpo */}
        {role === 'admin' && (
          <div
            style={{
              position: 'absolute',
              top: '20px',
              right: '90px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Dropdown overlay={menu} placement="bottomCenter">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Button
                  style={{
                    width: '200px',
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
                      alt="ikon"
                    />
                    <div>
                      <div style={{ fontSize: '12px', color: 'black', marginRight: '20px' }}>
                        Halo, {akun?.data?.nama}
                      </div>
                      <div style={{ fontSize: '12px', color: 'grey', marginRight: '75px' }}>
                        {akun?.data?.peran?.Role}
                      </div>
                    </div>
                  </div>
                </Button>
              </div>
            </Dropdown>
          </div>
        )}
        {role === 'petugas' && (
          <div
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Dropdown overlay={menu} placement="bottomCenter">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Button
                  style={{
                    width: '200px',
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
                      alt="ikon"
                    />
                    <div>
                      <div style={{ fontSize: '12px', color: 'black', marginRight: '20px' }}>
                        Halo, {akun?.data?.nama}
                      </div>
                      <div style={{ fontSize: '12px', color: 'grey', marginRight: '75px' }}>
                        {akun?.data?.peran?.Role}
                      </div>
                    </div>
                  </div>
                </Button>
              </div>
            </Dropdown>
          </div>
        )}
        {role === 'peminjam' && (
          <div
            style={{
              position: 'absolute',
              top: '20px',
              right: '10px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Dropdown overlay={menu} placement="bottomCenter">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Button
                  style={{
                    width: '190px',
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
                      alt="ikon"
                    />
                    <div>
                      <div style={{ fontSize: '12px', color: 'black', marginRight: '70px' }}>
                        Halo, {akun?.data?.nama}
                      </div>
                      <div style={{ fontSize: '12px', color: 'grey', marginRight: '75px' }}>
                        {akun?.data?.peran?.Role}
                      </div>
                    </div>
                  </div>
                </Button>
              </div>
            </Dropdown>
        </div>
        )}
    </div>
  );
};

export default Peminjam;
