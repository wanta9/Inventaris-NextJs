'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import { Avatar, Button, Input, Table, Card } from 'antd';
import type { UploadFile } from 'antd';

const { Column } = Table;
const { Search } = Input;

const Peminjam = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [data, setData] = useState<DataType[]>([]);
  const [searchText, setSearchText] = useState('');

  interface DataType {
    key: string;
    nama: string;
    namapengguna: string;
    telp: number;
    nisn: string;
    status: string;
    foto: string;
  }

  const initialData: DataType[] = [
    {
      key: '1',
      nama: 'John Brown',
      namapengguna: 'johnny',
      telp: 123456789,
      nisn: '1234567890',
      status: 'Diterima',
      foto: 'image 5.png',
    },
    {
      key: '2',
      nama: 'Jim Green',
      namapengguna: 'jimmy',
      telp: 987654321,
      nisn: '0987654321',
      status: 'Ditolak',
      foto: 'image 5.png',
    },
    {
      key: '3',
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

  const handleRowClick = (key: string) => {
    window.location.href = `http://localhost:3001/editpeminjam?key=${key}`;
  };

  const handleButtonClick = (e:any, key: string) => {
    e.stopPropagation();
    handleChangeStatus(key);
  };  
  
  return (
    <div>
      <div>
        <title>Peminjam</title>
        <h1 style={{ fontSize: '25px', fontWeight: 'bold' }}>Peminjam</h1>
      </div>
      <Card style={{ marginTop: '100px' }}>
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
            onRow={(record) => ({
              onClick: () => handleRowClick(record.key),
              style: { cursor: 'pointer' },
            })}
            rowClassName="clickable-row"
          >
            <Column
              title="Nama"
              key="fotoNama"
              render={(text, record: DataType) => (
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
                <Button type="primary" onClick={(e) => handleButtonClick(e, record.key)}>
                  {status}
                </Button>
              )}
            />
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default Peminjam;
