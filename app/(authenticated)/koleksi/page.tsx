'use client';

import { FormInstance } from 'antd/lib/form';
import {
  Button,
  Card,
  Row,
  Col,
  Divider,
  DatePicker,
  Select,
  InputNumber,
  Popconfirm,
  message,
} from 'antd';
import React, { useState, useEffect } from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { peminjamanRepository } from '#/repository/peminjaman';
import { barangRepository } from '#/repository/barang';
import { koleksiRepository } from '#/repository/koleksi';

const { RangePicker } = DatePicker;
const { Option } = Select;

const Detailpeminjaman = ({ params }: { params: { id: string } }) => {
  const [borrowDate, setBorrowDate] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [id, setId] = useState<string>('');
  const [returnedDate, setReturnedDate] = useState<Date | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const { data: koleksi, isLoading } = koleksiRepository.hooks.useGetkoleksi();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState('Pending');
  const [value, setValue] = useState(1);

  useEffect(() => {
    if (params.id) {
      setId(params.id);
      // Fetch data based on params.id
      fetchKoleksi(params.id);
    }
  }, [params.id]);

  const fetchKoleksi = async (id: string) => {
    try {
      const result = await koleksiRepository.api.getkoleksi(id);
      setDataSource([result]);
    } catch (error) {
      console.error('Failed to fetch koleksi:', error);
    }
  };

  const handleChange = (newValue: any) => {
    if (newValue >= 1) {
      setValue(newValue);
    }
  };

  const showPopconfirm = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setConfirmLoading(true);

    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await koleksiRepository.api.deletekoleksi(id); // Call the API to delete the collection by ID
      const newData = dataSource.filter((item) => item.id !== id);
      console.log(newData, 'delete');
      message.success('Koleksi Berhasil Dihapus!');
      setDataSource(newData);
    } catch (error) {
      console.error('Gagal menghapus koleksi!', error);
    }
  };


  return (
    <div style={{ marginLeft: '50px' }}>
      <title>Koleksi</title>
      <h1 style={{ fontSize: '25px', fontWeight: 'bold', marginTop: '20px' }}>Koleksi</h1>
      <div>
        <Row>
          {/* Left Column with 3 Cards */}
          {dataSource.map((record) => (
            <Col key={record.id}>
              <Card
                className="shadow-card"
                style={{
                  width: '650px',
                  height: '180px',
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '20px',
                  borderRadius: '20px',
                  marginTop: '40px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div
                    style={{
                      backgroundColor: 'rgba(128, 128, 128, 0.5)',
                      padding: '10px',
                      borderRadius: '20px',
                    }}
                  >
                    <img
                      src="/kk.png"
                      style={{ width: '100px', marginRight: '10px', marginLeft: '10px' }}
                    />
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        marginLeft: '20px',
                        marginBottom: '10px',
                      }}
                    >
                      {record.nama}
                    </div>
                    <div style={{ fontSize: '17px', marginBottom: '15px', marginLeft: '20px' }}>
                      <span style={{ color: 'grey' }}>RPL</span>
                    </div>
                    <div style={{ display: 'flex' }}>
                      <Button
                        onClick={() => handleChange(value - 1)}
                        style={{
                          marginLeft: '20px',
                          width: '50px',
                          boxShadow: '0px 7px 10px rgba(0, 0, 0, 0.1)',
                        }}
                      >
                        {<img src="/minusicon.svg" style={{ width: '14px', height: '14px' }} />}
                      </Button>
                      {/* Box 2 */}
                      <InputNumber
                        min={1}
                        value={value}
                        onChange={handleChange}
                        controls={false}
                        style={{ width: '60px', boxShadow: '0px 7px 10px rgba(0, 0, 0, 0.1)' }}
                      />
                      {/* Box 3 */}
                      <Button
                        onClick={() => handleChange(value + 1)}
                        style={{ width: '50px', boxShadow: '0px 7px 10px rgba(0, 0, 0, 0.1)' }}
                      >
                        {
                          <img
                            src="/pluseicon.svg"
                            style={{ width: '12px', height: '12px', marginBottom: '5px' }}
                          />
                        }
                      </Button>
                    </div>
                    <div style={{ position: 'absolute', bottom: '10px', right: '10px' }}>
                      <Popconfirm
                        title="Menghapus koleksi"
                        description="Apakah Anda yakin ingin menghapus barang ini?"
                        onConfirm={() => handleDelete(record.id)}
                        okButtonProps={{ loading: confirmLoading }}
                        onCancel={handleCancel}
                        okText="Iya"
                        cancelText="Tidak"
                      >
                        <Button
                          type="link"
                          icon={
                            <img src="/koleksiDelete.svg" style={{ width: '19px', height: '19px' }} />
                          }
                        >
                          <span style={{ color: 'black' }}>Hapus</span>
                        </Button>
                      </Popconfirm>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
          {/* Right Column with 2 Cards */}
          <Col style={{ marginLeft: '50px' }}>
            <Card
              className="shadow-card"
              style={{
                width: '400px',
                height: '300px',
                display: 'flex',
                marginBottom: '10px',
                borderRadius: '20px',
                padding: '20px',
                marginTop: '40px',
              }}
            >
              <div>
                <p
                  style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '-20px', marginBottom: '20px' }}
                >
                  Masukkan Tanggal
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <div
                  style={{
                    marginBottom: '10px',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ marginRight: '10px', minWidth: '150px' }}>
                    Tanggal Peminjaman:
                  </span>
                  <DatePicker
                    placeholder="Tanggal Peminjaman"
                    onChange={(date: Date | null) => setBorrowDate(date)}
                    style={{
                      width: 'calc(100% - 160px)',
                      border: '1px solid rgba(0, 0, 0, .50)',
                      marginBottom: '10px',
                    }}
                  />
                </div>
                <div
                  style={{
                    marginBottom: '10px',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ marginRight: '10px', minWidth: '150px'}}>
                    Tanggal Pengembalian:
                  </span>
                  <DatePicker
                    placeholder="Tanggal Pengembalian"
                    onChange={(date: Date | null) => setReturnDate(date)}
                    style={{
                      width: 'calc(100% - 160px)',
                      border: '1px solid rgba(0, 0, 0, .50)',
                    }}
                  />
                </div>
              </div>
              <Button
                style={{
                  width: '140px',
                  height: '45px',
                  backgroundColor: '#582DD2',
                  color: 'white',
                  marginTop: '30px',
                  marginLeft: '90px',
                }}
              >
                <p style={{ fontSize: '20px', fontWeight: 'bold' }}>Pinjam</p>
              </Button>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Detailpeminjaman;
