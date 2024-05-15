"use client";

import React, { useState } from "react";
import { Button, Card, Col, Form, Input, Row } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';

const Login = () => {
    const [loading, setLoading] = useState(false);

    const onFinish = (values: any) => {
        console.log('Received values of form: ', values);
        // Handle form submission here
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <Card style={{ maxWidth: 400, width: '100%', padding: 20 }}>
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                    <img src="ikon.png" alt="logo" style={{ width: 100 }} />
                    <div style={{ fontSize: 18, fontWeight: 'bold', marginTop: 10 }}>Selamat Datang</div>
                </div>
                <Form layout={'vertical'} name="normal_login" onFinish={onFinish}>
                    <Form.Item
                        label="Nama Pengguna"
                        name="nama"
                        rules={[{ required: true, message: 'Masukkan nama yang benar!' }]}
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
