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

  const handleButtonClick = (status: string) => {
    console.log('Button clicked for phone number:', status);
  };

  const fontFamily = 'Barlow, sans-serif';
  const fontWeight = '700';

  return (
    <div style={{ marginLeft: '50px' }}>
      <title>Koleksi</title>
      <h1 style={{ fontSize: '25px', fontWeight: 'bold', marginTop: '20px' }}>Koleksi</h1>
        <div>
          <Row>
            {/* Kolom Kiri dengan 3 Kartu */}
            <Col>
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
                <div style={{ backgroundColor: 'rgba(128, 128, 128, 0.5)', padding: '10px', borderRadius: '20px' }}>
                  <img src="/kk.png" style={{ width: '100px', marginRight: '10px', marginLeft: '10px' }} />
                </div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', marginLeft: '20px', marginBottom: '10px'}}>Lorem Ipsum</div>
                  <div style={{ marginBottom: '5px', marginLeft: '20px' }}>RPL</div>
                  <Card
                    style={{
                      width: '80px',
                      height: '30px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
                      marginLeft: '20px',
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
                  width: '650px',
                  height: '180px',
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '20px',
                  borderRadius: '20px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ backgroundColor: 'rgba(128, 128, 128, 0.5)', padding: '10px', borderRadius: '20px' }}>
                  <img src="/kk.png" style={{ width: '100px', marginRight: '5px' }} />
                </div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', marginLeft: '20px', marginBottom: '10px' }}>Lorem Ipsum</div>
                  <div style={{ marginBottom: '5px', marginLeft: '20px' }}>RPL</div>
                  <Card
                    style={{
                      width: '80px',
                      height: '30px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
                      marginLeft: '20px',
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
                  width: '650px',
                  height: '180px',
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: '20px',
                }}
              >
               <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ backgroundColor: 'rgba(128, 128, 128, 0.5)', padding: '10px', borderRadius: '20px' }}>
                  <img src="/kk.png" style={{ width: '100px', marginRight: '5px' }} />
                </div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', marginLeft: '20px', marginBottom: '10px' }}>Lorem Ipsum</div>
                  <div style={{ marginBottom: '5px', marginLeft: '20px'  }}>RPL</div>
                  <Card
                    style={{
                      width: '80px',
                      height: '30px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
                      marginLeft: '20px',
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
                  height: '300px',
                  display: 'flex',
                  marginBottom: '10px',
                  borderRadius: '20px',
                  padding: '20px',
                  marginTop: '40px',
                }}
              >
                <div>
                  <h1>Masukkan Tanggal</h1>
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
                    <span
                      style={{ marginRight: '10px', minWidth: '150px', fontFamily }}
                    >
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
                    <span
                      style={{ marginRight: '10px', minWidth: '150px', fontFamily }}
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
                </div>
                <Button style={{ width: '140px', height: '45px', backgroundColor: '#582DD2', color: 'white', marginTop: '30px', marginLeft: '90px'}}>
                  <p style={{ fontSize: '20px', fontWeight, fontFamily }}>Pinjam</p>
                </Button>
              </Card>
            </Col>
          </Row>
        </div>
    </div>
  );
};

export default Detailpeminjaman;
