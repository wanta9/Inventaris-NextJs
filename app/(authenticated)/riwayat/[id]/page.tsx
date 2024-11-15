'use client';

import { FormInstance } from 'antd/lib/form';
import { Button, Card, Row, Col, DatePicker, Modal, Form, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { peminjamanRepository } from '#/repository/peminjaman';
import TextArea from 'antd/es/input/TextArea';
import { akunRepository } from '#/repository/akun';
import moment from 'moment';
import { statusBarang } from '../../dashboard/page';

const { RangePicker } = DatePicker;

interface updateDitolak {
  id: string;
  status: statusBarang;
  keterangan: string;
}

interface Item {
  id: string;
  status: statusBarang;
  keterangan: string;
}

interface updateDiterima {
  id: string;
  status: statusBarang;
}

const DetailRiwayat = ({ params }: { params: { id: string } }) => {
  const [borrowDate, setBorrowDate] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const [form] = Form.useForm();
  const [id, setId] = useState<string>('');
  const [keterangan, setKeterangan] = useState<string>('');
  const [returnedDate, setReturnedDate] = useState<Date | null>(null);
  const [status, setStatus] = useState('Pending');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [updateDitolak, setupdateDitolak] = useState<updateDitolak>({
    id: '',
    status: statusBarang.Ditolak,
    keterangan: '',
  });
  const [updateDiterima, setupdateDiterima] = useState<updateDiterima>({
    id: '',
    status: statusBarang.Diterima,
  });
  const { data: peminjamanById } = peminjamanRepository.hooks.usePeminjamanById(params.id);
  console.log(peminjamanById, 'peminjaman by id');
  const [dataSource, setDataSource] = useState([]);
  const [dataSources, setDataSources] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onFinishDitolak = async (id: string) => {
    console.log('data id: ', id);
    try {
      setLoading(true);
      setError(null);
      const data = {
        status: updateDitolak.status,
        keterangan: updateDitolak.keterangan,
      };
      const request = await peminjamanRepository.api.updatePeminjaman(id, data);
      if (request.status === 400) {
        setError(request.body.message);
      } else {
        message.success('Berhasil Menolak Peminjaman!');
      }
      console.log(request);
    } catch (error) {
      console.log(error);
      setError('Terjadi kesalahan pada server.');
      message.error('Gagal !');
      console.log();
    } finally {
      setLoading(false);
    }
  };
  const onFinishDiterima = async (id: string) => {
    console.log('data id: ', id);
    try {
      setLoading(true);
      setError(null);
      const data = {
        id: updateDiterima.id,
        status: updateDiterima.status,
      };
      const request = await peminjamanRepository.api.updatePeminjaman(id, data);
      if (request.status === 400) {
        setError(request.body.message);
      } else {
        message.success('Berhasil Menolak Peminjaman!');
      }
      console.log(request);
    } catch (error) {
      console.log(error);
      setError('Terjadi kesalahan pada server.');
      message.error('Gagal !');
      console.log();
    } finally {
      setLoading(false);
    }
  };

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

  // const handleButtonClick = (status: string) => {
  //   console.log('Button clicked for status:', status);
  // };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleEdit = (record: Item) => {
    console.log(record, 'record data:');

    form.setFieldsValue({
      id: record.id,
      status: record.status,
      keterangan: record.keterangan,
    });

    setId(record.id);
    setStatus(record.status);
    setKeterangan(record.keterangan);
    showModal(); // Menampilkan modal
  };

  const fontFamily = 'Barlow, sans-serif';
  const fontWeight = '500';

  return (
    <div style={{ marginLeft: '50px' }}>
      <title>Riwayat</title>
      <h1 style={{ fontSize: '25px', fontWeight: 'bold', marginTop: '70px' }}>Riwayat</h1>
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

            {role === 'admin' &&
              Array.isArray(dataSources) &&
              dataSources.map((item, index) => (
                <Col key={index} style={{ marginLeft: '50px' }}>
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
                            backgroundColor: statusStyles[item.status]?.backgroundColor,
                            border: `1px solid ${statusStyles[item.status]?.borderColor}`,
                            textAlign: 'center',
                            padding: '5px',
                            borderRadius: '5px',
                            color: statusStyles[item.status]?.color,
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
                  </Card>

                  {item.status === 'ditolak' && (
                    <>
                      <p style={{ fontWeight: 'bold', fontFamily, marginTop: '20px' }}>
                        Alasan Ditolak
                      </p>
                      <Card style={{ borderColor: 'black', padding: '10px' }}>
                        <div style={{ fontFamily }}>{item.keterangan}</div>
                      </Card>
                    </>
                  )}
                </Col>
              ))}

            {role === 'peminjam' &&
              Array.isArray(dataSources) &&
              dataSources.map((item, index) => (
                <Col key={index} style={{ marginLeft: '50px' }}>
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
                          Status
                        </span>
                        <div
                          style={{
                            width: '50%',
                            backgroundColor:
                              item.status === 'ditolak'
                                ? '#FCA5A5'
                                : item.status === 'selesai'
                                ? '#4ADE80'
                                : item.status === 'telat'
                                ? '#FACC15'
                                : undefined,
                            borderColor:
                              item.status === 'ditolak'
                                ? '#DE3838'
                                : item.status === 'selesai'
                                ? '#399242'
                                : item.status === 'telat'
                                ? '#A16207'
                                : undefined,
                            color:
                              item.status === 'ditolak'
                                ? '#C01A1A'
                                : item.status === 'selesai'
                                ? '#399242'
                                : item.status === 'telat'
                                ? '#A16207'
                                : undefined,
                            padding: '5px', // Menambahkan padding agar warna lebih terlihat
                            textAlign: 'center', // Memusatkan teks
                            borderRadius: '4px', // Menambahkan border radius untuk tampilan yang lebih baik
                          }}
                        >
                          {item.status}
                        </div>
                      </div>
                    </div>
                  </Card>
                  <p style={{ fontWeight: 'bold', fontFamily, marginTop: '20px' }}>
                    Alasan Ditolak
                  </p>
                  <Card style={{ borderColor: 'black' }}></Card>
                </Col>
              ))}

            {role === 'petugas' &&
              Array.isArray(dataSources) &&
              dataSources.map((item, index) => (
                <Col key={index} style={{ marginLeft: '50px' }}>
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
                            backgroundColor:
                              item.status === 'ditolak'
                                ? '#FCA5A5'
                                : item.status === 'selesai'
                                ? '#4ADE80'
                                : item.status === 'telat'
                                ? '#FACC15'
                                : undefined,
                            borderColor:
                              item.status === 'ditolak'
                                ? '#DE3838'
                                : item.status === 'selesai'
                                ? '#399242'
                                : item.status === 'telat'
                                ? '#A16207'
                                : undefined,
                            color:
                              item.status === 'ditolak'
                                ? '#C01A1A'
                                : item.status === 'selesai'
                                ? '#399242'
                                : item.status === 'telat'
                                ? '#A16207'
                                : undefined,
                            padding: '5px', // Menambahkan padding agar warna lebih terlihat
                            textAlign: 'center', // Memusatkan teks
                            borderRadius: '4px', // Menambahkan border radius untuk tampilan yang lebih baik
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
                  </Card>
                </Col>
              ))}
          </Row>
        </div>
      </Card>
    </div>
  );
};

export default DetailRiwayat;
