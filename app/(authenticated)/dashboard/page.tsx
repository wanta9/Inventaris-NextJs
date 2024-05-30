'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Avatar,
  Card,
  Col,
  Row,
  Button,
  Modal,
  Input,
  Upload,
  message,
  Dropdown,
  Menu,
  Select,
} from 'antd';
import {
  PlusOutlined,
  UploadOutlined,
  UserOutlined,
  DownOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import Chart from 'chart.js/auto';
import type { UploadFile } from 'antd';
import { useRouter } from 'next/navigation';

const { Item } = Menu;
const { Option } = Select;

const Page = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [nama, setNama] = useState('');
  const [nip, setNIP] = useState('');
  const [telp, setTelp] = useState('');
  const [namaPengguna, setNamaPengguna] = useState('');
  const [sandi, setSandi] = useState('');
  const [konfirmasiSandi, setKonfirmasiSandi] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [selectedYear, setSelectedYear] = useState('thisYear');
  const [selectText, setSelectText] = useState('Tahun Ini');
  const allowedYears = ['2024', '2023', '2022'];
  const router = useRouter();
  // const chartRef = useRef<HTMLCanvasElement>(null);

  // tahun
  const handleChangeYear = (value: any) => {
    if (value === 'Tahun Ini') {
      setSelectText('Tahun Ini');
    } else {
      setSelectText(value);
    }
    setSelectedYear(value);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    router.push('/login');
  };

  // menu akun
  const menu = (
    <Menu>
      <Item key="1" onClick={() => logout()}>
        <a style={{ color: 'red' }} target="_blank" rel="noopener noreferrer">
          <ArrowLeftOutlined style={{ color: 'red', marginRight: '10px' }} />
          Keluar
        </a>
      </Item>
    </Menu>
  );
  const handleChangeUpload = (info: any) => {
    let fileList = [...info.fileList];

    // batas 1 file upload
    fileList = fileList.slice(-1);

    // Handle upload status
    fileList = fileList.map((file) => {
      if (file.response) {
        // Handle server response
        if (file.response.status === 'success') {
          file.url = file.response.url; // Set URL if upload is successful
        } else {
          // Show error message if upload fails
          message.error(`${file.name} upload failed: ${file.response.message}`);
          fileList = [];
        }
      }
      return file;
    });

    setFileList(fileList);
  };

  // handle untuk tombol open modal
  const handleButtonClick = () => {
    setModalVisible(true);
  };

  // handle untuk tombol tutup modal
  const handleModalCancel = () => {
    setModalVisible(false);
  };

  // handle simpan modal
  const handleSave = () => {
    // Logika untuk menyimpan data
    setModalVisible(false);
  };

  useEffect(() => {
    let config = {
      type: 'bar',
      label: '',
      data: {
        labels: [
          'Januari',
          'Februari',
          'Maret',
          'April',
          'Mei',
          'Juni',
          'Juli',
          'Agustus',
          'September',
          'Oktober',
          'November',
          'Desember',
        ],
        datasets: [
          {
            label: selectedYear,
            backgroundColor: [
              '#582DD2',
              '#582DD2',
              '#582DD2',
              '#582DD2',
              '#582DD2',
              '#582DD2',
              '#582DD2',
              '#582DD2',
              '#582DD2',
              '#582DD2',
              '#582DD2',
              '#582DD2',
            ],
            borderColor: [
              '#582DD2',
              '#582DD2',
              '#582DD2',
              '#582DD2',
              '#582DD2',
              '#582DD2',
              '#582DD2',
              '#582DD2',
              '#582DD2',
              '#582DD2',
              '#582DD2',
              '#582DD2',
            ],
            borderWidth: 1,
            data: [65, 59, 80, 81, 56, 55, 40, 30, 45, 20, 70, 100],
            fill: false,
            barThickness: 20,
            borderRadius: {
              topLeft: 10,
              topRight: 10,
            },
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        title: {
          display: false,
          text: 'Orders Chart',
        },
        tooltips: {
          mode: 'index',
          intersect: false,
        },
        hover: {
          mode: 'nearest',
          intersect: true,
        },
        legend: {
          labels: {
            fontColor: 'rgba(0,0,0,.4)',
          },
          align: 'end',
          position: 'bottom',
        },
        scales: {
          xAxes: [
            {
              display: false,
              scaleLabel: {
                display: true,
                labelString: 'Month',
              },
              gridLines: {
                borderDash: [2],
                borderDashOffset: [2],
                color: 'rgba(33, 37, 41, 0.3)',
                zeroLineColor: 'rgba(33, 37, 41, 0.3)',
                zeroLineBorderDash: [2],
                zeroLineBorderDashOffset: [2],
              },
            },
          ],
          yAxes: [
            {
              display: true,
              scaleLabel: {
                display: false,
                labelString: 'Value',
              },
              gridLines: {
                borderDash: [2],
                drawBorder: false,
                borderDashOffset: [2],
                color: 'rgba(33, 37, 41, 0.2)',
                zeroLineColor: 'rgba(33, 37, 41, 0.15)',
                zeroLineBorderDash: [2],
                zeroLineBorderDashOffset: [2],
              },
            },
          ],
        },
      },
    };
    let ctx = document.getElementById('bar-chart').getContext('2d');
    window.myBar = new Chart(ctx, config);
  }, []);

  return (
    <>
      <div>
        <title>Dashboard</title>
        <h1 style={{ fontSize: '25px', fontWeight: 'bold' }}>Dashboard</h1>
        <p style={{ paddingBottom: '20px' }}>Halo, Elisabet. Selamat Datang di Inventaris!</p>

        {/* Barang, Peminjam, Aktif */}

        <Row gutter={[40, 40]}>
          <Col>
            <Card
              className="shadow-card"
              style={{ width: '300px', height: '150px', display: 'flex', alignItems: 'center' }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src="ikon.png" style={{ width: '100px', marginRight: '10px' }} />
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold' }}>20</div>
                  <div>Barang</div>
                </div>
              </div>
            </Card>
          </Col>
          <Col style={{ marginLeft: '95px' }}>
            <Card
              className="shadow-card"
              style={{ width: '300px', height: '150px', display: 'flex', alignItems: 'center' }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src="ikon.png" style={{ width: '100px', marginRight: '10px' }} />
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold' }}>3</div>
                  <div>Peminjam</div>
                </div>
              </div>
            </Card>
          </Col>
          <Col style={{ marginLeft: '95px' }}>
            <Card
              className="shadow-card"
              style={{ width: '300px', height: '150px', display: 'flex', alignItems: 'center' }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src="ikon.png" style={{ width: '100px', marginRight: '10px' }} />
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold' }}>5</div>
                  <div>Aktif</div>
                </div>
              </div>
            </Card>
          </Col>
          {/* button Tambah akun petugas */}
          <Button
            type="primary"
            onClick={handleButtonClick}
            icon={<PlusOutlined />}
            style={{
              backgroundColor: 'white',
              color: 'black',
              marginTop: '90px',
              marginLeft: '110px',
              boxShadow: '0px 7px 10px rgba(0, 0, 0, 0.1)',
            }}
          >
            Akun Petugas
          </Button>
        </Row>

        {/* Pop up Tambah Akun Petugas */}

        <Modal
          title={<div style={{ fontSize: '20px', fontWeight: 'bold' }}>Buat Akun Petugas</div>}
          style={{ textAlign: 'center' }}
          width={900}
          centered
          visible={modalVisible}
          onCancel={handleModalCancel}
          footer={[
            <Button
              key="cancel"
              onClick={handleModalCancel}
              style={{ borderColor: 'black', color: 'black' }}
            >
              Batal
            </Button>,
            <Button
              style={{ backgroundColor: '#582DD2', color: 'white', marginRight: '27px' }}
              key="save"
              type="primary"
              onClick={handleSave}
            >
              Simpan
            </Button>,
          ]}
          maskStyle={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
          }}
        >
          <div style={{ marginTop: '70px', marginRight: '70px' }}>
            {' '}
            {/* Menambahkan margin atas */}
            <Row gutter={[24, 24]}>
              <Col span={12}>
                <Row align="middle">
                  <Col span={8}>
                    <p>Nama</p>
                  </Col>
                  <Col>
                    <Input
                      style={{ marginBottom: '12px', width: '250px', height: '40px' }}
                      placeholder="Nama"
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                    />
                  </Col>
                </Row>
                <Row align="middle">
                  <Col span={8}>
                    <p>NIP</p>
                  </Col>
                  <Col>
                    <Input
                      style={{ marginBottom: '12px', width: '250px', height: '40px' }}
                      type="string"
                      placeholder="NIP"
                      value={nip}
                      onChange={(e) => setNIP(e.target.value)}
                    />
                  </Col>
                </Row>
                <Row align="middle">
                  <Col span={8}>
                    <p>Telp</p>
                  </Col>
                  <Col>
                    <Input
                      style={{ marginBottom: '12px', width: '250px', height: '40px' }}
                      type="string"
                      placeholder="Telp"
                      value={telp}
                      onChange={(e) => setTelp(e.target.value)}
                      maxLength={12}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <p>Unggah Foto</p>
                  </Col>
                  <Col>
                    <Upload
                      action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                      listType="picture"
                      fileList={fileList}
                      onChange={handleChangeUpload}
                    >
                      <Button icon={<UploadOutlined />}>Unggah</Button>
                    </Upload>
                  </Col>
                </Row>
              </Col>
              <Col span={12}>
                <Row align="middle">
                  <Col span={8}>
                    <p>Nama Pengguna</p>
                  </Col>
                  <Col span={8}>
                    <Input
                      style={{ marginBottom: '12px', width: '300px', height: '40px' }}
                      placeholder="Nama Pengguna"
                      value={namaPengguna}
                      onChange={(e) => setNamaPengguna(e.target.value)}
                    />
                  </Col>
                </Row>
                <Row align="middle">
                  <Col span={8}>
                    <p>Sandi</p>
                  </Col>
                  <Col span={8}>
                    <Input.Password
                      style={{ marginBottom: '12px', width: '300px', height: '40px' }}
                      placeholder="Sandi"
                      value={sandi}
                      onChange={(e) => setSandi(e.target.value)}
                    />
                  </Col>
                </Row>
                <Row align="middle">
                  <Col span={8}>
                    <p>Konfirmasi Sandi</p>
                  </Col>
                  <Col span={8}>
                    <Input.Password
                      style={{ marginBottom: '12px', width: '300px', height: '40px' }}
                      placeholder="Konfirmasi Sandi"
                      value={konfirmasiSandi}
                      onChange={(e) => setKonfirmasiSandi(e.target.value)}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        </Modal>
      </div>
      ,
      <div>
        {/* Diagram Batang */}

        <Row>
          <Col flex="auto">
            <Card className="shadow-card" style={{ height: '500px', marginRight: '50px' }}>
              <h1 style={{ fontSize: '15px', color: '#A7A7A7', padding: '10px 15px' }}>
                Jumlah Peminjaman
              </h1>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                <Select
                  value={selectText}
                  onChange={handleChangeYear}
                  style={{ width: 120, right: '10px', bottom: '20px' }}
                  allowClear
                  placeholder={<span>Tahun Ini</span>}
                >
                  {allowedYears.map((year) => (
                    <Option key={year} value={year}>
                      {year}
                    </Option>
                  ))}
                </Select>
              </div>
              <div className="">
                <canvas id="bar-chart" style={{ height: '35vh' }}></canvas>
              </div>
            </Card>
          </Col>

          {/* Barang Masuk, Barang Keluar, Barang Rusak */}

          <Col>
            <Card
              className="shadow-card"
              style={{ width: '300px', height: '500px', padding: '50px 20px 0' }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src="ikon.png" style={{ width: '100px', marginRight: '10px' }} />
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold' }}>10</div>
                  <div style={{ color: 'grey' }}>Barang Masuk</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src="ikon.png" style={{ width: '100px', marginRight: '10px' }} />
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold' }}>4</div>
                  <div style={{ color: 'grey' }}>Barang Keluar</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src="ikon.png" style={{ width: '100px', marginRight: '10px' }} />
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold' }}>2</div>
                  <div style={{ color: 'grey' }}>Barang Rusak</div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Info Akun */}

        <div
          style={{
            position: 'absolute',
            top: '20px',
            right: '100px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Dropdown overlay={menu} placement="bottomCenter">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Button
                style={{
                  width: '175px',
                  height: '50px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img
                    src="ikon.png"
                    style={{ width: '70px', marginRight: '5px', marginLeft: '-10px' }}
                  />
                  <div>
                    <div style={{ fontSize: '12px', color: 'black', marginRight: '20px' }}>
                      Halo, Elisabet
                    </div>
                    <div style={{ fontSize: '12px', color: 'grey ', marginRight: '47px' }}>
                      Admin
                    </div>
                  </div>
                </div>
              </Button>
            </div>
          </Dropdown>
        </div>
      </div>
    </>
  );
};

export default Page;
