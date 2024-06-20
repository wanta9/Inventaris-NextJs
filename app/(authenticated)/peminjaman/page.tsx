'use client';

import { useEffect, useState } from 'react';
import { UserOutlined, SearchOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation'; // Import useRouter
import { Avatar, Button, Input, Table, Card, Form, Dropdown, Menu } from 'antd';
import type { UploadFile } from 'antd';
import { peminjamanRepository } from '#/repository/peminjaman';
import { akunRepository } from '#/repository/akun';

const { Column } = Table;
const { Search } = Input;
const { Item } = Menu;

// Definisikan tipe Akun
interface Akun {
  id: string;
  username: string;
  password: string;
  nama: string;
  gambar: string | null;
  email: string;
  telp: string;
  status: string;
  isOnline: boolean;
  salt: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

// Definisikan tipe Peminjam
interface Peminjam {
  id: string;
  NISN: number;
  kelas: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  akun: Akun;
}

// Definisikan tipe DataType
interface DataType {
  id: string;
  kode: string;
  tanggalPinjam: string;
  tanggalPengembalian: string;
  tanggalDikembalikan: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  peminjam: Peminjam;
}

const Peminjaman = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [data, setData] = useState<DataType[]>([]);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();
  const { data: listPeminjaman } = peminjamanRepository.hooks.usePeminjaman();
  const { data: akun } = akunRepository.hooks.useAuth();
  console.log(listPeminjaman, 'listPeminjaman');

  const router = useRouter();
  const role = akun?.data?.peran?.Role;

  const logout = () => {
    localStorage.removeItem('access_token');
    router.push('/login');
  };
  
  const profile = () => {
    router.push('/profile')
  }

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

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleRowClick = (id: string) => {
    window.location.href = `http://localhost:3002/detailpeminjaman?id=${id}`;
  };

  const handleButtonClick = (id: string) => {
    form.setFieldsValue({ id });
    // Show the form to update the status
  };

  const onFinish = (values: any) => {
    console.log('Form values:', values);
    // Handle form submission logic, e.g., updating the status in the data source
    const newData = data.map((item) =>
      item.id === values.id ? { ...item, status: values.status } : item
    );
    setData(newData);
    form.resetFields();
  };

  // const filteredData = data.filter(
  //   (item) =>
  //     item.namapeminjam.toLowerCase().includes(searchText.toLowerCase()) ||
  //     item.telpon.toLowerCase().includes(searchText.toLowerCase()) ||
  //     item.kodepeminjam.toString().toLowerCase().includes(searchText.toLowerCase())
  // );

  return (
    <div>
      <div>
        <title>Peminjaman</title>
        <h1 style={{ fontSize: '25px', fontWeight: 'bold' }}>Peminjaman</h1>
      </div>
      <Card style={{ marginTop: '100px' }}>
        <div style={{ marginTop: '20px' }}>
          <Search
            placeholder="Cari nama, nama pengguna, atau NISN"
            allowClear
            onSearch={handleSearch}
            prefix={<SearchOutlined style={{ marginRight: 8 }} />}
            style={{ width: 300 }}
          />
          <Table
            dataSource={listPeminjaman?.data}
            style={{ paddingTop: '40px' }}
            onRow={(record) => ({
              onClick: () => handleRowClick(record.id),
              style: { cursor: 'pointer' },
            })}
            rowClassName="clickable-row"
          >
            <Column
              title="Nama Peminjam"
              key="fotonamapeminjam"
              render={(text, record: DataType) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar src={record.peminjam?.akun?.gambar} />
                  <span style={{ marginLeft: 8 }}>{record.peminjam?.akun?.nama}</span>
                </div>
              )}
            />
            <Column
              title="Telepon"
              dataIndex="telpon"
              key="telpon"
              render={(text, record: DataType) => {
                console.log(record);
                return record.peminjam?.akun?.telp || 'No Telepon';
              }}
            />
            <Column title="Kode Peminjaman" dataIndex="kode" key="kodepeminjam" />
            <Column title="Tanggal Peminjaman" dataIndex="tanggalPinjam" key="tanggalpeminjaman" />
            <Column
              title="Tanggal Dikembalikan"
              dataIndex="tanggalDikembalikan"
              key="tanggaldikembalikan"
            />
            <Column
              title="Status"
              dataIndex="status"
              key="status"
              render={(status: string, record: DataType) => (
                <Button
                  type="primary"
                  style={{ width: '70%' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleButtonClick(record.id);
                  }}
                >
                  {status}
                </Button>
              )}
            />
          </Table>
        </div>
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

export default Peminjaman;
