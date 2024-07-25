'use client';

import { Button, Card, Col, Divider, Form, Input, message, Modal, Row, Select, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import { ArrowLeftOutlined, EditOutlined, LockOutlined, UploadOutlined } from '@ant-design/icons';
import { useParams, useRouter } from 'next/navigation';
import { petugasRepository } from '#/repository/petugas';
// import { parseJwt } from '#/utils/parseJwt';
import { request } from 'http';
import { akunRepository } from '#/repository/akun';

const { Option } = Select;

interface updatePassword {
  id: string;
  sandi: string;
  newPassword: string;
  confirmNewPassword: string; // Tambahkan properti ini
}
interface updatePetugas {
  id: string;
  username: string;
  nama: string;
  nomorInduk: string;
  telp: string;
    // gambar: string;
}

interface Item {
  id: string;
  username: string;
  telp: string;
  nomorInduk: string;
}  

const Profile = () => {
  const fontFamily = 'Barlow, sans-serif';
  const [error, setError] = useState<string | null>(null);
  const [id, setId] = useState('');
  const [loading, setLoading] = useState(false);
  const fontWeight = '500';
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [namaLengkap, setNamaLengkap] = useState('');
  const [namaPengguna, setNamaPengguna] = useState('');
  const [nomorInduk, setNomorInduk] = useState('');
  const [telpon, setTelpon] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const {data: akun } = akunRepository.hooks.useAuth();
  console.log(akun, 'ini akun');
  const [updatePetugas, setupdatePetugas] = useState<updatePetugas>({
    id: '',
    username: '',
    nama: '',
    nomorInduk: '',
    telp: '',
    // gambar: '',
  });
  const [updatePassword, setupdatePassword] = useState<updatePassword>({
    id: '',
    sandi: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  

 const handleEditClick = () => {
     setIsEditing(true);
  };

  const onFinish = async (id: string) => {
    console.log('data id: ', id);
    try {
      setLoading(true);
      setError(null);
      const data = {
        username: updatePetugas.username,
        nama: updatePetugas.nama,
        telp: updatePetugas.telp,
        // gambar:  updatePetugas.gambar,
      };
      const request = await akunRepository.api.updateAkun(id, data);
      if (request.status === 400) {
        setError(request.body.message); // Set pesan error
      } else {
        message.success('Berhasil Mengedit Petugas!');
      // Update state with the new values
      setNamaLengkap(updatePetugas.nama);
      setNamaPengguna(updatePetugas.username);
      setTelpon(updatePetugas.telp);
      // Optionally, reset `updatePetugas` state to its initial state if needed
      setIsEditing(false);  
      }  
      console.log(request);
    } catch (error) {
      console.log(error);
      setError('Terjadi kesalahan pada server.');
      message.error('Gagal Mengedit Petugas!');
      console.log();
    } finally {
      setLoading(false);
    }
  }
  const onFinishPassword = async (values: any) => {
    try {
      setLoading(true);
      setError(null);
      const data = {
        // sandi,
        // newPassword,
      };
      const request = await akunRepository.api.updateAkun(id, data);
      if (request.status === 400) {
        setError(request.body.message); // Set pesan error
      } else {
        message.success('Berhasil Mengubah Sandi!');
        setModalVisible(false);
      }  
      console.log(request);
    } catch (error) {
      console.log(error);
      setError('Terjadi kesalahan pada server.');
      message.error('Gagal Mengubah Sandi!');
      console.log();
    } finally {
      setLoading(false);
    }
  };
  
  const handleEdit = (record: updatePetugas) => {
    console.log('record: ', record);
    setId(record.id);
    setupdatePetugas({
      id: record.id,
      username: record.username,
      nama: record.nama,
      nomorInduk: record.nomorInduk,
      telp: record.telp,
    });
    setIsEditing(true);
    form.setFieldsValue({
      username: record.username,
      nama: record.nama,
      nip: akun?.data?.petugas?.NIP,
      telp: record.telp,
    });
  };
          
  
  // const handleChange = async (args: any) => {
  //   const file = args.file;

  //   try {
  //     const createBarang = { file };
  //     const processUpload = await akunRepository.api.updateAkun(file);
  //     setupdatePetugas((createBarang) => ({
  //       ...createBarang,
  //       gambar: processUpload?.body?.data?.filename,
  //     }));
  //     console.log(processUpload, 'create');
  //     message.success('Gambar Berhasil Di Unggah!');
  //   } catch (e) {
  //     console.log(e, 'ini catch e');
  //     // setTimeout(message.eror("Gambar Gagal Di Unggah"))
  //   }
  // };

  const handleModalCancel = () => {
    setModalVisible(false);
    // setModalEditVisible(false);
    
  };

  const handleButtonClick = () => {
    setModalVisible(true);
  };

  // const

  const handleKembaliClick = () => {
    setIsEditing(false);
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
              <Form
                form={form}
                layout="horizontal"
                onFinish={() => onFinish(id)}
                >
                <Form.Item
                  label="Nama Lengkap"
                  name="nama"
                  wrapperCol={{ offset: 7,span: 16 }}
                  style={{ marginTop: '20px', fontFamily, fontWeight: 'bold', color: '#8D8D8D' }}
                >
                  {isEditing ? (
                    <Input
                      value={updatePetugas.nama}
                      onChange={(e) => setupdatePetugas({ ...updatePetugas, nama: e.target.value })}
                      style={{ fontSize: '15px', color: '#8D8D8D', fontFamily, fontWeight, width: '25vh', marginLeft: '5px', height: '40px' }}
                    />
                  ) : (
                    <span style={{ fontSize: '17px', color: '#8D8D8D', fontFamily, fontWeight, marginLeft: '10px' }}>
                      {akun?.data?.nama}
                    </span>
                  )}
                </Form.Item>

                <Form.Item
                  label="Nama Pengguna"
                  name="username"
                  wrapperCol={{ offset: 7,span: 16 }}
                  style={{ marginTop: '20px', fontFamily, fontWeight: 'bold', color: '#8D8D8D' }}
                >
                  {isEditing ? (
                    <Input
                      value={updatePetugas.username}
                      onChange={(e) => setupdatePetugas({ ...updatePetugas, username: e.target.value })}
                      style={{  color: '#8D8D8D', fontFamily, fontWeight, width: '25vh', height: '40px'  }}
                    />
                  ) : (
                    <span style={{ fontSize: '17px', color: '#8D8D8D', fontFamily, fontWeight, marginLeft: '-2px' }}>
                      {akun?.data?.username}
                    </span>
                  )}
                </Form.Item>

                <Form.Item
                  label="NIP"
                  name="nip"
                  wrapperCol={{ offset: 11,span: 16 }}
                  style={{  fontFamily, fontWeight: 'bold', color: '#8D8D8D' }}
                >
                  {isEditing ? (
                    <Input
                      disabled
                      style={{ fontSize: '17px', color: '#8D8D8D', fontFamily, fontWeight, width: '25vh', height: '40px'  }}
                    />
                  ) : (
                    <span style={{ fontSize: '17px', color: '#8D8D8D', fontFamily, fontWeight }}>
                      {akun?.data?.petugas?.NIP}
                    </span>
                  )}
                </Form.Item>

                <Form.Item
                  label="Telpon"
                  name="telp"
                  wrapperCol={{ offset: 10,span: 16 }}
                  style={{ fontFamily, fontWeight: 'bold', color: '#8D8D8D' }}
                >
                  {isEditing ? (
                    <Input
                      value={updatePetugas.telp}
                      onChange={(e) => setupdatePetugas({ ...updatePetugas, telp: e.target.value })}
                      style={{ fontSize: '17px', color: '#8D8D8D', fontFamily, fontWeight, width: '25vh', height: '40px'  }}
                    />
                  ) : (
                    <span style={{ fontSize: '17px', color: '#8D8D8D', fontFamily, fontWeight, marginLeft: '2px' }}>
                      {akun?.data?.telp}
                    </span>
                  )}
                </Form.Item>
                {isEditing && ( // Only render this block if `isEditing` is true
                    <Form.Item>
                      <Row align="middle">
                        <Col style={{ fontSize: '17px', fontFamily, fontWeight }}>
                          <Button
                            key="save"
                            type="primary"
                            htmlType="submit"
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
                    </Form.Item>
                  )}
              </Form>
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
                  {/* {isEditing && (
                    <Col>
                      <Row>
                        <Col>
                          <Upload
                            listType="picture"
                            beforeUpload={() => false}
                            onChange={handleChange}
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
                  )} */}
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
                        onClick={() => handleEdit({
                          id: akun?.data?.id,
                          username: akun?.data?.username,
                          nama: akun?.data?.nama,
                          nomorInduk: akun?.data?.nomorInduk,
                          telp: akun?.data?.telp
                        })}
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
                            <Form form={form} layout="vertical" style={{ marginTop: '40px' }} onFinish={onFinishPassword}>
                              <Form.Item
                                name="Password"
                                label="Masukkan Sandi Lama Anda"
                                rules={[{ required: true, message: 'Tolong isi sandi lama!' }]}
                                style={{ margin: '20px 20px 20px' }}
                              >
                                <Input
                                  placeholder="Sandi Lama"
                                  style={{ width: '100%', height: '40px' }}
                                  value={updatePassword.sandi}
                                  onChange={(e) => setupdatePassword({ ...updatePassword, sandi: e.target.value })}
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
                                  type="password"
                                  value={updatePassword.newPassword}
                                  onChange={(e) => setupdatePassword({ ...updatePassword, newPassword: e.target.value })}
                                />
                              </Form.Item>

                              <Form.Item
                                name="confirmNewPassword"
                                label="Konfirmasi Sandi Baru Anda"
                                rules={[
                                  { required: true, message: 'Tolong konfirmasi sandi baru!' },
                                  ({ getFieldValue }) => ({
                                    validator(_, value) {
                                      if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve();
                                      }
                                      return Promise.reject(new Error('Sandi tidak cocok!'));
                                    },
                                  }),
                                ]}
                                style={{ margin: '20px 20px 20px' }}
                              >
                                <Input
                                  placeholder="Konfirmasi Sandi Baru"
                                  style={{ width: '100%', height: '40px' }}
                                  type="password"
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
