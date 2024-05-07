"use client";

import React, {useState} from "react";
// import {observer} from 'mobx-react-lite';
import {Button, Card, Checkbox, Col, Form, Input, Row, Typography} from 'antd';
import {LockOutlined, UserOutlined} from '@ant-design/icons';
// import ParticlesLayout from "../components/Layout/ParticlesLayout";

const Login = () => {
    
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

    return <div style={{width: 'center', display: 'flex', justifyContent: 'center'}}>
        <Row justify={'center'}>
            <Col>
                <div style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    marginTop: '5vh',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                    <Card style={{ textAlign: "center",
                     }}>

                    <div style={{ display: "inline-block" }}>

                    <img src="ikon.png"
                    style={{ width: 100,
                        marginTop:0,
                     }}/>

                    </div>

                    <div style={{width: 400,
                            textAlign: 'center',
                            margin:0,
                            marginBottom: 30,
                            fontSize: 18, fontWeight: 200,
                    }}
                    >
                        <span style={{fontWeight: 'bold'}}>Selamat Datang</span>
                        </div>

                        <Form
                            layout={'vertical'}
                            name="normal_login"
                            className="login-form"
                            onFinish={onFinish}
                        >
                            <Form.Item
                                label="Nama Perngguna"
                                name="nama"
                                // size={'large'}
                                rules={[{required: false, message: 'Masukan nama yg bener!'}]}
                            >
                                <Input
                                    prefix={<UserOutlined className="site-form-item-icon"/>}
                                    type="text"/>
                            </Form.Item>

                            <Form.Item
                                style={{
                                    marginBottom: 17,
                                }}
                                label="Sandi"
                                name="sandi"
                                // size={'large'}
                                rules={[{required: false, message: 'masukkan sandi!'}]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined className="site-form-item-icon"/>}
                                    type="password"
                                />
                            </Form.Item>                    
                            <Form.Item
                                style={{
                                    marginBottom: 17,
                                }}>
                                <Button type="primary"
                                        block
                                        loading={loading}
                                        htmlType="submit"
                                        size={'large'}
                                        style={{background:'#582DD2'}}
                                        onSubmit={enterLoading}
                                        className="login-form-button">
                                    Masuk
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </div>
            </Col>
        </Row>
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
    </div>;
};

export default Login;
