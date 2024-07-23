'use client';

import { Button, Card, Col, Divider, Form, Input, Modal, Row, Select, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import { ArrowLeftOutlined, EditOutlined, LockOutlined, UploadOutlined } from '@ant-design/icons';
import { useParams, useRouter } from 'next/navigation';
import { petugasRepository } from '#/repository/petugas';
import { parseJwt } from '#/utils/parseJwt';
import { request } from 'http';
import { akunRepository } from '#/repository/akun';

const { Option } = Select;

const Profile = () => {
  const rowStyle = { marginBottom: '25px' };
  const fontFamily = 'Barlow, sans-serif';
  const fontWeight = '500';
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [namaLengkap, setNamaLengkap] = useState('');
  const [namaPengguna, setNamaPengguna] = useState('');
  const [nomorInduk, setNomorInduk] = useState('');
  const [telpon, setTelpon] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      const parseToken = parseJwt(token);
      setNamaLengkap(parseToken.existUser.nama);
      setNamaPengguna(parseToken.existUser.username);
      setNomorInduk(parseToken.existUser.nomorInduk);
      setTelpon(parseToken.existUser.telp);
    }
  });
  const handleEditClick = () => {
    setIsEditing(true);
  };

  // const onFinish = async (values: any) => {
  //   console.log('data values: ', values);
  //   try {
  //     setLoading(true);
  //     setError(null);
  //     const data = {
  //     };
  //     const request = await barangMasukRepository.api.barangMasuk(data);
  //     if (request.status === 400) {
  //       setError(request.body.message); // Set pesan error
  //     } else {
  //       message.success('Data berhasil disimpan!');
  //       setModalVisible(false);
  //     }
  //     console.log(request);
  //   } catch (error) {
  //     console.log(error);
  //     setError('Terjadi kesalahan pada server.');
  //     message.error('Terjadi kesalahan saat menyimpan data.');
  //     console.log();
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  const handleModalCancel = () => {
    setModalVisible(false);
    // setModalEditVisible(false);
    // setNama('');
    // setNamaPengguna('');
    // setNIP('');
    // setTelp('');
  };

  const handleButtonClick = () => {
    setModalVisible(true);
  };

  // const

  const handleKembaliClick = () => {
    setIsEditing(false);
  };

  const handleNamaLengkapChange = (e: any) => {
    setNamaLengkap(e.target.value);
  };

  const handleNamaPenggunaChange = (e: any) => {
    setNamaPengguna(e.target.value);
  };

  const handleTelponChange = (e: any) => {
    setTelpon(e.target.value);
  };

  const handleSave = () => {
    // Implement save functionality here
    setIsEditing(false);
  };

  const { data: listPetugas } = petugasRepository.hooks.usePetugas();
  console.log(listPetugas, 'barang masuk by id');

  return (
    <div style={{ marginLeft: '50px', fontFamily }}>
      <h1 style={{ fontSize: '25px', fontWeight: 'bold', marginTop: '40px' }}>Profile</h1>
      <title>Profile</title>
      <Card
        style={{
          marginTop: '60px',
          boxShadow: '0px 7px 10px rgba(0, 0, 0, 0.1)',
          width: '80%',
          borderRadius: '30px',
          height: 'auto',
        }}
      >
        <div style={{ padding: '80px 50px 10px 80px', fontFamily }}>
          <Row>
            <Col span={12} style={{ marginTop: '20px' }}>
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
                <Col span={8}>
                  {isEditing ? (
                    <Input
                      value={namaLengkap}
                      onChange={handleNamaLengkapChange}
                      style={{ fontSize: '17px', color: '#8D8D8D', fontFamily, fontWeight }}
                    />
                  ) : (
                    <span style={{ fontSize: '17px', color: '#8D8D8D', fontFamily, fontWeight }}>
                      {namaLengkap}
                    </span>
                  )}
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
                <Col span={8}>
                  {isEditing ? (
                    <Input
                      value={namaPengguna}
                      onChange={handleNamaPenggunaChange}
                      style={{ fontSize: '17px', color: '#8D8D8D', fontFamily, fontWeight }}
                    />
                  ) : (
                    <span style={{ fontSize: '17px', color: '#8D8D8D', fontFamily, fontWeight }}>
                      {namaPengguna}
                    </span>
                  )}
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
                  span={8}
                  style={{
                    fontSize: '17px',
                    color: '#8D8D8D',
                    fontFamily,
                    fontWeight,
                  }}
                >
                  {nomorInduk}
                </Col>
              </Row>
              <Row align="middle" style={rowStyle}>
                <Col span={12} style={{ fontSize: '17px', fontFamily, fontWeight }}>
                  Telpon
                </Col>
                <Col
                  span={3}
                  style={{ fontSize: '17px', color: '#8D8D8D', fontFamily, fontWeight }}
                >
                  :
                </Col>
                <Col span={8}>
                  {isEditing ? (
                    <Input
                      value={telpon}
                      onChange={handleTelponChange}
                      style={{ fontSize: '17px', color: '#8D8D8D', fontFamily, fontWeight }}
                    />
                  ) : (
                    <span style={{ fontSize: '17px', color: '#8D8D8D', fontFamily, fontWeight }}>
                      {telpon}
                    </span>
                  )}
                </Col>
              </Row>
            </Col>
            <Col span={2} push={2}>
              <Divider type="vertical" style={{ height: '100%', borderColor: 'grey' }} />
            </Col>
            <Col span={8} push={3}>
              <Row align="middle">
                <Col span={12}>
                  <img
                    src={'/sitmen.png'}
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
              {isEditing && (
                <Col>
                  <Row>
                    <Col>
                      <Upload
                        listType="picture"
                        beforeUpload={() => false}
                        // onChange={handleChange}
                      >
                        <Button
                          icon={<UploadOutlined />}
                          style={{
                            marginRight: '50px',
                            borderColor: 'black',
                            width: '150px',
                            marginTop: '20px',
                            marginLeft: '55px',
                            color: 'black',
                          }}
                        >
                          Unggah Foto
                        </Button>
                      </Upload>
                    </Col>
                  </Row>
                </Col>
              )}
            </Col>
            <Col push={17} style={{ marginTop: '40px', marginLeft: '40px' }}>
              <Row align="middle">
                <Col style={{ fontSize: '17px', fontFamily, fontWeight }}>
                  <Button
                    style={{
                      backgroundColor: '#582DD2',
                      color: 'white',
                      width: '200px',
                      height: '40px',
                      borderRadius: '10px',
                      display: isEditing ? 'none' : 'block',
                    }}
                    onClick={handleEditClick}
                  >
                    <a style={{ fontWeight, fontSize: '14px', marginRight: '20px' }}>
                      <EditOutlined style={{ marginRight: '20px' }} />
                      Edit Profile
                    </a>
                  </Button>
                </Col>
              </Row>
            </Col>
            {isEditing && (
              <>
                <Col push={15} style={{ marginTop: '40px' }}>
                  <Row align="middle">
                    <Col style={{ fontSize: '17px', fontFamily, fontWeight }}>
                      <Button
                        onClick={handleButtonClick}
                        style={{
                          backgroundColor: '#582DD2',
                          color: 'white',
                          width: '190px',
                          height: '45px',
                          borderRadius: '10px',
                        }}
                      >
                        <span style={{ fontWeight, fontSize: '14px', marginRight: '20px' }}>
                          <LockOutlined style={{ marginRight: '20px' }} />
                          Ubah Sandi
                        </span>
                      </Button>
                      <Modal
                        centered
                        visible={modalVisible}
                        onCancel={handleModalCancel}
                        footer={null}
                        width={400}
                        style={{ borderRadius: '10px', overflow: 'hidden' }}
                      >
                        <h1 style={{ fontSize: '20px', textAlign: 'center' }}>Ubah Sandi</h1>
                        <Form form={form} layout="vertical" style={{ marginTop: '40px' }}>
                          <Form.Item
                            name="oldPassword"
                            label="Masukkan Sandi Lama Anda"
                            rules={[{ required: true, message: 'Tolong isi sandi lama!' }]}
                            style={{ margin: '20px 20px 20px' }}
                          >
                            <Input
                              placeholder="Sandi Lama"
                              style={{ width: '100%', height: '40px' }}
                            />
                          </Form.Item>
                          <Form.Item
                            name="newPassword"
                            label="Masukkan Sandi Baru Anda"
                            rules={[{ required: true, message: 'Tolong isi sandi baru!' }]}
                            style={{ margin: '20px 20px 20px' }}
                          >
                            <Input
                              placeholder="Sandi Baru"
                              style={{ width: '100%', height: '40px' }}
                            />
                          </Form.Item>
                          <Form.Item
                            name="confirmNewPassword"
                            label="Konfirmasi Sandi Baru Anda"
                            rules={[{ required: true, message: 'Tolong konfirmasi sandi baru!' }]}
                            style={{ margin: '20px 20px 20px' }}
                          >
                            <Input
                              placeholder="Konfirmasi Sandi Baru"
                              style={{ width: '100%', height: '40px' }}
                            />
                          </Form.Item>
                          <Form.Item style={{ textAlign: 'right', marginRight: '20px' }}>
                            <Button
                              type="default"
                              onClick={handleModalCancel}
                              style={{
                                marginRight: '8px',
                                color: 'black',
                                borderColor: 'black',
                              }}
                            >
                              <span>Batal</span>
                            </Button>
                            <Button
                              type="primary"
                              htmlType="submit"
                              style={{
                                backgroundColor: '#582DD2',
                              }}
                            >
                              <span>Simpan</span>
                            </Button>
                          </Form.Item>
                        </Form>
                      </Modal>
                    </Col>
                  </Row>
                </Col>
                <Col push={15} style={{ marginTop: '40px' }}>
                  <Row align="middle">
                    <Col style={{ fontSize: '17px', fontFamily, fontWeight }}>
                      <Button
                        onClick={handleSave}
                        style={{
                          backgroundColor: '#582DD2',
                          color: 'white',
                          width: '190px',
                          height: '45px',
                          borderRadius: '10px',
                          marginLeft: '15px',
                        }}
                      >
                        <span style={{ fontWeight, fontSize: '14px', marginRight: '20px' }}>
                          <EditOutlined style={{ marginRight: '20px' }} />
                          Simpan
                        </span>
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </>
            )}
          </Row>
        </div>
      </Card>
      <div
        style={{ display: 'flex', justifyContent: 'flex-end', width: '80%' }}
        onClick={handleKembaliClick}
      >
        <Button
          style={{
            marginTop: '30px',
            backgroundColor: '#582DD2',
            color: 'white',
            width: '20%',
            height: '50px',
            borderRadius: '10px',
            display: isEditing ? 'block' : 'none',
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

export default Profile;
