'use client';

import { Button, Card, Col, Divider, message, Row, Select } from 'antd';
import React, { useState } from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useParams, useRouter } from 'next/navigation';
import { akunRepository } from '#/repository/akun';
import { statusBarang } from '../../dashboard/page';
import { config } from '#/config/app';

export const imgUrl = (photo: string) => `${config.baseUrl}/upload/get-akun/${photo}`;

console.log(imgUrl, 'img url');

const { Option } = Select;

interface updateStatus {
  id: string;
  peranId: string;
  status: statusBarang;
}

const Editpeminjam = ({ params }: { params: { id: string } }) => {
  const [status, setStatus] = useState<string | undefined>();
  const rowStyle = { marginBottom: '25px' };
  const fontFamily = 'Barlow, sans-serif';
  const fontWeight = '500';
  const id: string = params?.id;
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { data: akunbyId } = akunRepository.hooks.useAkunbyId(params.id);
  console.log(akunbyId, 'akun by id');
  const [updateStatus, setupdateStatus] = useState<updateStatus>({
    id: '',
    peranId: '5954d800-e79a-405d-a408-95095f494e3d',
    status: statusBarang.Pending,
  });

  const router = useRouter();

  const Kembali = () => {
    router.push('/peminjam');
  };

  const handleStatusChange = (value: statusBarang) => {
    setupdateStatus((prevState) => ({
      ...prevState,
      status: value,
    }));
  };

  const onFinishEdit = async (id: string) => {
    console.log('data id: ', id);
    try {
      setLoading(true);
      setError(null);
      const data = {
        peranId: updateStatus.peranId,
        status: updateStatus.status,
      };
      const request = await akunRepository.api.updateAkun(id, data);
      if (request.status === 400) {
        setError(request.body.message);
      } else {
        message.success('Berhasil Mengedit Petugas!');
      }
      console.log(request);
    } catch (error) {
      console.log(error);
      setError('Terjadi kesalahan pada server.');
      message.error('GagalMengedit Petugas!');
      console.log();
    } finally {
      setLoading(false);
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
                  {akunbyId?.data?.nama}
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
                  {akunbyId?.data?.username}
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
                  {akunbyId?.data?.telp}
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
                  {akunbyId?.data?.peminjam?.NISN}
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
                    style={{
                      width: '100%',
                      fontSize: '17px',
                      fontFamily,
                      fontWeight,
                      borderColor: 'black',
                    }}
                    value={updateStatus.status}
                    onChange={handleStatusChange}
                  >
                    <Option value={statusBarang.Diterima}>Diterima</Option>
                    <Option value={statusBarang.Ditolak}>Ditolak</Option>
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
                    src={imgUrl(akunbyId?.data?.gambar)}
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
                    onClick={() => onFinishEdit(id)}
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
