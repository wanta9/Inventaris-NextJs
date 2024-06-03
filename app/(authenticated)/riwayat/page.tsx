"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import { Avatar, Button, Input, Table, Card } from "antd";
import type { UploadFile } from 'antd';

const { Column } = Table;
const { Search } = Input;

const Riwayat = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [data, setData] = useState<DataType[]>([]);
  const [searchText, setSearchText] = useState('');

  interface DataType {
    key: React.Key;
    namapeminjam: string;
    telpon: string;
    kodepeminjam: string;
    tanggalpeminjaman: string;
    tanggaldikembalikan: string;
    status: string;
    foto: string;
  }

  const initialData: DataType[] = [
    {
      key: '1',
      namapeminjam: 'John Brown',
      telpon: '1234567890',
      kodepeminjam: 'kode',
      tanggalpeminjaman: '2024-01-01',
      tanggaldikembalikan: '2024-01-15',
      status: 'Diterima',
      foto: "image 5.png",
    },
    {
      key: '2',
      namapeminjam: 'Jim Green',
      telpon: '9876543210',
      kodepeminjam: 'kode',
      tanggalpeminjaman: '2024-02-01',
      tanggaldikembalikan: '2024-02-15',
      status: 'Ditolak',
      foto: "image 5.png",
    },
    {
      key: '3',
      namapeminjam: 'Joe Black',
      telpon: '5432167890',
      kodepeminjam: 'kode',
      tanggalpeminjaman: '2024-03-01',
      tanggaldikembalikan: '2024-03-15',
      status: 'Pending',
      foto: "image 5.png",
    },
  ];

  useEffect(() => {
    setData(initialData);
  }, []);

  const handleChangeStatus = (key: React.Key) => {
    // Implement your status change logic here
    console.log("Status changed for:", key);
  };

  const filteredData = data.filter(item =>
    item.namapeminjam.toLowerCase().includes(searchText.toLowerCase()) ||
    item.telpon.toLowerCase().includes(searchText.toLowerCase()) ||
    item.kodepeminjam.toString().toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div>
      <div>
        <title>Riwayat</title>
        <h1 style={{ fontSize: '25px', fontWeight: 'bold' }}>Riwayat</h1>
      </div>
      <Card style={{ marginTop: '100px' }}>
        <div style={{ marginTop: '20px' }}>
          
          <Table dataSource={filteredData} style={{ paddingTop: '40px' }}>
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
            <Column title="Kode Peminjam" dataIndex="kodepeminjam" key="kodepeminjam" />
            <Column title="Tanggal Peminjaman" dataIndex="tanggalpeminjaman" key="tanggalpeminjaman" />
            <Column title="Tanggal Dikembalikan" dataIndex="tanggaldikembalikan" key="tanggaldikembalikan" />
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
      </Card>
    </div>
  );
};

export default Riwayat;
