'use client';

import { FormInstance } from 'antd/lib/form';
import { Button, Card, Row, Col, Divider, DatePicker, Select } from 'antd';
import React, { useState } from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { peminjamanRepository } from '#/repository/peminjaman';
import { barangRepository } from '#/repository/barang';

const { RangePicker } = DatePicker;
const { Option } = Select;

const Detailpeminjaman = ({ params }: { params: { id: string } }) => {
  const [borrowDate, setBorrowDate] = useState<Date | null>(() => null);
  const [returnDate, setReturnDate] = useState<Date | null>(() => null);
  const [returnedDate, setReturnedDate] = useState<Date | null>(() => null);
  const [status, setStatus] = useState('Pending');
  const { data: barangById } = barangRepository.hooks.useBarang(params.id);
  console.log(barangById, 'barang masuk by id');

  const handleButtonClick = (status: string) => {
    console.log('Button clicked for phone number:', status);
  };

  const fontFamily = 'Barlow, sans-serif';
  const fontWeight = '500';

  return (
    <div style={{ marginLeft: '50px' }}>
      <title>Detail Peminjaman</title>
      <h1 style={{ fontSize: '25px', fontWeight: 'bold', marginTop: '70px' }}>Koleksi</h1>
      <Card
        style={{
          marginTop: '30px',
          boxShadow: '0px 7px 10px rgba(0, 0, 0, 0.1)',
          width: '70%',
          borderRadius: '20px',
          padding: '20px',
          // margin: '0 auto',
        }}
      >
        <div>
          <Row>
            {/* Kolom Kiri dengan 3 Kartu */}
            <Col>
              <Card
                className="shadow-card"
                style={{
                  width: '400px',
                  height: '150px',
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '10px',
                  borderRadius: '20px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img src="/kk.png" style={{ width: '100px', marginRight: '10px' }} />
                  <div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold' }}>Lorem Ipsum</div>
                    <div style={{ marginBottom: '5px' }}>RPL</div>
                    <Card
                      style={{
                        width: '80px',
                        height: '30px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      <h4>7</h4>
                    </Card>
                  </div>
                </div>
              </Card>
              <Card
                className="shadow-card"
                style={{
                  width: '400px',
                  height: '150px',
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '10px',
                  borderRadius: '20px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img src="/kk.png" style={{ width: '100px', marginRight: '10px' }} />
                  <div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold' }}>Lorem Ipsum</div>
                    <div style={{ marginBottom: '5px' }}>RPL</div>
                    <Card
                      style={{
                        width: '80px',
                        height: '30px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      <h4>7</h4>
                    </Card>
                  </div>
                </div>
              </Card>
              <Card
                className="shadow-card"
                style={{
                  width: '400px',
                  height: '150px',
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: '20px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img src="/kk.png" style={{ width: '100px', marginRight: '10px' }} />
                  <div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold' }}>Lorem Ipsum</div>
                    <div style={{ marginBottom: '5px' }}>RPL</div>
                    <Card
                      style={{
                        width: '80px',
                        height: '30px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      <h4>7</h4>
                    </Card>
                  </div>
                </div>
              </Card>
            </Col>
            {/* Kolom Kanan dengan 2 Kartu */}
            <Col style={{ marginLeft: '50px' }}>
              <Card
                className="shadow-card"
                style={{
                  width: '400px',
                  height: '200px',
                  display: 'flex',
                  // flexDirection: 'column',
                  alignItems: 'center',
                  marginBottom: '10px',
                  border: '1px solid rgba(0, 0, 0, .95)',
                  borderRadius: '20px',
                  padding: '20px',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      marginBottom: '10px',
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{ marginRight: '10px', minWidth: '150px', fontWeight, fontFamily }}
                    >
                      Tanggal Peminjaman:
                    </span>
                    <DatePicker
                      placeholder="Tanggal Peminjaman"
                      onChange={(date: Date | null) => setBorrowDate(date)}
                      style={{
                        width: 'calc(100% - 160px)',
                        border: '1px solid rgba(0, 0, 0, .50)',
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
                    <span
                      style={{ marginRight: '10px', minWidth: '150px', fontWeight, fontFamily }}
                    >
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
                  <div
                    style={{
                      marginBottom: '10px',
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{ marginRight: '10px', minWidth: '150px', fontWeight, fontFamily }}
                    >
                      Tanggal Dikembalikan:
                    </span>
                    <DatePicker
                      placeholder="Tanggal Dikembalikan"
                      onChange={(date: Date | null) => setReturnedDate(date)}
                      style={{
                        width: 'calc(100% - 160px)',
                        border: '1px solid rgba(0, 0, 0, .50)',
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
                    <span
                      style={{ marginRight: '10px', minWidth: '150px', fontWeight, fontFamily }}
                    >
                      Status
                    </span>
                    <Button
                      style={{
                        color: '#5BFF00',
                        backgroundColor: 'rgba(162, 225, 129, 0.3)',
                        borderColor: '#A2E181',
                      }}
                      // type="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (barangById?.data?.Status) {
                          handleButtonClick(barangById?.data?.Status);
                        }
                      }}
                    >
                      {barangById?.data?.Status}
                    </Button>
                  </div>
                </div>
              </Card>

              <Card
                className="shadow-card"
                style={{
                  width: '400px',
                  height: '200px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '10px',
                  borderRadius: '20px',
                  border: '1px solid rgba(0, 0, 0, .95)',
                }}
              >
                <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                  <div style={{ fontWeight, fontFamily, marginBottom: '5px', fontSize: '20px' }}>
                    Data Peminjam
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                  }}
                >
                  <div style={{ marginBottom: '10px', display: 'flex' }}>
                    <div style={{ width: '150px', fontWeight, fontFamily }}>Nama Peminjaman</div>
                    <div style={{ width: '50px', fontWeight, fontFamily }}>: </div>
                    <div style={{ fontFamily }}>RonyWjy</div>
                  </div>
                  <div style={{ marginBottom: '10px', display: 'flex' }}>
                    <div style={{ width: '150px', fontWeight, fontFamily }}>Nama Lengkap</div>
                    <div style={{ width: '50px', fontWeight, fontFamily }}>: </div>
                    <div style={{ fontFamily }}>Rony Wijaya</div>
                  </div>
                  <div style={{ marginBottom: '10px', display: 'flex' }}>
                    <div style={{ width: '150px', fontWeight, fontFamily }}>NISN</div>
                    <div style={{ width: '50px', fontWeight, fontFamily }}>: </div>
                    <div style={{ fontFamily }}>222310404</div>
                  </div>
                  <div style={{ marginBottom: '10px', display: 'flex' }}>
                    <div style={{ width: '150px', fontWeight, fontFamily }}>Telp</div>
                    <div style={{ width: '50px', fontWeight, fontFamily }}>: </div>
                    <div style={{ fontFamily }}>08588828xxx</div>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </Card>
    </div>
  );
};

export default Detailpeminjaman;
