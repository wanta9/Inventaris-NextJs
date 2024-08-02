'use client';

import { FormInstance } from 'antd/lib/form';
import { Button, Card, Row, Col, DatePicker, Modal, Form } from 'antd';
import React, { useEffect, useState } from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { peminjamanRepository } from '#/repository/peminjaman';
import TextArea from 'antd/es/input/TextArea';
import { akunRepository } from '#/repository/akun';
import moment from 'moment';

const { RangePicker } = DatePicker;

const Detailpeminjaman = ({ params }: { params: { id: string } }) => {
  const [borrowDate, setBorrowDate] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const [returnedDate, setReturnedDate] = useState<Date | null>(null);
  const [status, setStatus] = useState('Pending');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { data: peminjamanById } = peminjamanRepository.hooks.usePeminjamanById(params.id);
  console.log(peminjamanById, 'peminjaman by id');
  const [dataSource, setDataSource] = useState([]);
  const [dataSources, setDataSources] = useState([]);

  useEffect(() => {
    if (peminjamanById && peminjamanById.data) {
      setDataSources([peminjamanById.data]); // Bungkus objek dalam array
    }
  }, [peminjamanById]);

  useEffect(() => {
    if (peminjamanById) {
      // Directly set dataSource from peminjamanById.peminjamanBarang
      setDataSource(peminjamanById?.data?.peminjamanBarang || []);
    }
  }, [peminjamanById]);

  console.log(peminjamanById, 'barang masuk by id');
  const { data: akun } = akunRepository.hooks.useAuth();
  const role = akun?.data?.peran?.Role;

  const handleButtonClick = (status: string) => {
    console.log('Button clicked for status:', status);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const fontFamily = 'Barlow, sans-serif';
  const fontWeight = '500';

  return (
    <div style={{ marginLeft: '50px' }}>
      <title>Detail Peminjaman</title>
      <h1 style={{ fontSize: '25px', fontWeight: 'bold', marginTop: '70px' }}>Detail Peminjaman</h1>
      <Card
        style={{
          marginTop: '30px',
          boxShadow: '0px 7px 10px rgba(0, 0, 0, 0.1)',
          width: '70%',
          borderRadius: '20px',
          padding: '20px 55px',
        }}
      >
        <div>
          <Row>
            {/* Kolom Kiri dengan 3 Kartu */}
            <Col>
              {dataSource.length > 0 ? (
                dataSource.map((item, index) => (
                  <Card
                    key={index}
                    className="shadow-card"
                    style={{
                      width: '400px',
                      height: '150px',
                      display: 'flex',
                      alignItems: 'center',
                      borderRadius: '20px',
                      marginTop: '25px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <img
                        src="/kk.png"
                        style={{ width: '100px', marginRight: '10px' }}
                        alt="Item"
                      />
                      <div>
                        <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                          {item.ruanganBarang?.barang?.nama || 'N/A'}
                        </div>
                        <div style={{ marginBottom: '5px' }}>
                          {item.ruanganBarang?.ruangan?.Letak_Barang || 'N/A'}
                        </div>
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
                          <h4>{item.jumlah}</h4>
                        </Card>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div>No data available</div>
              )}
            </Col>
<<<<<<< HEAD
            {/* {dataSources.map((item, index) => (
            <Col style={{ marginLeft: '50px' }}>
              <Card
                key={index}
                className="shadow-card"
                style={{
                  width: '400px',
                  height: '240px',
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '10px',
                  border: '1px solid rgba(0, 0, 0, .95)',
                  borderRadius: '20px',
                  padding: '30px 10px 20px 20px',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <div
=======

            {Array.isArray(dataSources) &&
              dataSources.map((item, index) => (
                <Col key={index} style={{ marginLeft: '50px' }}>
                  <Card
                    className="shadow-card"
>>>>>>> 1313770542aac2baaf65b78ece5a37488874c326
                    style={{
                      width: '400px',
                      height: '240px',
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '10px',
                      border: '1px solid rgba(0, 0, 0, .95)',
                      borderRadius: '20px',
                      padding: '30px 10px 20px 20px',
                    }}
                  >
                    <div
                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
                    >
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
                          disabled
                          value={item.tanggalPinjam ? moment(item.tanggalPinjam) : null}
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
                          disabled
                          value={item.tanggalPengembalian ? moment(item.tanggalPengembalian) : null}
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
                          disabled
                          value={item.tanggalDikembalikan ? moment(item.tanggalDikembalikan) : null}
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
                        <div
                          style={{
                            width: '50%',
                            backgroundColor: '#60A5FA',
                            border: '1px solid #1D4ED8',
                            textAlign: 'center',
                            padding: '5px',
                            borderRadius: '5px',
                            color: '#1D4ED8',
                          }}
                        >
                          {item.status}
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card
                    className="shadow-card"
                    style={{
                      width: '400px',
                      height: '250px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '10px',
                      borderRadius: '20px',
                      border: '1px solid rgba(0, 0, 0, .95)',
                      marginTop: '20px',
                    }}
                  >
                    <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                      <div
                        style={{ fontWeight, fontFamily, marginBottom: '5px', fontSize: '20px' }}
                      >
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
                        <div style={{ width: '150px', fontWeight, fontFamily }}>
                          Nama Peminjaman
                        </div>
                        <div style={{ width: '50px', fontWeight, fontFamily }}>: </div>
                        <div style={{ fontFamily }}>{item.akun.nama}</div>
                      </div>
                      <div style={{ marginBottom: '10px', display: 'flex' }}>
                        <div style={{ width: '150px', fontWeight, fontFamily }}>Nama Lengkap</div>
                        <div style={{ width: '50px', fontWeight, fontFamily }}>: </div>
                        <div style={{ fontFamily }}>{item.akun.nama}</div>
                      </div>
                      <div style={{ marginBottom: '10px', display: 'flex' }}>
                        <div style={{ width: '150px', fontWeight, fontFamily }}>NISN</div>
                        <div style={{ width: '50px', fontWeight, fontFamily }}>: </div>
                        <div style={{ fontFamily }}>{item.akun.peminjam.NISN}</div>
                      </div>
                      <div style={{ marginBottom: '10px', display: 'flex' }}>
                        <div style={{ width: '150px', fontWeight, fontFamily }}>Telp</div>
                        <div style={{ width: '50px', fontWeight, fontFamily }}>: </div>
                        <div style={{ fontFamily }}>{item.akun.telp}</div>
                      </div>
                    </div>
<<<<<<< HEAD
                  </div>
                </div>
              </Card>

              <Card
                className="shadow-card"
                style={{
                  width: '400px',
                  height: '250px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '10px',
                  borderRadius: '20px',
                  border: '1px solid rgba(0, 0, 0, .95)',
                  marginTop: '20px',
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
                ))} */}

=======
                  </Card>
                </Col>
              ))}
>>>>>>> 1313770542aac2baaf65b78ece5a37488874c326

            {role === 'petugas' && (
              <Col style={{ marginLeft: '50px' }}>
                <Card
                  className="shadow-card"
                  style={{
                    width: '400px',
                    height: '240px',
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '10px',
                    border: '1px solid rgba(0, 0, 0, .95)',
                    borderRadius: '20px',
                    padding: '20px',
                  }}
                >
                  <div
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
                  >
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
                          color: '#FF0000',
                          backgroundColor: 'rgba(255, 0, 0, 0.3)',
                          borderColor: '#FF0000',
                          marginRight: '10px',
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          showModal();
                        }}
                      >
                        Tolak
                      </Button>

                      <Modal
                        title="Alasan Ditolak"
                        style={{ textAlign: 'center' }}
                        visible={isModalVisible}
                        centered
                        onCancel={handleCancel}
                        footer={null}
                      >
                        <TextArea style={{ marginTop: '20px', height: '100px' }} />
                        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                          <Button
                            type="default"
                            onClick={handleCancel}
                            style={{
                              marginTop: '20px',
                              marginRight: '10px',
                              marginBottom: '-20px',
                              borderColor: 'black',
                              color: 'black',
                            }}
                          >
                            <span>Batal</span>
                          </Button>
                          <Button
                            type="primary"
                            htmlType="submit"
                            style={{
                              backgroundColor: '#582DD2',
                              marginRight: '-165px',
                              marginTop: '20px',
                              marginBottom: '-20px',
                            }}
                          >
                            <span>Simpan</span>
                          </Button>
                        </Form.Item>
                      </Modal>

                      <Button
                        style={{
                          color: '#5BFF00',
                          backgroundColor: 'rgba(162, 225, 129, 0.3)',
                          borderColor: '#A2E181',
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleButtonClick('Accepted');
                        }}
                      >
                        Terima
                      </Button>
                    </div>
                  </div>
                </Card>

                <Card
                  className="shadow-card"
                  style={{
                    width: '400px',
                    height: '250px',
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
                    <div style={{ fontWeight, fontFamily, marginBottom: '30px', fontSize: '20px' }}>
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
            )}
          </Row>
        </div>
      </Card>
      <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
        <Button
          style={{
            marginTop: '30px',
            backgroundColor: '#582DD2',
            color: 'white',
            width: '20%',
            height: '50px',
            borderRadius: '10px',
            marginRight: '45vh',
          }}
        >
          <a
            href="http://localhost:3002/peminjaman"
            style={{
              fontSize: '15px',
              fontWeight,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ArrowLeftOutlined style={{ marginRight: '10px' }} />
            Kembali
          </a>
        </Button>
      </div>
    </div>
  );
};

export default Detailpeminjaman;
