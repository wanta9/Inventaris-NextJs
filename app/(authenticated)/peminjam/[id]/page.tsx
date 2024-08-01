'use client';

import { Button, Card, Col, Divider, message, Row, Select } from 'antd';
import React, { useState } from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useParams, useRouter } from 'next/navigation';
import { akunRepository } from '#/repository/akun';

const { Option } = Select;

const Editpeminjam = ({ params }: { params: { id: string } }) => {
  const [status, setStatus] = useState<string | undefined>();
  const rowStyle = { marginBottom: '25px' };
  const fontFamily = 'Barlow, sans-serif';
  const fontWeight = '500';
  const id: string = params?.id;
  const { data: akunbyId } = akunRepository.hooks.useAkunbyId(params.id);
  console.log(akunbyId, 'akun by id');
  const router = useRouter();

  const Kembali = () => {
    router.push('/peminjam');
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
  };

  const SaveChanges = async (id: string, status: string, data: any) => {
    console.log(id, status, data);
    if (status) {
      try {
        await akunRepository.api.updateAkun(id, { status }, data);
        console.log('Status updated successfully!');
          
        message.success('Akun berhasil diterima!');

      } catch (error) {
        console.error('Failed to update status:', error);
      }
    } else {
      console.warn('No status selected!');
    }
  };

  return (
    <div style={{ marginLeft: '50px', fontFamily }}>
      <h1 style={{ fontSize: '25px', fontWeight: 'bold', marginTop: '40px' }}>Edit Peminjam</h1>
      <Card
        style={{
          marginTop: '50px',
          boxShadow: '0px 7px 10px rgba(0, 0, 0, 0.1)',
          width: '80%',
          borderRadius: '30px',
          height: '450px',
          position: 'relative',
        }}
      >
        <div style={{ padding: '50px 50px 40px 80px', fontFamily }}>
          <Row>
            <Col span={8} push={1} style={{ marginTop: '20px' }}>
              <Row align="middle" style={rowStyle}>
                <Col span={12} style={{ fontSize: '17px', fontFamily, fontWeight }}>
                  Nama Lengkap
                </Col>
                <Col span={3} style={{ fontSize: '17px', color: '#8D8D8D', fontFamily, fontWeight }}>
                  :
                </Col>
                <Col span={8} style={{ fontSize: '17px', color: '#8D8D8D', fontFamily, fontWeight }}>
                  {akunbyId?.data?.nama}
                </Col>
              </Row>
              <Row align="middle" style={rowStyle}>
                <Col span={12} style={{ fontSize: '17px', fontFamily, fontWeight }}>
                  Nama Pengguna
                </Col>
                <Col span={3} style={{ fontSize: '17px', color: '#8D8D8D', fontFamily, fontWeight }}>
                  :
                </Col>
                <Col span={8} style={{ fontSize: '17px', color: '#8D8D8D', fontFamily, fontWeight }}>
                  {akunbyId?.data?.username}
                </Col>
              </Row>
              <Row align="middle" style={rowStyle}>
                <Col span={12} style={{ fontSize: '17px', fontFamily, fontWeight }}>
                  Telp
                </Col>
                <Col span={3} style={{ fontSize: '17px', color: '#8D8D8D', fontFamily, fontWeight }}>
                  :
                </Col>
                <Col span={8} style={{ fontSize: '17px', color: '#8D8D8D', fontFamily, fontWeight }}>
                  {akunbyId?.data?.telp}
                </Col>
              </Row>
              <Row align="middle" style={rowStyle}>
                <Col span={12} style={{ fontSize: '17px', fontFamily, fontWeight }}>
                  NISN
                </Col>
                <Col span={3} style={{ fontSize: '17px', color: '#8D8D8D', fontFamily, fontWeight }}>
                  :
                </Col>
                <Col span={8} style={{ fontSize: '17px', color: '#8D8D8D', fontFamily, fontWeight }}>
                  {akunbyId?.data?.peminjam?.NISN}
                </Col>
              </Row>
              <Row align="middle" style={rowStyle}>
                <Col span={12} style={{ fontSize: '17px', fontFamily, fontWeight }}>
                  Status
                </Col>
                <Col span={3} style={{ fontSize: '17px', color: '#8D8D8D', fontFamily, fontWeight }}>
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
                    onChange={handleStatusChange}
                  >
                    <Option value="diterima">Diterima</Option>
                    <Option value="ditolak">Ditolak</Option>
                  </Select>
                </Col>
              </Row>
            </Col>
            <Col span={8} push={5}>
              <Divider type="vertical" style={{ height: '100%', borderColor: 'grey' }} />
            </Col>
            <Col span={8}>
              <Row align="middle">
                <Col span={12}>
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
              <Row align="middle" style={{ marginTop: '20px' }}>
                <Col span={24}>
                  <Button
                    style={{
                      backgroundColor: '#582DD2',
                      color: 'white',
                      width: '40%',
                      height: '50px',
                      borderRadius: '10px',
                      marginLeft: '200px',
                    }}
                    onClick={SaveChanges}
                  >
                    Simpan
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
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
          <a style={{ fontSize: '15px', marginRight: '20px', fontWeight }}>
            <ArrowLeftOutlined style={{ marginRight: '25px' }} />
            Kembali
          </a>
        </Button>
      </div>
    </div>
  );
};

export default Editpeminjam;
