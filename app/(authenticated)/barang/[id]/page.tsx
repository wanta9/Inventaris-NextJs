'use client';

import { Button, Card, Col, Divider, Row, Select, Table } from 'antd';
import React from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { ruanganBarangRepository } from '#/repository/ruanganbarang';

const { Option } = Select;

const Detailbarang = ({ params }: { params: { id: string } }) => {
  const fontFamily = 'Barlow, sans-serif';
  const fontWeight = '700';
  const router = useRouter();
  const { data: ruanganBarangById } = ruanganBarangRepository.hooks.useRuanganBarangById(params.id);
  console.log(ruanganBarangById, 'barang masuk by id');

  const dataSource = [
    {
      id: '1',
      letakBarang: ruanganBarangById?.data?.ruangan?.Letak_Barang,
      jumlah: ruanganBarangById?.data?.jumlah,
    },
  ];
  const Kembali = () => {
    router.push('/barang');
  };

  const columns = [
    {
      title: 'Letak Barang',
      dataIndex: 'letakBarang',
      key: 'letakBarang',
      // render: (text: string, record: DataType) => {
      //   console.log(record);
      //   return record.ruangan.Letak_Barang;
      // },
    },
    {
      title: 'Jumlah',
      dataIndex: 'jumlah',
      key: 'jumlah',
    },
  ];

  return (
    <div style={{ marginLeft: '50px', fontFamily }}>
      <title>Detail Barang</title>
      <h1 style={{ fontFamily, fontWeight: 'bold', fontSize: '25px' }}>Detail Barang</h1>
      <Card
        style={{
          width: '80%',
          height: '700px',
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
            <Row style={{ marginBottom: '30px', fontSize: '16px', marginTop: '20px' }}>
              <Col span={9} style={{ fontWeight }}>
                Kode Barang
              </Col>
              <Col span={2}>:</Col>
              <Col span={5}>{ruanganBarangById?.data?.barang?.kode}</Col>
            </Row>
            <Row style={{ marginBottom: '30px' }}>
              <Col span={9} style={{ fontWeight }}>
                Nama Barang
              </Col>
              <Col span={2}>:</Col>
              <Col span={5}>{ruanganBarangById?.data?.barang?.nama}</Col>
            </Row>
            <Row style={{ marginBottom: '30px' }}>
              <Col span={9} style={{ fontWeight }}>
                Harga
              </Col>
              <Col span={2}>:</Col>
              <Col span={5}>{ruanganBarangById?.data?.barang?.harga}</Col>
            </Row>
            <Row style={{ marginBottom: '30px' }}>
              <Col span={9} style={{ fontWeight }}>
                Stok Keseluruhan
              </Col>
              <Col span={2}>:</Col>
              <Col span={5}>{ruanganBarangById?.data?.barang?.jumlah}</Col>
            </Row>
            <Row style={{ marginBottom: '100px' }}>
              <Col span={24}>
                <Table
                  dataSource={dataSource}
                  columns={columns}
                  // pagination={{ pageSize: 3 }}
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
          <Col push={1} span={23} style={{ fontWeight, fontFamily, fontSize: '17px' }}>
            {ruanganBarangById?.data?.barang?.deskripsi}
          </Col>
        </Row>
      </Card>
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
