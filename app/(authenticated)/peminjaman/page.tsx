'use client';

import { useEffect, useState } from 'react';
import { AudioOutlined, SearchOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation'; // Import useRouter
import { Avatar, Button, Input, Table, Card, Form, Select } from 'antd';
import type { UploadFile } from 'antd';
import { peminjamanRepository } from '#/repository/peminjaman';

const { Column } = Table;
const { Search } = Input;

const Peminjaman = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [data, setData] = useState<DataType[]>([]);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();
  const { data: listPeminjaman } = peminjamanRepository.hooks.usePeminjaman();

  interface DataType {
    id: string;
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
      id: '1',
      namapeminjam: 'John Brown',
      telpon: '1234567890',
      kodepeminjam: 'kode',
      tanggalpeminjaman: '2024-01-01',
      tanggaldikembalikan: '2024-01-15',
      status: 'Diterima',
      foto: 'image 5.png',
    },
    {
      id: '2',
      namapeminjam: 'Jim Green',
      telpon: '9876543210',
      kodepeminjam: 'kode',
      tanggalpeminjaman: '2024-02-01',
      tanggaldikembalikan: '2024-02-15',
      status: 'Pending',
      foto: 'image 5.png',
    },
    {
      id: '3',
      namapeminjam: 'Joe Black',
      telpon: '5432167890',
      kodepeminjam: 'kode',
      tanggalpeminjaman: '2024-03-01',
      tanggaldikembalikan: '2024-03-15',
      status: 'Telat',
      foto: 'image 5.png',
    },
  ];

  useEffect(() => {
    setData(initialData);
  }, []);

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleRowClick = (id: string) => {
    window.location.href = `http://localhost:3001/detailpeminjaman?id=${id}`;
  };

  const handleButtonClick = (id: string) => {
    form.setFieldsValue({ id });
    // Show the form to update the status
  };

  const onFinish = (values) => {
    console.log('Form values:', values);
    // Handle form submission logic, e.g., updating the status in the data source
    const newData = data.map((item) =>
      item.id === values.id ? { ...item, status: values.status } : item
    );
    setData(newData);
    form.resetFields();
  };

  const filteredData = data.filter(
    (item) =>
      item.namapeminjam.toLowerCase().includes(searchText.toLowerCase()) ||
      item.telpon.toLowerCase().includes(searchText.toLowerCase()) ||
      item.kodepeminjam.toString().toLowerCase().includes(searchText.toLowerCase())
  );

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
                  <Avatar src={record.foto} />
                  <span style={{ marginLeft: 8 }}>{record.namapeminjam}</span>
                </div>
              )}
            />
            <Column title="Telepon" dataIndex="telpon" key="telpon" />
            <Column title="Kode Peminjam" dataIndex="kode" key="kodepeminjam" />
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
    </div>
  );
};

export default Peminjaman;
