'use client';

import { Button, Card, Col, Row} from 'antd';
import React from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';

const editpeminjam = () => {
  const fontFamily = 'Barlow, sans-serif';
  const fontWeight = '700';
  return (
    <div style={{ marginLeft: '50px', fontFamily }}>
      <title>Barang Keluar</title>
      <h1 style={{ fontSize: '25px', fontWeight: 'bold', marginTop: '30px' }}>Detail Barang Keluar</h1>
      <Card style={{ width: '80%', marginTop: '40px', boxShadow: '0px 7px 10px rgba(0, 0, 0, 0.1)' }}>
      <Row align="middle" justify="center">
        <Col span={12} style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%', height: '400px', backgroundColor: '#D9D9D9', borderRadius: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img src="kk.png" alt="gambar" style={{ width: '70%', borderRadius: '20px' }} />
          </div>
        </Col>
        <Col span={12} style={{ paddingLeft: '40px', marginBottom: '60px'}}>
          <Row style={{ marginBottom: '30px', fontSize: '16px'}}>
            <Col span={9} style={{ fontWeight }}>Kode Barang</Col>
            <Col span={3}>:</Col>
            <Col span={5}>BB00</Col>
          </Row>
          <Row style={{ marginBottom: '30px'}}> 
            <Col span={9} style={{ fontWeight }}>Nama Barang</Col>
            <Col span={3}>:</Col>
            <Col span={5}>Proyektor</Col>
          </Row>
          <Row style={{ marginBottom: '30px'}}>
            <Col span={9} style={{ fontWeight }}>Jumlah Barang</Col>
            <Col span={3}>:</Col>
            <Col span={5}>25</Col>
          </Row>
          <Row style={{ marginBottom: '30px'}}>
            <Col span={9} style={{ fontWeight }}>Tanggal Keluar</Col>
            <Col span={3}>:</Col>
            <Col span={5}>32/03/2024</Col>
          </Row>
          <Row style={{ marginBottom: '30px'}}>
            <Col span={9} style={{ fontWeight }}>Ruangan</Col>
            <Col span={3}>:</Col>
            <Col span={5}>RPL</Col>
          </Row>
          <Row style={{ marginBottom: '20px', alignItems: 'baseline'}}>
            <Col span={9} style={{ fontWeight }}>Keterangan</Col>
            <Col span={3}>:</Col>
            <Col span={12} style={{ display: 'flex', alignItems: 'center'}}>Bantuan Bansos</Col>
          </Row>
        </Col>
      </Row>
    </Card>
      <div style={{ display: 'flex', justifyContent: 'flex-end', width: '80%' }}>
        <Button style={{ marginTop: '30px', backgroundColor: '#582DD2', color: 'white', width: '20%', height: '50px', borderRadius: '10px'}}>
          <a href="http://localhost:3002/barangkeluar" style={{ fontSize: '15px', marginRight: '20px', fontWeight}}>
            <ArrowLeftOutlined style={{ marginRight: '25px' }} />
            Kembali
          </a>
        </Button>
      </div>    
    </div>
  );
};

export default editpeminjam;
