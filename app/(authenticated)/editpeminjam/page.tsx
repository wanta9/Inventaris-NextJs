'use client';

import { Button, Card, Col, Divider, Form, Input, Row, Select } from 'antd';
import React from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';

const { Option } = Select;

const EditPeminjam = () => {
  const rowStyle = { marginBottom: '25px' };
  const fontFamily = 'Barlow, sans-serif';
  const fontWeight = '500';

  const onFinish = (values: any) => {
    console.log('Form values:', values);
    // handle form submission, e.g., send data to the server
  };

  return (
    <div style={{ marginLeft: '50px', fontFamily }}>
      <title>Edit Peminjam</title>
      <h1 style={{ fontSize: '25px', fontWeight: 'bold', marginTop: '70px' }}>Edit Peminjam</h1>
      <Card
        style={{ marginTop: '50px', boxShadow: '0px 7px 10px rgba(0, 0, 0, 0.1)', width: '80%', borderRadius: '30px', height: '450px'}}
      >
        <div style={{ padding: '50px 50px 40px 80px', fontFamily }}>
          <Form layout="vertical" onFinish={onFinish}>
            <Row>
              <Col span={8} push={1} style={{ marginTop: '20px'}}>
                <Form.Item
                  label="Nama Lengkap"
                  name="namaLengkap"
                  initialValue="John Brown"
                  style={{ fontFamily, fontWeight }}
                >
                  <Input disabled />
                </Form.Item>
                <Form.Item
                  label="Nama Pengguna"
                  name="namaPengguna"
                  initialValue="Johnny"
                  style={{ fontFamily, fontWeight }}
                >
                  <Input disabled />
                </Form.Item>
                <Form.Item
                  label="Telp"
                  name="telp"
                  initialValue="123456789"
                  style={{ fontFamily, fontWeight }}
                >
                  <Input disabled />
                </Form.Item>
                <Form.Item
                  label="NISN"
                  name="nisn"
                  initialValue="1234567890"
                  style={{ fontFamily, fontWeight }}
                >
                  <Input disabled />
                </Form.Item>
                <Form.Item
                  label="Status"
                  name="status"
                  rules={[{ required: true, message: 'Please select a status!' }]}
                  style={{ fontFamily, fontWeight }}
                >
                  <Select
                    placeholder="Status"
                    allowClear
                    style={{ fontFamily, fontWeight }}
                  >
                    <Option value="diterima">Diterima</Option>
                    <Option value="ditolak">Ditolak</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8} push={5}>
                <Divider type="vertical" style={{ height: '100%', borderColor: 'grey'}} />
              </Col>
              <Col span={8}>
                <Row align="middle">
                  <Col span={12} >
                    <img src="sitmen.png" alt="gambar" style={{ width: '250px', height: 'auto', borderRadius: '100%', marginTop: '20px'}} />
                  </Col>
                </Row>
              </Col>
              <Col push={20} style={{ marginTop: '40px'}}>
                <Row align="middle">
                  <Col style={{ fontSize: '17px', fontFamily, fontWeight}}>
                    <Button type="primary" htmlType="submit" style={{ backgroundColor: '#582DD2', color: 'white', width: '200px', height: '35px', borderRadius: '10px'}}>
                      Simpan
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        </div>
      </Card>
      <div style={{ display: 'flex', justifyContent: 'flex-end', width: '80%' }}>
        <Button style={{ marginTop: '30px', backgroundColor: '#582DD2', color: 'white', width: '20%', height: '50px', borderRadius: '10px'}}>
          <a href="http://localhost:3002/peminjam" style={{ fontSize: '15px', marginRight: '20px', fontWeight}}>
            <ArrowLeftOutlined style={{ marginRight: '25px' }} />
            Kembali
          </a>
        </Button>
      </div>
    </div>
  );
};

export default EditPeminjam;
