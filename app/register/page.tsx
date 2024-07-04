"use client";

import React, { useState } from "react";
import { Button, Card, Form, Input, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useRouter } from "next/navigation";
import { akunRepository } from "#/repository/akun";

export enum statusBarang {
    Aktif = 'aktif',
    TidakAktif = 'tidak aktif',
    Pending = 'pending',
    Diterima = 'ditrima',
    Ditolak = 'ditolak',
  }

interface createAkun {
    peranId: string;
    username: string;
    nisn: string;
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
    nisn: '',
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
        nisn: createAkun.nisn,
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
      console.log()
    } finally {
      setLoading(false);
    }
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
                        name="username"
                        rules={[{ required: true, message: 'Masukkan Nama yang benar!' }]}
                    >
                        <Input prefix={<UserOutlined />} type="text"                           
                        value={createAkun.username}
                         onChange={(e) =>
                            setcreateAkun({ ...createAkun, username: e.target.value })
                        }/>
                    </Form.Item>
                    <Form.Item
                        label="Sandi"
                        name="sandi"
                        rules={[{ required: true, message: 'Masukkan sandi!' }]}
                    >
                        <Input.Password prefix={<LockOutlined />} type="text"                           
                        value={createAkun.password}
                         onChange={(e) =>
                            setcreateAkun({ ...createAkun, password: e.target.value })
                        }/>
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
                        rules={[{ required: true, type: 'string', message: 'Masukkan NISN yang benar!' }]}
                    >
                        <Input prefix={<img src="/icnnisn.svg" style={{ width: '19px', height: '19px' }} />} type="text"                       
                        value={createAkun.nisn}
                         onChange={(e) =>
                            setcreateAkun({ ...createAkun, nisn: e.target.value })
                        }/> 
                    </Form.Item>
                    <Form.Item
                        label="Nama Lengkap"
                        name="nama"
                        rules={[{ required: true, type: 'string', message: 'Masukkan Nama Lengkap yang benar!' }]}
                    >
                    <Input prefix={<img src="/icnnamalengkap.svg" style={{ width: '19px', height: '19px' }} />} type="text"                           
                        value={createAkun.nama}
                         onChange={(e) =>
                            setcreateAkun({ ...createAkun, nama: e.target.value })
                        }/>
                    </Form.Item>
                    <Form.Item
                        label="Kelas"
                        name="kelas"
                        rules={[{ required: true, type: 'string', message: 'Masukkan Kelas yang benar!' }]}
                    >
                        <Input prefix={<img src="/icnkelas.svg" style={{ width: '19px', height: '19px' }} />} type="text"                        
                        value={createAkun.kelas}
                         onChange={(e) =>
                            setcreateAkun({ ...createAkun, kelas: e.target.value })
                        }/>
                    </Form.Item>
                    <Form.Item
                        label="Nomer Telp"
                        name="nomertelp"
                        rules={[{ required: true, type: 'string', message: 'Masukkan Nomer Telp yang benar!' }]}
                    >
                        <Input prefix={<img src="/icntelpon.svg" style={{ width: '19px', height: '19px' }} />} type="text"                        
                        value={createAkun.telp}
                         onChange={(e) =>
                            setcreateAkun({ ...createAkun, telp: e.target.value })
                        }/>
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
