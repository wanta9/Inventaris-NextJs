"use client";

import { Button, Card, Row, Col } from 'antd';
import React from 'react';
import {  ArrowLeftOutlined } from '@ant-design/icons';

const detailpeminjaman = () => {
  return (
    <div style={{ marginLeft: '50px'}}>
      <title>Detail Peminjaman</title>
      <h1 style={{ fontSize: '25px', fontWeight: 'bold', marginTop: '70px'}}>Detai Peminjaman</h1>
      <Card style={{ marginTop: '30px',  boxShadow: '0px 7px 10px rgba(0, 0, 0, 0.1)', width: '50%'}}>
        <div>
            <Row>
                <Col>
        <Card className="shadow-card" style={{ width: '300px', height: '150px', display: 'flex', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <img src="kk.png" style={{ width: '100px', marginRight: '10px' }} />
                          <div>
                            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>Lorem Ipsum</div>
                            <div>RPL</div>
                            <Card style={{ width: '80px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <h4>7</h4>
                            </Card>
                          </div>
                        </div>
                      </Card>
                </Col>
                <Col>
                <Card className="shadow-card" style={{ width: '300px', height: '150px', display: 'flex', alignItems: 'center', stroke: '' }}>
                        <div>
                          Tgl Peminjaman 
                        </div>
                        <div>
                          Tgl Pengembalian 
                        </div>
                        <div>
                          Status
                        </div>
                      </Card>
                </Col>
            </Row>
        </div>
      </Card>
      </div>  
  );
}

export default detailpeminjaman;

