'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar, Button, Input, Table, Card, Select, Dropdown, Menu } from 'antd';
import { PlusOutlined, ArrowLeftOutlined, UserOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd';
import { akunRepository } from '#/repository/akun';
import { peminjamanRepository } from '#/repository/peminjaman';


const { Column } = Table;
const { Search } = Input;
const { Option } = Select;
const { Item } = Menu;

const Riwayat = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [data, setData] = useState<DataType[]>([]);
  const [searchText, setSearchText] = useState('');
  const { data : listRiwayat } = peminjamanRepository.hooks.usePeminjaman(); 
  console.log(listRiwayat, 'list riwayat: ');
  const [statusFilter, setStatusFilter] = useState('');
  const { data: akun } = akunRepository.hooks.useAuth();
  const router = useRouter();
  const role = akun?.data?.peran?.Role;


  const logout = () => {
    localStorage.removeItem('access_token');
    router.push('/login');
  };

  const profile = () => {
    router.push('/profile');
  };

  const menu = (
    <Menu>
      {role === 'petugas' && (
        <Item key="1" onClick={() => profile()}>
          <a style={{ color: 'black' }} target="_blank" rel="noopener noreferrer">
            <UserOutlined style={{ color: 'black', marginRight: '10px' }} />
            Profile
          </a>
        </Item>
      )}
      {role === 'peminjam' && (
        <Item key="1" onClick={() => profile()}>
          <a style={{ color: 'black' }} target="_blank" rel="noopener noreferrer">
            <UserOutlined style={{ color: 'black', marginRight: '10px' }} />
            Profile
          </a>
        </Item>
      )}
      <Item key="2" onClick={() => logout()}>
        <a style={{ color: 'red' }} target="_blank" rel="noopener noreferrer">
          <ArrowLeftOutlined style={{ color: 'red', marginRight: '10px' }} />
          Keluar
        </a>
      </Item>
    </Menu>
  );


  interface DataType {
    key: React.Key;
    namapeminjam: string;
    telpon: string;
    kodepeminjaman: string;
    tanggalpeminjaman: string;
    tanggaldikembalikan: string;
    status: string;
    foto: string;
  }

  // const initialData: DataType[] = [
  //   {
  //     key: '1',
  //     namapeminjam: 'John Brown',
  //     telpon: '1234567890',
  //     kodepeminjaman: 'kode',
  //     tanggalpeminjaman: '2024-01-01',
  //     tanggaldikembalikan: '2024-01-15',
  //     status: 'Diterima',
  //     foto: 'image 5.png',
  //   },
  // ];

  // useEffect(() => {
  //   setData(initialData);
  // }, []);

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleChangeStatus = (key: React.Key) => {
    // Implement your status change logic here
    console.log('Status changed for:', key);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };

  // const filteredData = data.filter(
  //   (item) =>
  //     (item.namapeminjam.toLowerCase().includes(searchText.toLowerCase()) ||
  //       item.telpon.toLowerCase().includes(searchText.toLowerCase()) ||
  //       item.kodepeminjaman.toString().toLowerCase().includes(searchText.toLowerCase())) &&
  //     (statusFilter === '' || item.status.toLowerCase() === statusFilter.toLowerCase())
  // );

  const handleRowClick = (id: string) => {
    window.location.href = `http://localhost:3001/riwayatditolak?id=${id}`;
  };

  const handleButtonClick = (e: any, id: string) => {
    e.stopPropagation();
    handleChangeStatus(id);
  };

  return (
    <div>
      <div>
        <title>Riwayat</title>
        <h1 style={{ fontSize: '25px', fontWeight: 'bold' }}>Riwayat</h1>
      </div>
      <Card style={{ marginTop: '100px' }}>
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
          <Search
            placeholder="Cari nama, nama pengguna, atau NISN"
            allowClear
            onSearch={handleSearch}
            style={{ width: 300 }}
          />
          <Select
            placeholder="Filter Status"
            style={{ width: 200 }}
            onChange={handleStatusFilterChange}
            allowClear
          >
            <Option value="Selesai">Selesai</Option>
            <Option value="Ditolak">Ditolak</Option>
            <Option value="Telat">Telat</Option>
          </Select>
        </div>
        <Table  style={{ paddingTop: '40px' }}>
          <Column
            title="Nama Peminjam"
            key="fotonamapeminjam"
            render={(text, record: DataType) => (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Avatar src={record.foto} />
                <span style={{ marginLeft: 8 }}>{record.namapeminjam}</span>
              </div>
            )}
          />
          <Column title="Telepon" dataIndex="telpon" key="telpon" />
          <Column title="Kode Peminjaman" dataIndex="kode" key="kodepeminjaman" />
          <Column
            title="Tanggal Peminjaman"
            dataIndex="tanggalpeminjaman"
            key="tanggalpeminjaman"
          />
          <Column
            title="Tanggal Dikembalikan"
            dataIndex="tanggaldikembalikan"
            key="tanggaldikembalikan"
          />
          <Column
            title="Status"
            dataIndex="status"
            key="status"
            render={(status: string, record: DataType) => (
              <Button type="primary" onClick={() => handleChangeStatus(record.key)}>
                {status}
              </Button>
            )}
          />
        </Table>
      </Card>
      {role === 'admin' && (
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
            right: '100px',
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
            right: '100px',
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

export default Riwayat;
