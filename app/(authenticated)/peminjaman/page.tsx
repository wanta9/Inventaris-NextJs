'use client';

import { useEffect, useRef, useState } from 'react';
import { UserOutlined, SearchOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation'; // Import useRouter
import { Avatar, Button, Input, Table, Card, Form, Dropdown, Menu } from 'antd';
import type { UploadFile } from 'antd';
import { peminjamanRepository } from '#/repository/peminjaman';
import { akunRepository } from '#/repository/akun';
import daysjs from 'dayjs';
import { parseJwt } from '#/utils/parseJwt';

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
  akun?: any;
}

const Peminjaman = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [data, setData] = useState<DataType[]>([]);
  const [searchText, setSearchText] = useState('');
  const searchRef = useRef<HTMLDivElement | null>(null);
  const [form] = Form.useForm();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Ensure localStorage is accessed only in the browser
    if (typeof window !== 'undefined') {
      // Retrieve token from localStorage
      const token = localStorage.getItem('access_token');
      const parsedToken = parseJwt(token);
      // Extract userId from parsedToken
      setUserId(parsedToken.existUser?.id);
    }
  }, []);
  const { data: listPeminjaman } = peminjamanRepository.hooks.usePeminjaman(); // admin && petugas
  console.log(listPeminjaman, 'listPeminjaman');
  const peminjamanData = listPeminjaman?.data?.filter((item) => item.akun.id === userId); //peminjam
  console.log(peminjamanData, 'data filterpeminjamanData :')
  const { data: akun } = akunRepository.hooks.useAuth();

  const router = useRouter();
  const role = akun?.data?.peran?.Role;

  useEffect(() => {
    if (searchRef.current) {
      const searchButton = searchRef.current.querySelector('.ant-input-search-button');
      if (searchButton instanceof HTMLElement) {
        // Memastikan searchButton adalah HTMLElement
        searchButton.style.backgroundColor = '#582DD2';
        searchButton.style.borderColor = '#582DD2';
      }
    }
  }, []);

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

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleRowClick = (id: string) => {
    window.location.href = `http://localhost:3002/peminjaman/${id}`;
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


  return (
    <div>
      <div>
        <title>Peminjaman</title>
        <h1 style={{ fontSize: '25px', fontWeight: 'bold' }}>Peminjaman</h1>
      </div>
      <Card style={{ marginTop: '100px' }}>
        <div style={{ marginTop: '20px' }}>
          {(role === 'admin' || role === 'petugas') && (
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
                  <span style={{ marginLeft: 8 }}>{record.akun?.nama}</span>
                </div>
              )}
            />
            <Column
              title="Telepon"
              dataIndex="telpon"
              key="telpon"
              render={(text, record: DataType) => {
                console.log(record);
                return record.akun?.telp || 'No Telepon';
              }}
            />
            <Column title="Kode Peminjaman" dataIndex="kode" key="kodepeminjam" />
            <Column
              title="Tanggal Peminjaman"
              dataIndex="tanggalPinjam"
              key="tanggalpeminjaman"
              render={(text: string) => daysjs(text).format('DD/MM/YYYY')}
            />
            <Column
              title="Tanggal Pengembalian"
              dataIndex="tanggalPengembalian"
              key="tanggalPengembalian"
              render={(text: string) => daysjs(text).format('DD/MM/YYYY')}
            />
            <Column
              title="Status"
              dataIndex="status"
              key="status"
              render={(status: string, record: DataType) => (
                <Button
                  type="primary"
                  style={{ 
                    width: '80%', 
                    backgroundColor: record.status === 'ditolak' ? '#F87171' : 
                                    record.status === 'diterima' ? '#60A5FA' : 
                                    record.status === 'telat' ? '#FACC15' :  
                                    record.status === 'pending' ? '#9CA3AF' : undefined,
                    borderColor: record.status === 'ditolak' ? '#B91C1C' : 
                                 record.status === 'diterima' ? '#1D4ED8' :
                                 record.status === 'telat' ? '#A16207' : 
                                 record.status === 'pending' ? '#374151' : undefined,
                    color:       record.status === 'ditolak' ? '#B91C1C' : 
                                 record.status === 'diterima' ? '#1D4ED8' :
                                 record.status === 'telat' ? '#A16207' :  
                                 record.status === 'pending' ? '#374151' : undefined,                    
                  }}
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
          )}
          {role === 'peminjam' && (
          <Table
            dataSource={peminjamanData}
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
                  <span style={{ marginLeft: 8 }}>{record.akun?.nama}</span>
                </div>
              )}
            />
            <Column
              title="Telepon"
              dataIndex="telpon"
              key="telpon"
              render={(text, record: DataType) => {
                console.log(record);
                return record.akun?.telp || 'No Telepon';
              }}
            />
            <Column title="Kode Peminjaman" dataIndex="kode" key="kodepeminjam" />
            <Column
              title="Tanggal Peminjaman"
              dataIndex="tanggalPinjam"
              key="tanggalpeminjaman"
              render={(text: string) => daysjs(text).format('DD/MM/YYYY')}
            />
            <Column
              title="Tanggal Pengembalian"
              dataIndex="tanggalPengembalian"
              key="tanggalPengembalian"
              render={(text: string) => daysjs(text).format('DD/MM/YYYY')}
            />
            <Column
              title="Status"
              dataIndex="status"
              key="status"
              render={(status: string, record: DataType) => (
                <Button
                  type="primary"
                  style={{ 
                    width: '80%', 
                    backgroundColor: record.status === 'ditolak' ? '#F87171' : 
                                    record.status === 'diterima' ? '#60A5FA' : 
                                    record.status === 'telat' ? '#FACC15' :  
                                    record.status === 'pending' ? '#9CA3AF' : undefined,
                    borderColor: record.status === 'ditolak' ? '#B91C1C' : 
                                 record.status === 'diterima' ? '#1D4ED8' :
                                 record.status === 'telat' ? '#A16207' : 
                                 record.status === 'pending' ? '#374151' : undefined,
                    color:       record.status === 'ditolak' ? '#B91C1C' : 
                                 record.status === 'diterima' ? '#1D4ED8' :
                                 record.status === 'telat' ? '#A16207' :  
                                 record.status === 'pending' ? '#374151' : undefined,                    
                  }}
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
          )}
          
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
