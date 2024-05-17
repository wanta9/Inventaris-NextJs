"use client";

import React, { useState } from "react";
import { Button, Card, Form, Input } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';

const Register = () => {
    const [loading, setLoading] = useState(false);

    const onFinish = (values: any) => {
        console.log('Received values of form: ', values);
        // Handle form submission here
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <Card style={{ width: '90%', maxWidth: 400, padding: 20 }}>
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                    <img src="ikon.png" alt="logo" style={{ width: 100 }} />
                    <div style={{ fontSize: 18, fontWeight: 'bold', marginTop: 10 }}>Pendaftaran</div>
                </div>
                <Form layout={'vertical'} name="normal_login" onFinish={onFinish}>
                    <Form.Item
                        label="Nama Pengguna"
                        name="namapengguna"
                        rules={[{ required: true, message: 'Masukkan Nama yang benar!' }]}
                    >
                        <Input prefix={<UserOutlined />} type="text" />
                    </Form.Item>
                    <Form.Item
                        label="Sandi"
                        name="sandi"
                        rules={[{ required: true, message: 'Masukkan sandi!' }]}
                    >
                        <Input.Password prefix={<LockOutlined />} type="password" />
                    </Form.Item>
                    <Form.Item
                        label="Konfirmasi Sandi"
                        name="konfirmasisandi"
                        rules={[{ required: true, message: 'Masukkan sandi yang benar!' }]}
                    >
                        <Input.Password prefix={<LockOutlined />} type="password" />
                    </Form.Item>
                    <Form.Item
                        label="NISN"
                        name="nisn"
                        rules={[{ type: 'integer', message: 'Masukkan NISN yang benar!' }]}
                    >
                        <Input prefix={<LockOutlined />} type="text" />
                    </Form.Item>
                    <Form.Item
                        label="Nama Lengkap"
                        name="namalengkap"
                    >
                        <Input prefix={<LockOutlined />} type="text" />
                    </Form.Item>
                    <Form.Item
                        label="Kelas"
                        name="kelas"
                    >
                        <Input prefix={<LockOutlined />} type="text" />
                    </Form.Item>
                    <Form.Item
                        label="Nomer Telp"
                        name="nomertelp"
                        rules={[{ type: 'integer', message: 'Masukkan nomor telepon yang benar!' }]}
                    >
                        <Input prefix={<LockOutlined />} type="text" />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            block
                            loading={loading}
                            htmlType="submit"
                            style={{ background: '#582DD2' }}
                        >
                            Daftar
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
            <div className="register-page">
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

export default Register;