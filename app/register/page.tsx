'use client';

import React, { useState } from 'react';
import { Button, Card, Col, Form, Input, Row, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { akunRepository } from '#/repository/akun';

export enum statusBarang {
  Aktif = 'aktif',
  TidakAktif = 'tidak aktif',
  Pending = 'pending',
  Diterima = 'diterima',
  Ditolak = 'ditolak',
}

interface createAkun {
  peranId: string;
  username: string;
  nomorInduk: string;
  password: string;
  nama: string;
  kelas: string;
  telp: string;
  gambar: string;
  status: statusBarang;
  isOnline: boolean;
  email: string;
}

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [createAkun, setcreateAkun] = useState<createAkun>({
    peranId: '4a114c02-5909-4f63-b88b-27ae49b701ac',
    username: '',
    nomorInduk: '',
    password: '',
    nama: '',
    kelas: '',
    telp: '',
    gambar: 'null',
    email: 'null',
    status: statusBarang.Pending,
    isOnline: true,
  });

  const onFinish = async (values: any) => {
    console.log('data values: ', values);
    try {
      setLoading(true);
      setError(null);
      const data = {
        username: createAkun.username,
        nomorInduk: createAkun.nomorInduk,
        password: createAkun.password,
        nama: createAkun.nama,
        kelas: createAkun.kelas,
        telp: createAkun.telp,
        gambar: createAkun.gambar,
        status: createAkun.status,
        peranId: createAkun.peranId,
        email: values.email,
      };

      const request = await akunRepository.api.akun(data);
      if (request.status === 400) {
        setError(request.body.message);
      } else {
        message.success('Register Berhasil!');
        router.push('/login');
      }
      console.log(request);
    } catch (error) {
      console.log(error);
      setError('Terjadi kesalahan pada server.');
      message.error('Terjadi kesalahan saat menyimpan data.');
      console.log();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <Row style={{ width: '100%' }} justify="center">
        <Col xs={24} sm={20} md={16} lg={12} xl={8}>
          <Card
            style={{
              width: '100%',
              maxWidth: 500, // Set maximum width for the card
              maxHeight: 1100,
              margin: 'auto', // Center the card horizontally
              padding: 20, // Add padding inside the card
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <img src="ikon.png" alt="logo" style={{ width: 100, marginTop: '-10px' }} />
              <div style={{ fontSize: 18, fontWeight: 'bold' }}>PENDAFTARAN</div>
            </div>
            <Form layout="vertical" name="normal_login" onFinish={onFinish}>
              <Form.Item
                label="Nama Pengguna"
                name="username"
                rules={[{ required: true, message: 'Masukkan Nama yang benar!' }]}
                style={{ marginTop: '40px', paddingLeft: '12px', paddingRight: '12px' }}
              >
                <Input
                  prefix={<UserOutlined style={{ marginLeft: '12px' }} />}
                  type="text"
                  style={{ height: '40px' }}
                  value={createAkun.username}
                  onChange={(e) => setcreateAkun({ ...createAkun, username: e.target.value })}
                />
              </Form.Item>
              <Form.Item
                label="Sandi"
                name="password"
                rules={[{ required: true, message: 'Masukkan sandi!' }]}
                style={{ paddingLeft: '12px', paddingRight: '12px' }}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ marginLeft: '12px' }} />}
                  type="text"
                  style={{ height: '40px' }}
                  value={createAkun.password}
                  onChange={(e) => setcreateAkun({ ...createAkun, password: e.target.value })}
                />
              </Form.Item>
              <Form.Item
                label="Konfirmasi Sandi"
                name="confirmPassword"
                style={{ paddingLeft: '12px', paddingRight: '12px' }}
                rules={[
                  { required: true, message: 'Masukkan konfirmasi sandi!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Sandi tidak cocok!'));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ marginLeft: '12px', height: '30px' }} />}
                  type="password"
                />
              </Form.Item>
              <Form.Item
                label="NISN"
                name="nomorInduk"
                rules={[{ required: true, type: 'string', message: 'Masukkan NISN yang benar!' }]}
                style={{ paddingLeft: '12px', paddingRight: '12px' }}
              >
                <Input
                  prefix={
                    <img
                      src="/icnnisn.svg"
                      style={{ width: '19px', height: '19px', marginLeft: '12px' }}
                    />
                  }
                  type="text"
                  style={{ height: '40px' }}
                  value={createAkun.nomorInduk}
                  onChange={(e) => setcreateAkun({ ...createAkun, nomorInduk: e.target.value })}
                />
              </Form.Item>
              <Form.Item
                label="Nama Lengkap"
                name="nama"
                rules={[
                  { required: true, type: 'string', message: 'Masukkan Nama Lengkap yang benar!' },
                ]}
                style={{ paddingLeft: '12px', paddingRight: '12px' }}
              >
                <Input
                  prefix={
                    <img
                      src="/icnnamalengkap.svg"
                      style={{ width: '19px', height: '19px', marginLeft: '12px' }}
                    />
                  }
                  type="text"
                  style={{ height: '40px' }}
                  value={createAkun.nama}
                  onChange={(e) => setcreateAkun({ ...createAkun, nama: e.target.value })}
                />
              </Form.Item>
              <Form.Item
                label="Kelas"
                name="kelas"
                rules={[{ required: true, type: 'string', message: 'Masukkan Kelas yang benar!' }]}
                style={{ paddingLeft: '12px', paddingRight: '12px' }}
              >
                <Input
                  prefix={
                    <img
                      src="/icnkelas.svg"
                      style={{ width: '19px', height: '19px', marginLeft: '12px' }}
                    />
                  }
                  type="text"
                  style={{ height: '40px' }}
                  value={createAkun.kelas}
                  onChange={(e) => setcreateAkun({ ...createAkun, kelas: e.target.value })}
                />
              </Form.Item>
              <Form.Item
                label="Nomer Telp"
                name="nomertelp"
                rules={[
                  { required: true, type: 'string', message: 'Masukkan Nomer Telp yang benar!' },
                ]}
                style={{ paddingLeft: '12px', paddingRight: '12px' }}
              >
                <Input
                  prefix={
                    <img
                      src="/icntelpon.svg"
                      style={{ width: '19px', height: '19px', marginLeft: '12px' }}
                    />
                  }
                  type="text"
                  style={{ height: '40px' }}
                  value={createAkun.telp}
                  onChange={(e) => setcreateAkun({ ...createAkun, telp: e.target.value })}
                />
              </Form.Item>
              <Form.Item style={{ paddingLeft: '12px', paddingRight: '12px' }}>
                <Button
                  type="primary"
                  block
                  loading={loading}
                  htmlType="submit"
                  style={{ backgroundColor: '#582DD2', height: '40px' }}
                >
                  Daftar
                </Button>
                <div
                  style={{
                    textAlign: 'center',
                    position: 'relative',
                    margin: '20px 0',
                    marginTop: '30px',
                  }}
                >
                  <hr style={{ borderTop: '1px solid #ccc' }} />
                  <span
                    style={{
                      backgroundColor: '#fff',
                      position: 'absolute',
                      top: '-10px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      padding: '0 10px',
                    }}
                  >
                    ATAU
                  </span>
                </div>
                <div style={{ textAlign: 'center', paddingTop: '5px' }}>
                  sudah mempunyai akun?<a href="http://localhost:3002/login"> Log in</a>
                </div>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
      <style>
        {`
                  body {
                      background-color: #582DD2;
                  }
              `}
      </style>
    </div>
  );
};

export default Register;
