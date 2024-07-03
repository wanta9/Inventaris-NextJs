'use client';

import { Button, Card, Col, Divider, Row } from 'antd';
import React from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Option } from 'antd/es/mentions';
import { Select } from 'antd/lib';
import { useParams } from 'next/navigation';
import { barangMasukRepository } from '#/repository/barangmasuk';
import dynamic from 'next/dynamic';
import dayjs from 'dayjs';

const Editpeminjam = ({ params }: { params: { id: string } }) => {
  // const params = useParams();
  // const id: string = params?.id;
  const { data: barangMasukById } = barangMasukRepository.hooks.useBarangMasukById(params.id);
  console.log(barangMasukById, 'barang masuk by id');
  const rowStyle = { marginBottom: '25px' };
  const fontFamily = 'Barlow, sans-serif';
  const fontWeight = '700';

  const formattedDate = dayjs(barangMasukById?.data?.tanggalMasuk).format('DD-MM-YYYY');
  const harga = barangMasukById?.data?.ruanganBarang?.barang?.harga;

  // Menggunakan Intl.NumberFormat langsung di dalam JSX untuk format rupiah
  const formattedHarga = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(harga);

  return (
    <div style={{ marginLeft: '50px', fontFamily }}>
      <title>Barang Masuk</title>
      <h1 style={{ fontSize: '25px', fontWeight: 'bold', marginTop: '30px' }}>
        Detail Barang Masuk
      </h1>
      <Card
        style={{ width: '80%', marginTop: '40px', boxShadow: '0px 7px 10px rgba(0, 0, 0, 0.1)' }}
      >
        <Row align="middle" justify="center">
          <Col span={12} style={{ display: 'flex', justifyContent: 'center' }}>
            <div
              style={{
                width: '100%',
                height: '400px',
                backgroundColor: '#D9D9D9',
                borderRadius: '20px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <img src="/kk.png" alt="gambar" style={{ width: '70%', borderRadius: '20px' }} />
            </div>
          </Col>
          <Col span={12} style={{ paddingLeft: '40px', marginBottom: '50px' }}>
            <Row style={{ marginBottom: '30px', fontSize: '16px' }}>
              <Col span={9} style={{ fontWeight }}>
                Kode Barang
              </Col>
              <Col span={3}>:</Col>
              <Col span={5}>{barangMasukById?.data?.kode}</Col>
            </Row>
            <Row style={{ marginBottom: '30px' }}>
              <Col span={9} style={{ fontWeight }}>
                Nama Barang
              </Col>
              <Col span={3}>:</Col>
              <Col span={5}>{barangMasukById?.data?.ruanganBarang?.barang?.nama}</Col>
            </Row>
            <Row style={{ marginBottom: '30px' }}>
              <Col span={9} style={{ fontWeight }}>
                Harga
              </Col>
              <Col span={3}>:</Col>
              <Col span={5}>{formattedHarga}</Col>
            </Row>
            <Row style={{ marginBottom: '30px' }}>
              <Col span={9} style={{ fontWeight }}>
                Jumlah Barang
              </Col>
              <Col span={3}>:</Col>
              <Col span={5}>{barangMasukById?.data?.jumlah}</Col>
            </Row>
            <Row style={{ marginBottom: '30px' }}>
              <Col span={9} style={{ fontWeight }}>
                Tanggal Masuk
              </Col>
              <Col span={3}>:</Col>
              <Col span={5}>{formattedDate}</Col>
            </Row>
            <Row style={{ marginBottom: '30px' }}>
              <Col span={9} style={{ fontWeight }}>
                Ruangan
              </Col>
              <Col span={3}>:</Col>
              <Col span={5}>{barangMasukById?.data?.ruanganBarang?.ruangan?.Letak_Barang}</Col>
            </Row>
            <Row style={{ marginBottom: '20px' }}>
              <Col span={9} style={{ fontWeight }}>
                Keterangan
              </Col>
              <Col span={3}>:</Col>
              <Col span={12} style={{ display: 'flex', alignItems: 'center' }}>
                {barangMasukById?.data?.keterangan}
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
      <div style={{ display: 'flex', justifyContent: 'flex-end', width: '80%' }}>
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
            href="http://localhost:3002/barangmasuk"
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

export default Editpeminjam;
