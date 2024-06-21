'use client';

import React, { useState } from 'react';
import { Alert, Button, Card, Col, Form, Input, Row, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { title } from 'process';
import { akunRepository } from '#/repository/akun';
import { useRouter } from 'next/navigation';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const onFinish = async (values: any) => {
    console.log('Received values of form: ', values);
    try {
      setLoading(true);
      setError(null);
      const data = {
        username: values.username,
        password: values.password,
      };
      const request = await akunRepository.api.login(data);
      if (request.status === 400) {
        setError(request.body.message); // Set pesan error
      } else {
        localStorage.setItem('access_token', request.body.data);
        router.push('/dashboard');
      }
      console.log(request);
      // Handle form submission here
    } catch (error) {
      console.log(error);
      message.error('Terjadi kesalahan saat login.');
    } finally {
      setLoading(false);
    }

    // Handle form submission here
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
      <title>Login </title>
      <Card style={{ maxWidth: 400, width: '100%', padding: 20 }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <img src="ikon.png" alt="logo" style={{ width: 100 }} />
          <div style={{ fontSize: 18, fontWeight: 'bold', marginTop: 10 }}>Selamat Datang</div>
        </div>
        <Form layout={'vertical'} name="normal_login" onFinish={onFinish}>
          <Form.Item
            label="Nama Pengguna"
            name="username"
            rules={[{ required: true, message: 'Masukkan nama yang benar!' }]}
          >
            <Input prefix={<UserOutlined />} type="text" />
          </Form.Item>
          <Form.Item
            label="Sandi"
            name="password"
            rules={[{ required: true, message: 'Masukkan sandi!' }]}
          >
            <Input.Password prefix={<LockOutlined />} type="password" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              block
              loading={loading}
              htmlType="submit"
              style={{ background: '#582DD2' }}
            >
              Masuk
            </Button>
            <div
              style={{
                textAlign: 'center',
                position: 'relative',
                margin: '20px 0',
                marginTop: '30px',
              }}
            >
              <hr
                style={{ borderTop: '1px solid #ccc', width: '100%', margin: '0', padding: '0' }}
              />
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
              belum mempunyai akun?<a href="http://localhost:3002/register"> Daftar Sekarang</a>
            </div>
          </Form.Item>
        </Form>
      </Card>
      <div className="login-page">
        <style>
          {`
                    body {
                        background-color: #582DD2;
                    }
                `}
        </style>
        {/* Konten halaman login */}
      </div>
    </div>
  );
};

export default Login;
