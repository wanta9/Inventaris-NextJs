'use client';

import { Button, Card, Col, Divider, Row } from 'antd';
import React from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Option } from 'antd/es/mentions';
import { Select } from 'antd/lib';
import dynamic from 'next/dynamic';
import { barangRusakRepository } from '#/repository/barangrusak';
import dayjs from 'dayjs';

const barangRusak = ({ params }: { params: { id: string } }) => {
  const { data: barangRusakById } = barangRusakRepository.hooks.useBarangRusakById(params.id);
  console.log(barangRusakById, 'barang rusak by id');
  const rowStyle = { marginBottom: '25px' };
  const fontFamily = 'Barlow, sans-serif';
  const fontWeight = '700';
  const formattedDate = dayjs(barangRusakById?.data?.tanggalRusak).format('DD-MM-YYYY');
  const handleButtonClick = (status: string) => {
    console.log('Button clicked for phone number:', status);
  };
  return (
    <div style={{ marginLeft: '50px', fontFamily }}>
      <title>Barang Rusak</title>
      <h1 style={{ fontSize: '25px', fontWeight: 'bold', marginTop: '30px' }}>
        Detail Barang Rusak
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
          <Col span={12} style={{ paddingLeft: '40px', marginBottom: '30px' }}>
            <Row style={{ marginBottom: '30px', fontSize: '16px' }}>
              <Col span={9} style={{ fontWeight }}>
                Kode Barang
              </Col>
              <Col span={3}>:</Col>
              <Col span={5}>{barangRusakById?.data?.kode}</Col>
            </Row>
            <Row style={{ marginBottom: '30px' }}>
              <Col span={9} style={{ fontWeight }}>
                Nama Barang
              </Col>
              <Col span={3}>:</Col>
              <Col span={5}>{barangRusakById?.data?.ruanganBarang?.barang?.nama}</Col>
            </Row>
            <Row style={{ marginBottom: '30px' }}>
              <Col span={9} style={{ fontWeight }}>
                Jumlah Barang
              </Col>
              <Col span={3}>:</Col>
              <Col span={5}>{barangRusakById?.data?.jumlah}</Col>
            </Row>
            <Row style={{ marginBottom: '30px' }}>
              <Col span={9} style={{ fontWeight }}>
                Tanggal Rusak
              </Col>
              <Col span={3}>:</Col>
              <Col span={5}>{formattedDate}</Col>
            </Row>
            <Row style={{ marginBottom: '30px' }}>
              <Col span={9} style={{ fontWeight }}>
                Status
              </Col>
              <Col span={3}>:</Col>
              <Col span={5}>
                <Button
                  style={{
                    color: '#5BFF00',
                    backgroundColor: 'rgba(162, 225, 129, 0.3)',
                    borderColor: '#A2E181',
                  }}
                  // type="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (barangRusakById?.data?.Status) {
                      handleButtonClick(barangRusakById?.data?.Status);
                    }
                  }}
                >
                  {barangRusakById?.data?.Status}
                </Button>
                {/* <Button
                  style={{
                    color: '#5BFF00',
                    backgroundColor: 'rgba(162, 225, 129, 0.3)',
                    borderColor: '#A2E181',
                  }}
                >
                  {barangRusakById?.data?.status}
                </Button> */}
              </Col>
            </Row>
            <Row style={{ marginBottom: '30px' }}>
              <Col span={9} style={{ fontWeight }}>
                Ruangan
              </Col>
              <Col span={3}>:</Col>
              <Col span={5}>RPL</Col>
            </Row>
            <Row style={{ marginBottom: '20px' }}>
              <Col span={9} style={{ fontWeight }}>
                Keterangan
              </Col>
              <Col span={3}>:</Col>
              <Col span={12} style={{ display: 'flex', alignItems: 'center' }}>
                {barangRusakById?.data?.keterangan}
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
            href="http://localhost:3002/barangrusak"
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

export default barangRusak;
