'use client';

import React, { useEffect, useRef, useState } from 'react';
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
  const searchRef = useRef<HTMLDivElement | null>(null);
  const { data : listPeminjam } = akunRepository.hooks.useSearchByName(searchText);
  console.log(listPeminjam, 'list peminjam');
  const { data: listAkun } = akunRepository.hooks.useAkun();
  const peminjamData = listPeminjam?.filter((item: any) => item.peran.Role === 'peminjam');
  console.log(listAkun, 'list akun');
  const { data: akun } = akunRepository.hooks.useAuth();
  const role = akun?.data?.peran?.Role;
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem('access_token');
    router.push('/login');
  };

  // style button search
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
    peminjam?: any;
  }

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
        <h1 style={{ fontSize: '25px', fontWeight: 'bold', marginTop: '45px' }}>Peminjam</h1>
      </div>
      <Card style={{ marginTop: '50px' }}>
        <div style={{ marginTop: '20px' }}>
          <div ref={searchRef}>
            <Search
              placeholder="Telusuri Barang Masuk"
              className="custom-search"
              allowClear
              enterButton
              onSearch={handleSearch}
              style={{ width: 300, marginRight: '950px', height: '40px' }}
            />
          </div>
          <Table
            dataSource={peminjamData}
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
                  <span>{record.nama}</span>
                </div>
              )}
            />
            <Column title="Nama Pengguna" dataIndex="username" key="namapengguna" />

            <Column
              title="Telepon"
              dataIndex="telp"
              key="telp"
              // render={(text, record: DataType) => {
              //   return record.telp;
              // }}
            />
            <Column
              title="NISN"
              dataIndex="NISN"
              key="nisn"
              render={(text, record: DataType) => {
                return record.peminjam?.NISN;
              }}
            />
            <Column
              title="Status"
              dataIndex="tatus"
              key="status"
              render={(status: string, record: DataType) => (
                <Button
                  type="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (record.status) {
                      handleButtonClick(record.status);
                    }
                  }}
                  style={{
                    backgroundColor: record.status === 'ditolak' ? '#F87171' : 
                                    record.status === 'diterima' ? '#60A5FA' : 
                                    record.status === 'pending' ? '#9CA3AF' : undefined,
                    borderColor: record.status === 'ditolak' ? '#B91C1C' : 
                                 record.status === 'diterima' ? '#1D4ED8' : 
                                 record.status === 'pending' ? '#374151' : undefined,
                    color:       record.status === 'ditolak' ? '#B91C1C' : 
                                 record.status === 'diterima' ? '#1D4ED8' : 
                                 record.status === 'pending' ? '#374151' : undefined,
                  }}
                >
                  {record.status}
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
