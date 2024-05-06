"use client";

import React, {useState} from "react";
// import {observer} from 'mobx-react-lite';
import {Button, Card, Checkbox, Col, Form, Input, Row, Typography} from 'antd';
import {LockOutlined, UserOutlined} from '@ant-design/icons';
// import ParticlesLayout from "../components/Layout/ParticlesLayout";

const Register = () => {
    // const store = useStore();
    const [loading, setLoading] = useState(false);

    // let history = useHistory();
    const onFinish = (values: any) => {
        console.log('Received values of form: ', values);
        enterLoading(values).then(res => {
            console.log(res, "awasaa");
        }).catch((error) => {
            console.log({error}, "awasaa error");
        });
    };

    const enterLoading = async (props: any) => {
        // store.setInitialToken("ayayay", "clap");
        // return history.push("/app/page_example_1");
    };

    return <div style={{width: '100vw', display: 'flex', justifyContent: 'center'}}>
        <Row justify={'center'}>
            <Col>
                <div style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    marginTop: '5vh',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'stretch'}}>

                    </div>
                    <Card
                        style={{width: 400,
                             textAlign: 'center',
                             margin:20,
                            }}
                        headStyle={{font: 'bold', fontSize: 18, fontWeight: 200}}
                        bordered={true}
                        title={'PENDAFTARAN'}
                    >
                        <Form
                            layout={'vertical'}
                            name="normal_login"
                            className="login-form"
                            onFinish={onFinish}
                        >
                            <Form.Item
                                style={{
                                    width: 280,
                                    margin: 'auto', 
                                }}
                                label="Nama Pengguna"
                                name="namapengguna"                               
                                rules={[{required: false, message: 'Masukkan Nama yang benar!'}]}
                            >
                                <style>
                                    background-color: #582DD2;
                                </style>
                                <Input
                                    prefix={<UserOutlined className="site-form-item-icon"/>}
                                    type="text"/>
                            </Form.Item>

                            <Form.Item
                                style={{
                                    width: 280,
                                    margin: 'auto', 
                                }}
                                label="Sandi"
                                name="sandi"
                            >
                                <Input.Password
                                    prefix={<LockOutlined className="site-form-item-icon"/>}
                                    type="password"
                                />
                            </Form.Item>

                            <Form.Item
                                style={{
                                    width: 280,
                                    margin: 'auto', 
                                }}
                                label="Konfirmasi Sandi"
                                name="konfirmasisandi"
                                // size={'large'}
                                rules={[{required: false, message: 'Masukkan sandi yg benar!'}]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined className="site-form-item-icon"/>}
                                    type="password"
                                />
                            </Form.Item>

                            <Form.Item
                                style={{
                                    width: 280,
                                    margin: 'auto', 
                                }}
                                label="NISN"
                                name="nisn"
                                // size={'large'}
                            >
                                <Input
                                    prefix={<LockOutlined className="site-form-item-icon"/>}
                                    type="integer"
                                />
                            </Form.Item>

                            <Form.Item
                                style={{
                                    width: 280,
                                    margin: 'auto', 
                                }}
                                label="Nama Lengkap"
                                name="nama lengkap"
                                // size={'large'}
                                rules={[{required: false, message: 'nama lu siapa??!!'}]}
                            >
                                <Input
                                    prefix={<LockOutlined className="site-form-item-icon"/>}
                                    type="string"
                                />
                            </Form.Item>

                            <Form.Item
                                style={{
                                    width: 280,
                                    margin: 'auto', 
                                }}
                                label="Kelas"
                                name="kelas"
                                // size={'large'}
                                rules={[{required: false, message: 'Anak kelas mana lu !'}]}
                            >
                                <Input
                                    prefix={<LockOutlined className="site-form-item-icon"/>}
                                    type="string"
                                />
                            </Form.Item>

                            <Form.Item
                                style={{
                                    width: 280,
                                    margin: 'auto',
                                    marginBottom: 17, 
                                }}
                                label="Nomer Telp"
                                name="nomertelp"
                                // size={'large'}
                                rules={[{required: false, message: 'Maukkan Nomor yg benar!'}]}
                            >
                                <Input
                                    prefix={<LockOutlined className="site-form-item-icon"/>}
                                    type="integer"
                                />
                            </Form.Item>

                            <Form.Item
                                style={{
                                    width: 280,
                                    margin: 'auto', 
                                }}>
                                <Button type="primary"
                                        block
                                        loading={loading}
                                        htmlType="submit"
                                        size={'large'}
                                        onSubmit={enterLoading}
                                        style={{background:'#582DD2'}}
                                        className="register-form-button">
                                    Daftar
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </div>
            </Col>
        </Row>

    </div>;
};

export default Register;
