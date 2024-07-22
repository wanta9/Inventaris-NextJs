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
  Form,
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
import { akunRepository } from '#/repository/akun';
import { barangRepository } from '#/repository/barang';
import { peminjamRepository } from '#/repository/peminjam';
import { barangRusakRepository } from '#/repository/barangrusak';
import { barangMasukRepository } from '#/repository/barangmasuk';
import { barangKeluarRepository } from '#/repository/barangkeluar';
import { parseCookies } from 'nookies';
import { dashboardRepository } from '#/repository/dashboard';

const { Item } = Menu;
const { Option } = Select;

interface DataType {
  id: React.Key;
  name: string;
  username: string;
  telp: string;
  nip: string;
}

const Page = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [editData, setEditData] = useState<DataType | null>(null);
  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [count, setCount] = useState(0);
  const [nama, setNama] = useState('');
  const [nip, setNIP] = useState('');
  const [telp, setTelp] = useState('');
  const [namaPengguna, setNamaPengguna] = useState('');
  const [sandi, setSandi] = useState('');
  const [konfirmasiSandi, setKonfirmasiSandi] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [selectedYear, setSelectedYear] = useState('thisYear');
  const [selectText, setSelectText] = useState('Tahun Ini');
  // State untuk menyimpan status online dalam bentuk angka
  const [jumlahAktif, setJumlahAktif] = useState(0);
  const allowedYears = ['2024', '2023', '2022'];
  const router = useRouter();
  const [form] = Form.useForm();
  const fontFamily = 'Barlow, sans-serif';
  const fontWeight = '650';
  const { data: akun } = akunRepository.hooks.useAuth();
  console.log(akun, 'akun');
  const { data: Dashboard } = dashboardRepository.hooks.useDashboard();
  console.log('dashboard :', Dashboard);
  const role = akun?.data?.peran?.Role;


  useEffect(() => {
    if (akun) {
      // Jika akun adalah array, hitung jumlah akun yang aktif
      if (Array.isArray(akun)) {
        const aktifCount = akun.filter((item) => item.isOnline).length;
        setJumlahAktif(aktifCount);
      } else {
        // Jika akun adalah objek tunggal, cek status isOnline
        setJumlahAktif(akun.isOnline ? 1 : 0);
      }
    }
  }, [akun]);

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

  const profile = () => {
    router.push('/profile');
  };

  // menu akun
  const menu = (
    <Menu>
      {role === 'petugas' && (
        <Item key="1" onClick={() => profile()}>
          <a style={{ color: 'black' }} target="_blank" rel="noopener noreferrer">
            <UserOutlined style={{ color: 'black', marginRight: '10px' }} />
            Profile
          </a>
        </Item>
      )}
      {role === 'peminjam' && (
        <Item key="1" onClick={() => profile()}>
          <a style={{ color: 'black' }} target="_blank" rel="noopener noreferrer">
            <UserOutlined style={{ color: 'black', marginRight: '10px' }} />
            Profile
          </a>
        </Item>
      )}
      <Item key="2" onClick={() => logout()}>
        <a style={{ color: 'red' }} target="_blank" rel="noopener noreferrer">
          <ArrowLeftOutlined style={{ color: 'red', marginRight: '10px' }} />
          Keluar
        </a>
      </Item>
    </Menu>
  );

  const handleSaveModalData = () => {
    // Validasi input kosong
    form
      .validateFields()
      .then((values) => {
        // Jika semua field tervalidasi
        if (editData) {
          // Jika dalam mode edit, update data yang ada
          const newData = dataSource.map((item) =>
            item.id === editData.id
              ? {
                  ...item,
                  name: values.nama,
                  username: values.namaPengguna,
                  telp: values.telp,
                  nip: values.nip,
                }
              : item
          );
          setDataSource(newData);
          setEditData(null);
          setModalEditVisible(false);
        } else {
          // Jika tidak dalam mode edit, tambahkan data baru
          const newData = {
            id: count.toString(),
            name: values.nama,
            username: values.namaPengguna,
            telp: values.telp,
            nip: values.nip,
          };
          setDataSource([...dataSource, newData]);
          setCount(count + 1);
          setModalVisible(false);
        }
        // Reset form setelah penyimpanan berhasil
        form.resetFields();
      })
      .catch((error) => {
        // Menampilkan pesan error jika ada validasi yang gagal
        console.error('Validation failed:', error);
      });
  };

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
    form.resetFields();
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
    if (window.myBar) {
      window.myBar.destroy();
    }
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

        <Row gutter={[16, 16]} justify="start" align="middle">
          <Col xs={24} sm={12} md={8} lg={6} style={{ display: 'flex', justifyContent: 'center' }}>
            <Card
              style={{
                width: '100%',
                maxWidth: '300px', // Batas maksimum lebar card
                height: '150px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div
                  style={{
                    width: '60px', // Menyesuaikan ukuran icon
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: '#F5DEB3',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '10px', // Menyesuaikan jarak antara icon dan teks
                  }}
                >
                  <img src="/dshbarang.svg" alt="Barang Icon" style={{ width: '50%', height: '50%' }} />
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', fontFamily: 'Arial, sans-serif' }}>
                    {Dashboard?.totalBarang || '0'}
                  </div>
                  <div style={{ fontFamily: 'Arial, sans-serif', color: 'grey' }}>Barang</div>
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={8} lg={6} style={{ display: 'flex', justifyContent: 'center' }}>
            <Card
              className="shadow-card"
              style={{
                width: '100%',
                maxWidth: '300px', // Batas maksimum lebar card
                height: '150px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div
                  style={{
                    width: '60px', // Menyesuaikan ukuran icon
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: '#fff0e0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '10px', // Menyesuaikan jarak antara icon dan teks
                  }}
                >
                  <img src="/dshpeminjam.svg" alt="Peminjam Icon" style={{ width: '50%', height: '50%' }} />
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', fontFamily: 'Arial, sans-serif' }}>
                    {Dashboard?.totalAkunPeminjam || '0'}
                  </div>
                  <div style={{ fontFamily: 'Arial, sans-serif', color: 'grey' }}>Peminjam</div>
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={8} lg={6} style={{ display: 'flex', justifyContent: 'center' }}>
            <Card
              className="shadow-card"
              style={{
                width: '100%',
                maxWidth: '300px', // Batas maksimum lebar card
                height: '150px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div
                  style={{
                    width: '60px', // Menyesuaikan ukuran icon
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: '#e0f7e9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '10px', // Menyesuaikan jarak antara icon dan teks
                  }}
                >
                  <img src="/dshaktif.svg" alt="Aktif Icon" style={{ width: '50%', height: '50%' }} />
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', fontFamily: 'Arial, sans-serif' }}>
                    {Dashboard?.totalAkunAktif || '0'}
                  </div>
                  <div style={{ fontFamily: 'Arial, sans-serif', color: 'grey' }}>Aktif</div>
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={8} lg={6} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Button
              type="primary"
              onClick={handleButtonClick}
              icon={<PlusOutlined style={{ marginTop: '5px' }} />}
              style={{
                width: '200px',
                height: '40px',
                backgroundColor: 'white',
                boxShadow: '0px 7px 10px rgba(0, 0, 0, 0.1)',
                color: 'black',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              className="custom-button"
            >
              <span style={{ marginLeft: '5px' }}>Akun Petugas</span>
            </Button>
          </Col>
        </Row>

        <Modal
          title={
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
              Buat Akun Petugas
            </div>
          }
          style={{ textAlign: 'center' }}
          centered
          width={1000}
          visible={modalVisible}
          onCancel={handleModalCancel}
          footer={null}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSaveModalData}
            initialValues={{
              nama: '',
              nip: '',
              telp: '',
              namaPengguna: '',
              sandi: '',
              konfirmasiSandi: '',
            }}
            >
            <Row gutter={[24, 24]} justify="center">
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Nama"
                  name="nama"
                  rules={[{ required: true, message: 'Nama harus diisi' }]}
                  labelCol={{ span: 8 }} // Lebar label
                  wrapperCol={{ span: 18 }} // Lebar input
                >
                  <Input
                    style={{ width: '100%', height: '45px' }}
                    placeholder="Nama"
                    onChange={(e) => setNama(e.target.value)}
                  />
                </Form.Item>
                <Form.Item
                  label="NIP"
                  name="nip"
                  rules={[{ required: true, message: 'NIP harus diisi' }]}
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 18 }}
                >
                  <Input
                    style={{ width: '100%', height: '45px' }}
                    placeholder="NIP"
                    onChange={(e) => setNIP(e.target.value)}
                  />
                </Form.Item>
                <Form.Item
                  label="Telp"
                  name="telp"
                  rules={[{ required: true, message: 'Telp harus diisi' }]}
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 18 }}
                >
                  <Input
                    style={{ width: '100%', height: '45px' }}
                    placeholder="Telp"
                    onChange={(e) => setTelp(e.target.value)}
                    maxLength={12}
                  />
                </Form.Item>
                <Form.Item
                  label="Unggah Foto"
                  name="foto"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 18 }}
                >
                  <Upload listType="picture" beforeUpload={() => false}>
                    <Button icon={<UploadOutlined />}>Unggah</Button>
                  </Upload>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Nama Pengguna"
                  name="namaPengguna"
                  rules={[{ required: true, message: 'Nama Pengguna harus diisi' }]}
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 18 }}
                >
                  <Input
                    style={{ width: '100%', height: '45px' }}
                    placeholder="Nama Pengguna"
                    onChange={(e) => setNamaPengguna(e.target.value)}
                  />
                </Form.Item>
                <Form.Item
                  label="Sandi"
                  name="sandi"
                  rules={[{ required: true, message: 'Sandi harus diisi' }]}
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 18 }}
                >
                  <Input.Password
                    style={{ width: '100%', height: '45px' }}
                    placeholder="Sandi"
                    onChange={(e) => setSandi(e.target.value)}
                  />
                </Form.Item>
                <Form.Item
                  label="Konfirmasi Sandi"
                  name="konfirmasiSandi"
                  rules={[
                    { required: true, message: 'Konfirmasi Sandi harus diisi' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('sandi') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Sandi tidak cocok.'));
                      },
                    }),
                  ]}
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 18 }}
                >
                  <Input.Password
                    style={{ width: '100%', height: '45px' }}
                    placeholder="Konfirmasi Sandi"
                    onChange={(e) => setKonfirmasiSandi(e.target.value)}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item style={{ textAlign: 'right' }}>
              <Button
                key="cancel"
                onClick={handleModalCancel}
                style={{
                  width: '100px',
                  height: '35px',
                  backgroundColor: 'white',
                  borderColor: 'black',
                  color: 'black',
                  marginRight: '10px',
                }}
              >
                Batal
              </Button>
              <Button
                key="save"
                type="primary"
                htmlType="submit"
                style={{
                  width: '100px',
                  height: '35px',
                  backgroundColor: '#582DD2',
                  color: 'white',
                  borderColor: '#582DD2',
                }}
              >
                Simpan
              </Button>
            </Form.Item>
          </Form>
        </Modal>

    <Row gutter={[40, 40]} justify="center" style={{ marginTop: '40px' }}>
      <Col xs={24} md={16} lg={12}>
        <Card className="shadow-card" style={{ height: '550px' }}>
          <h1 style={{ fontSize: '15px', color: '#A7A7A7', padding: '10px 15px' }}>Jumlah Peminjaman</h1>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
            <Select
              value={selectText}
              onChange={handleChangeYear}
              style={{ width: 120 }}
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
          <div>
            <canvas id="bar-chart" style={{ height: '35vh' }}></canvas>
          </div>
        </Card>
      </Col>
      <Col xs={24} md={8} lg={6}>
        <Card className="shadow-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
            <div
              style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                backgroundColor: '#B2C7FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '20px',
              }}
            >
              <img src="/dshbarangmasuk.svg" style={{ width: '60%', height: '60%' }} />
            </div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{Dashboard?.totalBarangMasuk}</div>
              <div style={{ color: 'grey' }}>Barang Masuk</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
            <div
              style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                backgroundColor: '#E1E1E1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '20px',
              }}
            >
              <img src="/dshbarangkeluar.svg" style={{ width: '60%', height: '60%' }} />
            </div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{Dashboard?.totalBarangKeluar}</div>
              <div style={{ color: 'grey' }}>Barang Keluar</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                backgroundColor: '#F0C7C7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '20px',
              }}
            >
              <img src="/dshbarangrusak.svg" style={{ width: '60%', height: '60%' }} />
            </div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{Dashboard?.totalBarangRusak}</div>
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
          {/* menu inpo */}
          {role === 'admin' && (
            <div
              style={{
                position: 'absolute',
                top: '10px',
                right: '-20px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Dropdown overlay={menu} placement="bottomCenter">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Button
                    style={{
                      width: '200px',
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
                        alt="ikon"
                      />
                      <div>
                        <div style={{ fontSize: '12px', color: 'black', marginRight: '20px' }}>
                          Halo, {akun?.data?.nama}
                        </div>
                        <div style={{ fontSize: '12px', color: 'grey', marginRight: '75px' }}>
                          {akun?.data?.peran?.Role}
                        </div>
                      </div>
                    </div>
                  </Button>
                </div>
              </Dropdown>
            </div>
          )}
          {role === 'petugas' && (
            <div
              style={{
                position: 'absolute',
                top: '20px',
                right: '-20px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Dropdown overlay={menu} placement="bottomCenter">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Button
                    style={{
                      width: '200px',
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
                        alt="ikon"
                      />
                      <div>
                        <div style={{ fontSize: '12px', color: 'black', marginRight: '20px' }}>
                          Halo, {akun?.data?.nama}
                        </div>
                        <div style={{ fontSize: '12px', color: 'grey', marginRight: '75px' }}>
                          {akun?.data?.peran?.Role}
                        </div>
                      </div>
                    </div>
                  </Button>
                </div>
              </Dropdown>
            </div>
          )}
          {role === 'peminjam' && (
            <div
              style={{
                position: 'absolute',
                top: '20px',
                right: '10px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Dropdown overlay={menu} placement="bottomCenter">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Button
                    style={{
                      width: '190px',
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
                        alt="ikon"
                      />
                      <div>
                        <div style={{ fontSize: '12px', color: 'black', marginRight: '70px' }}>
                          Halo, {akun?.data?.nama}
                        </div>
                        <div style={{ fontSize: '12px', color: 'grey', marginRight: '75px' }}>
                          {akun?.data?.peran?.Role}
                        </div>
                      </div>
                    </div>
                  </Button>
                </div>
              </Dropdown>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
// export async function getServerSideProps(context: any) {
//   const cookies = parseCookies(context);
//   const token = cookies.accessToken;

//   // If token does not exist, redirect to login page
//   if (!token) {
//     return {
//       redirect: {
//         destination: '/login',
//         permanent: false,
//       },
//     };
//   }

//   // Additional logic to verify token if needed

//   return {
//     props: {}, // Props to be passed to the component
//   };
// }

export default Page;
