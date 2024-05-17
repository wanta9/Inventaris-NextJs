"use client"

import React, { useEffect, useState } from "react";
import { Avatar, Button, Col, Input, Table, Tag } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd';

const { Column } = Table;
const { Search } = Input;

const listpeminjam = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [data, setData] = useState<DataType[]>([]);
  const [searchText, setSearchText] = useState('');

  interface DataType {
    key: React.Key;
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
      foto: "image 5.png",
    },
    {
      key: '2',
      nama: 'Jim Green',
      namapengguna: 'jimmy',
      telp: 987654321,
      nisn: '0987654321',
      status: 'Ditolak',
      foto: "image 5.png",
    },
    {
      key: '3',
      nama: 'Joe Black',
      namapengguna: 'joey',
      telp: 543216789,
      nisn: '5432167890',
      status: 'Pending',
      foto: "image 5.png",
    },
  ];

  useEffect(() => {
    setData(initialData);
  }, []);

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const filteredData = data.filter(item =>
    item.nama.toLowerCase().includes(searchText.toLowerCase()) ||
    item.namapengguna.toLowerCase().includes(searchText.toLowerCase()) ||
    item.nisn.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div>
      <div>
        <h1 style={{ fontSize: '25px', fontWeight: 'bold'}}>Peminjam</h1>
      </div>
      <div style={{ marginTop: '20px'}}>
        <Search
          placeholder="Cari nama, nama pengguna, atau NISN"
          allowClear
          enterButton
          onSearch={handleSearch}
          style={{ width: 300 }}
        />
        <Table dataSource={filteredData}>
  <Column
    title="Foto dan Nama"
    key="fotoNama"
    render={(record) => (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Avatar src={record.foto} />
        <span style={{ marginLeft: 8 }}>{record.nama}</span>
      </div>
    )}
  />
  <Column title="Nama Pengguna" dataIndex="namapengguna" key="namapengguna" />
  <Column title="Telepon" dataIndex="telp" key="telp" />
  <Column title="NISN" dataIndex="nisn" key="nisn" />
</Table>

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
      </div>
    </div>
  );
};

export default listpeminjam;
