'use client';

import { Button, Card, Col, Divider, Row} from 'antd';
import React from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Option } from 'antd/es/mentions';
import { Select } from 'antd/lib';

const editpeminjam = () => {
  const rowStyle = { marginBottom: '25px' };
  const fontFamily = 'Barlow, sans-serif';
  const fontWeight = '500';
  return (
    <div style={{ marginLeft: '50px', fontFamily }}>
      <title>Barang Masuk</title>
      <h1 style={{ fontSize: '25px', fontWeight: 'bold', marginTop: '30px' }}>Detail Barang Masuk</h1>
      <Card style={{ width: '80%', marginTop: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: '70%', height: '300px', backgroundColor: '#D9D9D9', borderRadius: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img src="kk.png" alt="gambar" style={{ width: '70%' }} />
        </div>
      </Card>
      <div style={{ display: 'flex', justifyContent: 'flex-end', width: '90%' }}>
        <Button style={{ marginTop: '30px', backgroundColor: '#582DD2', color: 'white', width: '20%', height: '50px', borderRadius: '10px'}}>
          <a href="http://localhost:3001/barangmasuk" style={{ fontSize: '15px', marginRight: '20px', fontWeight}}>
            <ArrowLeftOutlined style={{ marginRight: '25px' }} />
            Kembali
          </a>
        </Button>
      </div>
    </div>
  );
};

export default editpeminjam;
