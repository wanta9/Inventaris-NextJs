'use client';

import React, { useState } from 'react';
import { Button, Card, Col, Modal, Row, Table, Space, InputNumber } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { akunRepository } from '#/repository/akun';
import { barangRepository } from '#/repository/barang';

const { Meta } = Card;


const Detailbarang = ({ params }: { params: { id: string } }) => {
  const fontFamily = 'Barlow, sans-serif';
  const fontWeight = '700';
  const router = useRouter();
  const { data: ruanganBarangById } = barangRepository.hooks.useBarangById(params.id);
  const { data: akun } = akunRepository.hooks.useAuth();
  const role = akun?.data?.peran?.Role;
  const harga = ruanganBarangById?.data?.harga;

  const [values, setValues] = useState(1);
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    setCount(count - 1);
  };

  const formattedHarga = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(harga);

  const deskripsi = ruanganBarangById?.data?.barang?.deskripsi || '';

  const wordCount = deskripsi.split(' ').length;

  const dataSource = [
    {
      id: '1',
      letakBarang: ruanganBarangById?.data?.ruangan?.Letak_Barang,
      jumlah: ruanganBarangById?.data?.jumlah,
    },
  ];

  let totalHeight = 0;
  dataSource.forEach((item) => {
    totalHeight += 50;
  });

  const scrollY = totalHeight > 200 ? { y: 200 } : {};

  const Kembali = () => {
    router.push('/barang');
  };

  const columns = [
    {
      title: 'Letak Barang',
      dataIndex: 'letakBarang',
      key: 'letakBarang',
    },
    {
      title: 'Jumlah',
      dataIndex: 'jumlah',
      key: 'jumlah',
    },
  ];

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div style={{ marginLeft: '50px', fontFamily }}>
      <title>Detail Barang</title>
      <h1 style={{ fontFamily, fontWeight: 'bold', fontSize: '25px' }}>Detail Barang</h1>
      {(role === 'admin' || role === 'petugas') && (
        <Card
          style={{
            width: '80%',
            height: '600px',
            marginTop: '50px',
            boxShadow: '0px 7px 10px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Row align="middle" justify="center">
            <Col span={12} style={{ display: 'flex', justifyContent: 'center' }}>
              <div
                style={{
                  width: '80%',
                  height: '450px',
                  backgroundColor: '#D9D9D9',
                  borderRadius: '20px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'absolute',
                  left: '75px',
                  top: '-250px',
                  bottom: '',
                }}
              >
                <img src="/kk.png" style={{ width: '70%', borderRadius: '20px' }} />
              </div>
            </Col>
            <Col span={12} style={{ paddingLeft: '40px', marginTop: '5px' }}>
              {role === 'admin' && (
                <Row style={{ marginBottom: '30px', fontSize: '16px', marginTop: '20px' }}>
                  <Col span={9} style={{ fontWeight }}>
                    Kode Barang
                  </Col>
                  <Col span={2}>:</Col>
                  <Col span={5}>{ruanganBarangById?.data?.kode}</Col>
                </Row>
              )}

              <Row style={{ marginBottom: '30px' }}>
                <Col span={9} style={{ fontWeight }}>
                  Nama Barang
                </Col>
                <Col span={2}>:</Col>
                <Col span={5}>{ruanganBarangById?.data?.nama}</Col>
              </Row>
              <Row style={{ marginBottom: '30px' }}>
                <Col span={9} style={{ fontWeight }}>
                  Harga
                </Col>
                <Col span={2}>:</Col>
                <Col span={5}>{formattedHarga}</Col>
              </Row>
              <Row style={{ marginBottom: '30px' }}>
                <Col span={9} style={{ fontWeight }}>
                  Stok Keseluruhan
                </Col>
                <Col span={2}>:</Col>
                <Col span={5}>{ruanganBarangById?.data?.jumlah}</Col>
              </Row>
              <Row style={{ marginBottom: '100px' }}>
                <Col span={24}>
                  <Table
                    dataSource={dataSource}
                    columns={columns}
                    scroll={{ y: 200 }}
                    style={{
                      width: '100%',
                      height: '200px',
                    }}
                    bordered
                  />
                </Col>
              </Row>
            </Col>
          </Row>
          <Row style={{ marginTop: '-50px', marginBottom: '20px' }}>
            <Col
              push={1}
              span={24}
              style={{ fontWeight: 'bold', fontSize: '20px', marginTop: '20px' }}
            >
              Deskripsi
            </Col>
          </Row>
          <Row>
            <Col
              push={1}
              span={23}
              style={{
                fontWeight,
                fontFamily,
                fontSize: '17px',
                overflowY: wordCount > 100 ? 'scroll' : 'visible',
                maxHeight: wordCount > 100 ? '100px' : 'auto',
                whiteSpace: 'pre-wrap',
              }}
            >
              {ruanganBarangById?.data?.deskripsi}
            </Col>
          </Row>
        </Card>
      )}

      {role === 'peminjam' && (
        <Card
          style={{
            width: '80%',
            height: 'auto',
            marginTop: '50px',
            boxShadow: '0px 7px 10px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Row align="middle" justify="center" gutter={[16, 16]}>
            <Col xs={24} md={12} style={{ display: 'flex', justifyContent: 'center' }}>
              <div
                style={{
                  width: '70%',
                  height: '300px',
                  backgroundColor: '#D9D9D9',
                  borderRadius: '20px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
                  marginTop: '30px',
                  marginLeft: '-40px',
                }}
              >
                <img src="/kk.png" style={{ width: '70%', borderRadius: '20px' }} />
              </div>
            </Col>
            <Col xs={24} md={12} style={{ paddingLeft: '40px', marginTop: '70px' }}>
              <Row style={{ marginBottom: '30px' }}>
                <Col xs={9} style={{ fontWeight, fontFamily, fontSize: '18px' }}>
                  Nama Barang
                </Col>
                <Col xs={2}>:</Col>
                <Col xs={13} style={{ fontWeight, fontFamily, fontSize: '15px' }}>{ruanganBarangById?.data?.nama}</Col>
              </Row>
              <Row style={{ marginBottom: '30px' }}>
                <Col xs={9} style={{ fontWeight, fontFamily, fontSize: '18px' }}>
                  Harga
                </Col>
                <Col xs={2}>:</Col>
                <Col xs={13} style={{ fontWeight, fontFamily, fontSize: '15px' }}>{formattedHarga}</Col>
              </Row>
              <Row style={{ marginBottom: '30px' }}>
                <Col xs={9} style={{ fontWeight, fontFamily, fontSize: '18px' }}>
                  Stok Keseluruhan
                </Col>
                <Col xs={2}>:</Col>
                <Col xs={13} style={{ fontWeight, fontFamily, fontSize: '15px' }}>{ruanganBarangById?.data?.jumlah}</Col>
              </Row>
            </Col>
          </Row>
          <Row style={{ marginTop: '-10px', marginBottom: '20px' }}>
            <Col
              push={1}
              span={24}
              style={{ fontWeight: 'bold', fontSize: '20px', marginTop: '40px', marginLeft: '10px' }}
            >
              Deskripsi
            </Col>
          </Row>
          <Row>
            <Col
              push={1}
              span={23}
              style={{ fontWeight, fontFamily, fontSize: '17px', whiteSpace: 'pre-wrap', marginLeft: '10px' }}
            >
              {ruanganBarangById?.data?.deskripsi}
            </Col>
          </Row>
          <Row justify="end" style={{ marginTop: '20px' }}>
          <Col>
            <Button
              style={{
                backgroundColor: '#582DD2',
                color: 'white',
                width: '150px',
                height: '50px',
                borderRadius: '10px',
              }}
              onClick={showModal}
            >
              Pinjam
            </Button>
          </Col>
        </Row>
      </Card>
      
      )}

      <Modal
        visible={isModalVisible}
        width={1300}
        centered
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Pinjam"
        cancelText="Batal"
      >
        <Row align="middle" justify="center">
            <Col span={12} style={{ display: 'flex', justifyContent: 'center' }}>
              <div
                style={{
                  width: '80%',
                  height: '400px',
                  backgroundColor: '#D9D9D9',
                  borderRadius: '20px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'absolute',
                  left: '75px',
                  top: '-80px',
                  bottom: '',
                }}
              >
                <img src="/kk.png" style={{ width: '70%', borderRadius: '20px' }} />
              </div>
            </Col>
            <Col span={12} style={{ paddingLeft: '40px', marginTop: '70px' }}>
              <Row style={{ marginBottom: '30px' }}>
                <Col span={9} style={{ fontWeight, fontFamily, fontSize: '18px' }}>
                  Nama Barang
                </Col>
                <Col span={2}>:</Col>
                <Col span={5}>{ruanganBarangById?.data?.barang?.nama}</Col>
              </Row>
              <Row style={{ marginBottom: '30px' }}>
                <Col span={9} style={{ fontWeight, fontFamily, fontSize: '18px' }}>
                  Harga
                </Col>
                <Col span={2}>:</Col>
                <Col span={5}>{ruanganBarangById?.data?.barang?.harga}</Col>
              </Row>
              <Row style={{ marginBottom: '30px' }}>
                <Col span={9} style={{ fontWeight, fontFamily, fontSize: '18px' }}>
                  Stok Keseluruhan
                </Col>
                <Col span={2}>:</Col>
                <Col span={5}>{ruanganBarangById?.data?.barang?.jumlah}</Col>
              </Row>
            </Col>
          </Row>
          <Row style={{ marginTop: '200px', marginBottom: '20px' }}>
            <Col
              push={1}
              span={24}
              style={{ fontWeight, fontFamily, fontSize: '20px', marginTop: '30px' }}
            >
              Pilih Ruangan
            </Col>
          </Row>
          <Row>
            <Col
              push={1}
              span={23}
              style={{
                fontWeight,
                fontFamily,
                fontSize: '17px',
                whiteSpace: 'pre-wrap',
              }}
            >
              <Button
                style={{
                  backgroundColor: '#582DD2',
                  color: 'white',
                  width: '8%',
                  height: '40px',
                  borderRadius: '10px',
                }}
              >
                Pinjam
              </Button>
            </Col>
          </Row>
          <Row style={{ marginTop: '10px', marginBottom: '10px' }}>
            <Col
              push={1}
              span={24}
              style={{ fontWeight, fontFamily, fontSize: '20px', marginTop: '30px' }}
            >
              Tentukan Jumlah
            </Col>
          </Row>
          <Col>
          <Row>
                
          </Row>
          </Col>
      </Modal>

      <div
        style={{ display: 'flex', justifyContent: 'flex-end', width: '80%' }}
        onClick={() => Kembali()}
      >
        <Button
          style={{
            marginTop: '30px',
            backgroundColor: '#582DD2',
            color: 'white',
            width: '20%',
            height: '50px',
            borderRadius: '10px',
          }}
        >
          <a
            href="http://localhost:3002/barang"
            style={{ fontSize: '15px', marginRight: '20px', fontWeight }}
          >
            <ArrowLeftOutlined style={{ marginRight: '25px' }} />
            Kembali
          </a>
        </Button>
      </div>
    </div>
  );
};

export default Detailbarang;
