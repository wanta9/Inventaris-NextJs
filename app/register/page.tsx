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
                        style={{width: 320,
                             textAlign: 'center',
                             margin:70,
                            }}
                        headStyle={{fontSize: 13, fontWeight: 200}}
                        className={"shadow"}
                        bordered={true}
                        title={'Sign in to your account'}
                    >
                        <Form
                            layout={'vertical'}
                            name="normal_login"
                            className="login-form"
                            onFinish={onFinish}
                        >
                            <Form.Item
                                label="Nama Pengguna"
                                name="namapengguna"                                // size={'large'}
                                rules={[{required: false, message: 'Masukin Nama yg bener!'}]}
                            >
                                <Input
                                    prefix={<UserOutlined className="site-form-item-icon"/>}
                                    type="text"/>
                            </Form.Item>

                            <Form.Item
                                style={{
                                    marginBottom: 0,
                                }}
                                label="Sandi"
                                name="sandi"
                                // size={'large'}
                            >
                                <Input.Password
                                    prefix={<LockOutlined className="site-form-item-icon"/>}
                                    type="password"
                                />
                            </Form.Item>

                            <Form.Item
                                style={{
                                    marginBottom: 0,
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
                                    marginBottom: 0,
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
                                    marginBottom: 0,
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
                                    marginBottom: 0,
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
                                    marginBottom: 0,
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
                                    marginTop: 0,
                                    marginBottom: 20,
                                    padding: 0
                                }}
                                // label="Password"
                                name="forgot-password"
                                // size={'small'}
                                rules={[{required: false, message: 'Please input your Password!'}]}
                            >
                                <a className="login-form-forgot" href="">
                                    Forgot password
                                </a>
                            </Form.Item>

                            <Form.Item
                                style={{
                                    marginBottom: 5,
                                    textAlign: 'left'
                                }}>
                                <Form.Item name="remember" valuePropName="checked" noStyle>
                                    <Checkbox>Remember me</Checkbox>
                                </Form.Item>
                            </Form.Item>

                            <Form.Item
                                style={{
                                    marginBottom: 0,
                                }}>
                                <Button type="primary"
                                        block
                                        loading={loading}
                                        htmlType="submit"
                                        size={'large'}
                                        onSubmit={enterLoading}
                                        className="login-form-button">
                                    Sign In
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
