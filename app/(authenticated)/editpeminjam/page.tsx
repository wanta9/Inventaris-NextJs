'use client';

import { Button, Card, Col, Divider, Row } from 'antd';
import React from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Option } from 'antd/es/mentions';
import { Select } from 'antd/lib';

const editpeminjam = () => {
  const rowStyle = { marginBottom: '25px' };
  const fontFamily = 'Barlow, sans-serif';
  const fontWeight = '500';
  return (
    <div style={{ marginLeft: '50px', fontFamily }}>
      <title>Edit Peminjam</title>
      <h1 style={{ fontSize: '25px', fontWeight: 'bold', marginTop: '70px' }}>Edit Peminjam</h1>
      <Card
        style={{ marginTop: '50px', boxShadow: '0px 7px 10px rgba(0, 0, 0, 0.1)', width: '80%', borderRadius: '30px', height: '450px'}}
      >
        <div style={{ padding: '50px 50px 40px 80px', fontFamily }}>
          <Row>
            <Col span={8} push={1} style={{ marginTop: '20px'}}>
              <Row align="middle" style={rowStyle}>
                <Col span={12} style={{ fontSize: '17px', fontFamily, fontWeight }}>
                  Nama Lengkap
                </Col>
                <Col
                  span={3}
                  style={{ fontSize: '17px', color: '#8D8D8D', fontFamily, fontWeight }}
                >
                  :
                </Col>
                <Col
                  span={8}
                  style={{ fontSize: '17px', color: '#8D8D8D', fontFamily, fontWeight }}
                >
                  John Brown
                </Col>
              </Row>
              <Row align="middle" style={rowStyle}>
                <Col span={12} style={{ fontSize: '17px', fontFamily, fontWeight }}>
                  Nama Pengguna
                </Col>
                <Col
                  span={3}
                  style={{ fontSize: '17px', color: '#8D8D8D', fontFamily, fontWeight }}
                >
                  :
                </Col>
                <Col
                  span={8}
                  style={{ fontSize: '17px', color: '#8D8D8D', fontFamily, fontWeight }}
                >
                  Johnny
                </Col>
              </Row>
              <Row align="middle" style={rowStyle}>
                <Col span={12} style={{ fontSize: '17px', fontFamily, fontWeight }}>
                  Telp
                </Col>
                <Col
                  span={3}
                  style={{ fontSize: '17px', color: '#8D8D8D', fontFamily, fontWeight }}
                >
                  :
                </Col>
                <Col
                  span={8}
                  style={{ fontSize: '17px', color: '#8D8D8D', fontFamily, fontWeight }}
                >
                  123456789
                </Col>
              </Row>
              <Row align="middle" style={rowStyle}>
                <Col span={12} style={{ fontSize: '17px', fontFamily, fontWeight }}>
                  NISN
                </Col>
                <Col
                  span={3}
                  style={{ fontSize: '17px', color: '#8D8D8D', fontFamily, fontWeight }}
                >
                  :
                </Col>
                <Col
                  span={8}
                  style={{ fontSize: '17px', color: '#8D8D8D', fontFamily, fontWeight }}
                >
                  1234567890
                </Col>
              </Row>
              <Row align="middle" style={rowStyle}>
                <Col span={12} style={{ fontSize: '17px', fontFamily, fontWeight }}>
                  Status
                </Col>
                <Col
                  span={3}
                  style={{ fontSize: '17px', color: '#8D8D8D', fontFamily, fontWeight }}
                >
                  :
                </Col>
                <Col span={8}>
                  <Select
                    placeholder="Status"
                    allowClear
                    style={{ width: '100%', fontSize: '17px', fontFamily, fontWeight, borderColor: 'black'}}
                  >
                    <Option value="diterima">Diterima</Option>
                    <Option value="ditolak">Ditolak</Option>
                  </Select>
                </Col>
              </Row>
            </Col>   
          <Col span={8} push={5}>
            <Divider type="vertical" style={{ height: '100%', borderColor: 'grey'}} />
          </Col>
            <Col span={8}>
              <Row align="middle">
                <Col span={12} >
                  <img src="sitmen.png" alt="gambar" style={{ width: '250px', height: 'auto', borderRadius: '100%', marginTop: '20px'}} />
                </Col>
              </Row>
            </Col> 
            <Col push={20} style={{ marginTop: '40px'}}>
              <Row align="middle">
                <Col style={{ fontSize: '17px', fontFamily, fontWeight}}>
                  <Button style={{ backgroundColor: '#582DD2', color: 'white', width: '200px', height: '35px', borderRadius: '10px'}}>
                    <a href="http://localhost:3001/peminjam" style={{ fontWeight, fontSize: '14px'}}>
                      Simpan
                    </a>
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </Card>
      <div style={{ display: 'flex', justifyContent: 'flex-end', width: '80%' }}>
        <Button style={{ marginTop: '30px', backgroundColor: '#582DD2', color: 'white', width: '20%', height: '50px', borderRadius: '10px'}}>
          <a href="http://localhost:3001/peminjam" style={{ fontSize: '15px', marginRight: '20px', fontWeight}}>
            <ArrowLeftOutlined style={{ marginRight: '25px' }} />
            Kembali
          </a>
        </Button>
      </div>
    </div>
  );
};

export default editpeminjam;
