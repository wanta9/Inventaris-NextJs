'use client';

import { FormInstance } from 'antd/lib/form';
import { Button, Card, Row, Col, DatePicker, Modal, Form, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { peminjamanRepository } from '#/repository/peminjaman';
import TextArea from 'antd/es/input/TextArea';
import { akunRepository } from '#/repository/akun';
import moment from 'moment';
import dayjs from 'dayjs';
import { statusBarang } from '../../dashboard/page';
import { useRouter } from 'next/navigation';

const { RangePicker } = DatePicker;

interface updateDitolak {
  id: string;
  status: statusBarang;
  keterangan: string;
}

interface updateSelesai {
  id: string;
  status: statusBarang;
  tanggalDikembalikan: string;
}

interface updateDiterima {
  id: string;
  status: statusBarang;
}
interface Item {
  id: string;
  status: statusBarang;
  keterangan: string;
}

const Detailpeminjaman = ({ params }: { params: { id: string } }) => {
  const [borrowDate, setBorrowDate] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const [form] = Form.useForm();
  const router = useRouter();
  // const [id, setId] = useState<string>('');
  const id: string = params?.id;
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
  const [updateSelesai, setupdateSelesai] = useState<updateSelesai>({
    id: '',
    status: statusBarang.Selesai,
    tanggalDikembalikan: '',
  });
  const { data: peminjamanById } = peminjamanRepository.hooks.usePeminjamanById(params.id);
  console.log(peminjamanById, 'peminjaman by id');
  const [dataSource, setDataSource] = useState([]);
  const [dataSources, setDataSources] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const statusStyles = {
    diterima: {
      backgroundColor: '#60A5FA',
      borderColor: '#1D4ED8',
      color: '#1D4ED8',
    },
    pending: {
      backgroundColor: '#9CA3AF',
      borderColor: '#374151',
      color: '#374151',
    },
    // ditolak: {
    //   backgroundColor: '#F87171',
    //   borderColor: '#B91C1C',
    //   color: '#B91C1C',
    // },
  };

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
        status: updateDiterima.status,
      };
      router.push('/peminjaman');
      const request = await peminjamanRepository.api.updatePeminjaman(id, data);
      if (request.status === 400) {
        setError(request.body.message);
      } else {
        message.success('Berhasil Menerima Peminjaman!');
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

  const onFinishSelesai = async (id: string) => {
    console.log('data id: ', id);
    try {
      setLoading(true);
      setError(null);
      const data = {
        status: updateSelesai.status,
        tanggalDikembalikan: updateSelesai.tanggalDikembalikan,
      };
      router.push('/peminjaman');
      const request = await peminjamanRepository.api.updatePeminjaman(id, data);
      if (request.status === 400) {
        setError(request.body.message);
      } else {
        message.success('Berhasil Menyelesaikan Peminjaman!');
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

  const handleDateChange = (date: any, dateString: any) => {
    setupdateSelesai({ ...updateSelesai, tanggalDikembalikan: dateString });
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

  const handleButtonClick = (status: string) => {
    console.log('Button clicked for status:', status);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onEndLoan = (id) => {
    // Logic to handle ending the loan
    console.log(`Loan with ID ${id} ended.`);
  };

  // const handleEdit = (record: Item) => {
  //   console.log(record, 'record data:');

  //   form.setFieldsValue({
  //     id: record.id,
  //     status: record.status,
  //     keterangan: record.keterangan,
  //   });

  //   setId(record.id);
  //   setStatus(record.status);
  //   setKeterangan(record.keterangan);
  //   showModal(); // Menampilkan modal
  // };

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

            {(role === 'admin' || role === 'peminjam') &&
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
                            width: '15vh',
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
                            width: '15vh',
                            border: '1px solid rgba(0, 0, 0, .50)',
                          }}
                        />
                      </div>

                      <div
                        style={{
                          marginBottom: '10px',
                          width: '100%',
                          alignItems: 'center',
                        }}
                      >
                        {item.status === 'pending' && (
                          <>
                            <div
                              style={{
                                marginBottom: '10px',
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            >
                              <span
                                style={{
                                  marginRight: '10px',
                                  minWidth: '150px',
                                  fontWeight,
                                  fontFamily,
                                }}
                              >
                                Tanggal Dikembalikan:
                              </span>
                              <DatePicker
                                disabled={item.status !== 'diterima'}
                                value={item.tanggalDikembalikan}
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
                                style={{
                                  marginRight: '10px',
                                  minWidth: '150px',
                                  fontWeight,
                                  display: 'flex',
                                  alignItems: 'center',
                                  fontFamily,
                                }}
                              >
                                Status:
                              </span>
                              <span
                                style={{
                                  fontWeight: 'bold',
                                  color:
                                    item.status === 'pending'
                                      ? '#FF0000'
                                      : item.status === 'diterima'
                                      ? '#5BFF00'
                                      : '#000000',
                                }}
                              >
                                <Button
                                  style={{
                                    color: '#FF0000',
                                    backgroundColor: 'rgba(255, 0, 0, 0.3)',
                                    borderColor: '#FF0000',
                                    marginRight: '10px',
                                  }}
                                  onClick={() => {
                                    setupdateDitolak({ id: item.id, keterangan: '' });
                                    showModal(); // Show modal for rejection
                                  }}
                                >
                                  Tolak
                                </Button>
                                <Button
                                  onClick={() => onFinishDiterima(item.id)}
                                  style={{
                                    color: '#5BFF00',
                                    backgroundColor: 'rgba(162, 225, 129, 0.3)',
                                    borderColor: '#A2E181',
                                  }}
                                >
                                  Terima
                                </Button>
                              </span>
                            </div>
                          </>
                        )}
                        {item.status === 'diterima' && (
                          <>
                            <div
                              style={{
                                marginBottom: '10px',
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            >
                              <span
                                style={{
                                  marginRight: '10px',
                                  minWidth: '150px',
                                  fontWeight,
                                  fontFamily,
                                }}
                              >
                                Tanggal Dikembalikan:
                              </span>
                              <DatePicker
                                placeholder="Tanggal Dikembalikan"
                                style={{ width: '100%', height: '40px' }}
                                value={
                                  updateSelesai.tanggalDikembalikan
                                    ? dayjs(updateSelesai.tanggalDikembalikan, 'YYYY-MM-DD')
                                    : null
                                }
                                onChange={handleDateChange}
                                format="YYYY-MM-DD"
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
                                style={{
                                  marginRight: '10px',
                                  minWidth: '150px',
                                  fontWeight,
                                  display: 'flex',
                                  alignItems: 'center',
                                  fontFamily,
                                }}
                              >
                                Status:
                              </span>
                              <span
                                style={{
                                  fontWeight: 'bold',
                                  color:
                                    item.status === 'pending'
                                      ? '#FF0000'
                                      : item.status === 'diterima'
                                      ? '#5BFF00'
                                      : '#000000',
                                }}
                              >
                                <Button
                                  onClick={() => {
                                    setupdateSelesai({
                                      id: item.id,
                                      status: statusBarang.Selesai, // Updated status to 'selesai'
                                      tanggalDikembalikan: moment().format('YYYY-MM-DD'),
                                    });
                                    onFinishSelesai(item.id); // Update function name if necessary
                                  }}
                                  style={{
                                    color: '#5BFF00',
                                    backgroundColor: 'rgba(162, 225, 129, 0.3)',
                                    borderColor: '#A2E181',
                                  }}
                                >
                                  Selesaikan
                                </Button>
                              </span>
                            </div>
                          </>
                        )}

                        <Modal
                          title="Alasan Ditolak"
                          style={{ textAlign: 'center' }}
                          visible={isModalVisible}
                          centered
                          onCancel={handleCancel}
                          footer={null}
                        >
                          <Form form={form} onFinish={() => onFinishDitolak(id)} layout="vertical">
                            <Form.Item
                              name="reason"
                              rules={[{ required: true, message: 'Silakan masukkan alasan!' }]}
                            >
                              <TextArea
                                style={{ marginTop: '20px', height: '100px' }}
                                value={updateDitolak.keterangan}
                                onChange={(e) =>
                                  setupdateDitolak({ ...updateDitolak, keterangan: e.target.value })
                                }
                              />
                            </Form.Item>
                            <Form.Item>
                              <Button
                                type="default"
                                onClick={handleCancel}
                                style={{
                                  marginTop: '20px',
                                  marginRight: '10px',
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
                                  marginTop: '20px',
                                }}
                              >
                                <span>Simpan</span>
                              </Button>
                            </Form.Item>
                          </Form>
                        </Modal>
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
