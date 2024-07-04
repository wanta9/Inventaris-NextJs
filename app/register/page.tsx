"use client";

import React, { useState } from "react";
import { Button, Card, Form, Input, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
// import { useRouter } from "next/navigation";
import { akunRepository } from "#/repository/akun";
import Password from "antd/es/input/Password";

interface createAkun {
    namaPengguna: string;
    nisn: string;
    password: string;
    namaLengkap: string;
    kelas: string;
    telp: string;
    gambar: string;
  }

const Register = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    // const router = useRouter();
    const [createAkun, setcreateAkun] = useState<createAkun>({
    namaPengguna: '',
    nisn: '',
    password: '',
    namaLengkap: '',
    kelas: '',
    telp: '',
    gambar: '',
      });

    const onFinish = async (values: any) => {
        console.log('data values: ', values);
    try {
      setLoading(true);
      setError(null);
      const data = {
        namaPengguna: createAkun.namaPengguna,
        nisn: createAkun.nisn,
        password: createAkun.password,
        namaLengkap: createAkun.namaLengkap,
        kelas: createAkun.kelas,
        telp: createAkun.telp,
        gambar: createAkun.gambar,
      };

      const request = await akunRepository.api.login(data);
      if (request.status === 400) {
        setError(request.body.message); 
      } else {
        message.success('Register Berhasil!');
        // router.push('/login');
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
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Card  style={{ width: '25%', marginTop: '70px', height: '800px'}}>
                                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <img src="ikon.png" alt="logo" style={{ width: 100, marginTop: '-30px' }} />
                    <div style={{ fontSize: 18, fontWeight: 'bold' }}>PENDAFTARAN</div>
                </div>
                <Form layout={'vertical'} name="normal_login" onFinish={onFinish}>
                    <Form.Item
                        label="Nama Pengguna"
                        name="namapengguna"
                        rules={[{ required: true, message: 'Masukkan Nama yang benar!' }]}
                        style={{ marginLeft: '40px', marginBottom: '5px'}}
                        wrapperCol={{ span: 20 }}
                    >
                        <Input prefix={<UserOutlined />} type="text"                           
                        value={createAkun.namaPengguna}
                         onChange={(e) =>
                            setcreateAkun({ ...createAkun, namaPengguna: e.target.value })
                        }/>
                    </Form.Item>
                    <Form.Item
                        label="Sandi"
                        name="sandi"
                        rules={[{ required: true, message: 'Masukkan sandi!' }]}
                        style={{ marginLeft: '40px', marginBottom: '5px'}}
                        wrapperCol={{ span: 20 }}
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
                        style={{ marginLeft: '40px', marginBottom: '5px'}}
                        wrapperCol={{ span: 20 }}
                    >
                        <Input.Password prefix={<LockOutlined />} type="password" />
                    </Form.Item>
                    <Form.Item
                        label="NISN"
                        name="nisn"
                        rules={[{ required: true, type: 'string', message: 'Masukkan NISN yang benar!' }]}
                        style={{ marginLeft: '40px', marginBottom: '5px'}}
                        wrapperCol={{ span: 20 }}
                    >
                        <Input prefix={<img src="/icnnisn.svg" style={{ width: '19px', height: '19px' }} />} type="text"                       
                        value={createAkun.nisn}
                         onChange={(e) =>
                            setcreateAkun({ ...createAkun, nisn: e.target.value })
                        }/> 
                    </Form.Item>
                    <Form.Item
                        label="Nama Lengkap"
                        name="namalengkap"
                        rules={[{ required: true, type: 'string', message: 'Masukkan Nama Lengkap yang benar!' }]}
                        style={{ marginLeft: '40px', marginBottom: '5px'}}
                        wrapperCol={{ span: 20 }}
                    >
                    <Input prefix={<img src="/icnnamalengkap.svg" style={{ width: '19px', height: '19px' }} />} type="text"                           
                        value={createAkun.namaPengguna}
                         onChange={(e) =>
                            setcreateAkun({ ...createAkun, namaPengguna: e.target.value })
                        }/>
                    </Form.Item>
                    <Form.Item
                        label="Kelas"
                        name="kelas"
                        rules={[{ required: true, type: 'string', message: 'Masukkan Kelas yang benar!' }]}
                        style={{ marginLeft: '40px', marginBottom: '5px'}}
                        wrapperCol={{ span: 20 }}
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
                        style={{ marginLeft: '40px', marginBottom: '5px'}}
                        wrapperCol={{ span: 20 }}
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
                            style={{ background: '#582DD2', width: '329px', marginLeft: '40px', marginTop: '20px' }}
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
              <hr
                style={{ borderTop: '1px solid #ccc', width: '76%', marginLeft:'40px', padding: '0' }}
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
              sudah mempunyai akun?<a href="http://localhost:3002/login"> Log in</a>
            </div>
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
