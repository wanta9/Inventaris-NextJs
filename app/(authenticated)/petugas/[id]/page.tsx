'use client';

import { Button, Card, Col, Divider, Row, Select } from 'antd';
import React from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useParams, useRouter } from 'next/navigation';
import { petugasRepository } from '#/repository/petugas';

const { Option } = Select;

const Editpetugas = () => {
  const rowStyle = { marginBottom: '25px' };
  const fontFamily = 'Barlow, sans-serif';
  const fontWeight = '600';
  const params = useParams();
  const id: string = params?.id;
  const { data: petugasById } = petugasRepository.hooks.usePetugasById(params.id);
  console.log(petugasById, 'barang masuk by id');
  const router = useRouter();

  const Kembali = () => {
    router.push('/petugas');
  };
  return (
    <div style={{ marginLeft: '50px', fontFamily }}>
      <title>Edit Petugas</title>
      <h1 style={{ fontFamily, fontWeight: 'bold', marginTop: '30px' }}>Profile</h1>
      <Card
        style={{
          marginTop: '100px',
          boxShadow: '0px 7px 10px rgba(0, 0, 0, 0.1)',
          width: '80%',
          borderRadius: '30px',
          height: '450px',
        }}
      >
        <div style={{ padding: '50px 50px 40px 80px', fontFamily }}>
          <Row>
            <Col push={1} span={9} style={{ marginTop: '20px' }}>
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
                  {petugasById?.data?.akun?.nama}
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
                  {petugasById?.data?.akun?.username}
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
                  {petugasById?.data?.akun?.telp}
                </Col>
              </Row>
              <Row align="middle" style={rowStyle}>
                <Col span={12} style={{ fontSize: '17px', fontFamily, fontWeight }}>
                  NIP
                </Col>
                <Col
                  span={3}
                  style={{ fontSize: '17px', color: '#8D8D8D', fontFamily, fontWeight }}
                >
                  :
                </Col>
                <Col
                  span={9}
                  style={{ fontSize: '17px', color: '#8D8D8D', fontFamily, fontWeight }}
                >
                  {petugasById?.data?.NIP}
                </Col>
              </Row>
              {/* <Row align="middle" style={rowStyle}>
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
                    style={{
                      width: '100%',
                      fontSize: '17px',
                      fontFamily,
                      fontWeight,
                      borderColor: 'black',
                    }}
                  >
                    <Option value="diterima">Diterima</Option>
                    <Option value="ditolak">Ditolak</Option>
                  </Select>
                </Col>
              </Row> */}
            </Col>
            <Col span={5} push={4}>
              <Divider type="vertical" style={{ height: '100%', borderColor: 'grey' }} />
            </Col>
            <Col span={8} push={2}>
              <Row align="middle">
                <Col span={5}>
                  <img
                    src="/sitmen.png"
                    alt="gambar"
                    style={{
                      width: '250px',
                      height: 'auto',
                      borderRadius: '100%',
                      marginTop: '20px',
                    }}
                  />
                </Col>
              </Row>
            </Col>
            <Col push={16} style={{ marginTop: '40px' }}>
              <Row align="middle">
                <Col style={{ fontSize: '17px', fontFamily, fontWeight }}>
                <div style={{ width: '250px', height: '50px', backgroundColor: '#582DD2', borderRadius: '10px', marginTop: '-10px'}}>
                   <Button type='link' icon={ <img src="/editProfile.svg" style={{ width: '19px', height: '19px', marginTop: '-10px', marginLeft: '25px',}}/>}>
                        <span style={{ color: 'white', fontFamily, fontSize: '20px', marginLeft: '20px'}}>Edit Profile</span>
                   </Button>
                </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </Card>
    </div>
  );
};
export default Editpetugas;
