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
// import { parseCookies } from 'nookies';
import { dashboardRepository } from '#/repository/dashboard';
import { parseJwt } from '#/utils/parseJwt';

const { Item } = Menu;
const { Option } = Select;

export enum statusBarang {
  Aktif = 'aktif',
  TidakAktif = 'tidak aktif',
  Pending = 'pending',
  Diterima = 'diterima',
  Ditolak = 'ditolak',
}

interface DataType {
  id: React.Key;
  name: string;
  username: string;
  telp: string;
  nip: string;
}

interface createAkunpetugas {
  peranId: string;
  nama: string;
  nomorInduk: string;
  telp: string;
  gambar: string;
  username: string;
  password: string;
  status: statusBarang;
  kelas: string;
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
  const [createAkunpetugas, setcreateAkunpetugas] = useState<createAkunpetugas>({
    peranId: 'c0534779-e544-4325-89a0-6933432c69ec',
    status: statusBarang.Aktif,
    nama: '',
    kelas: '',
    nomorInduk: '',
    telp: '',
    gambar: '',
    username: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
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
    const token = localStorage.getItem('access_token');
    if (token) {
      const parseToken = parseJwt(token);
      console.log(parseToken, 'data akun');
      router.push('/profile');
    } else {
      message.error('Token tidak ditemukan, silakan login ulang.');
    }
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

  const onFinish = async (values: any) => {
    console.log('data values: ', values);
    try {
      setLoading(true);
      setError(null);
      const data = {
        peranId: createAkunpetugas.peranId,
        status: createAkunpetugas.status,
        nama: createAkunpetugas.nama,
        nomorInduk: createAkunpetugas.nomorInduk,
        telp: createAkunpetugas.telp,
        gambar: createAkunpetugas.gambar,
        username: createAkunpetugas.username,
        password: createAkunpetugas.password,
        kelas: createAkunpetugas.kelas,
      };
      const request = await akunRepository.api.akun(data);
      if (request.status === 400) {
        setError(request.body.message);
      } else {
        message.success('Berhasil Menambah Petugas!');
        setModalVisible(false);
      }
      console.log(request);
    } catch (error) {
      console.log(error);
      setError('Terjadi kesalahan pada server.');
      message.error('Gagal Menambah Petugas!');
      console.log();
    } finally {
      setLoading(false);
    }
  };

  const handleChange = async (args: any) => {
    const file = args.file;

    try {
      const createBarang = { file };
      const processUpload = await akunRepository.api.uploadAkun(file);
      setcreateAkunpetugas((createAkunpetugas: any) => ({
        ...createAkunpetugas,
        gambar: processUpload?.body?.data?.filename,
      }));
      console.log(processUpload, 'create');
      message.success('Gambar Berhasil Di Unggah!');
    } catch (e) {
      console.log(e, 'ini catch e');
      // setTimeout(message.eror("Gambar Gagal Di Unggah"))
    }
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

        <Row gutter={[16, 16]} justify="start">
          <Col xs={24} sm={12} md={8} lg={6} xl={6}>
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
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: '#F5DEB3',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '30px',
                  }}
                >
                  <img
                    src="/dshbarang.svg"
                    alt="Barang Icon"
                    style={{ width: '50%', height: '50%' }}
                  />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                      fontFamily: 'Arial, sans-serif',
                    }}
                  >
                    {Dashboard?.totalBarang}
                  </div>
                  <div style={{ fontFamily: 'Arial, sans-serif', color: 'grey' }}>Barang</div>
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={8} lg={6}>
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
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: '#fff0e0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '30px',
                  }}
                >
                  <img
                    src="/dshpeminjam.svg"
                    alt="Peminjam Icon"
                    style={{ width: '50%', height: '50%' }}
                  />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                      fontFamily: 'Arial, sans-serif',
                    }}
                  >
                    {Dashboard?.totalAkunPeminjam}
                  </div>
                  <div style={{ fontFamily: 'Arial, sans-serif', color: 'grey' }}>Peminjam</div>
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={8} lg={6}>
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
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: '#e0f7e9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '30px',
                  }}
                >
                  <img
                    src="/dshaktif.svg"
                    alt="Aktif Icon"
                    style={{ width: '50%', height: '50%' }}
                  />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                      fontFamily: 'Arial, sans-serif',
                    }}
                  >
                    {Dashboard?.totalAkunAktif}
                  </div>
                  <div style={{ fontFamily: 'Arial, sans-serif', color: 'grey' }}>Aktif</div>
                </div>
              </div>
            </Card>
          </Col>

          {role === 'admin' && (
            <Col
              xs={24}
              sm={12}
              md={8}
              lg={6}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
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
                }}
              >
                <span style={{ marginLeft: '5px' }}>Akun Petugas</span>
              </Button>
            </Col>
          )}
        </Row>

        <Modal
          title={
            <div style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '20px' }}>
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
            layout="horizontal"
            onFinish={onFinish}
            initialValues={{
              nama: '',
              nip: '',
              telp: '',
              namaPengguna: '',
              sandi: '',
              konfirmasiSandi: '',
            }}
          >
            <Row gutter={[24, 24]} justify="center" style={{ marginTop: '50px' }}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Nama"
                  name="nama"
                  rules={[{ required: true, message: 'Nama harus diisi' }]}
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 16 }}
                >
                  <Input
                    style={{ width: '100%', height: '45px' }}
                    placeholder="Nama"
                    value={createAkunpetugas.nama}
                    onChange={(e) =>
                      setcreateAkunpetugas({ ...createAkunpetugas, nama: e.target.value })
                    }
                  />
                </Form.Item>
                <Form.Item
                  label="NIP"
                  name="nomorInduk"
                  rules={[{ required: true, message: 'NIP harus diisi' }]}
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 16 }}
                >
                  <Input
                    style={{ width: '100%', height: '45px' }}
                    placeholder="NIP"
                    value={createAkunpetugas.nomorInduk}
                    onChange={(e) =>
                      setcreateAkunpetugas({ ...createAkunpetugas, nomorInduk: e.target.value })
                    }
                  />
                </Form.Item>
                <Form.Item
                  label="Telp"
                  name="telp"
                  rules={[{ required: true, message: 'Telp harus diisi' }]}
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 16 }}
                >
                  <Input
                    style={{ width: '100%', height: '45px' }}
                    placeholder="Telp"
                    value={createAkunpetugas.telp}
                    onChange={(e) =>
                      setcreateAkunpetugas({ ...createAkunpetugas, telp: e.target.value })
                    }
                    maxLength={12}
                  />
                </Form.Item>
                <Form.Item
                  label="Unggah Foto"
                  name="foto"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 14 }}
                >
                  <Upload
                    listType="picture"
                    beforeUpload={() => false}
                    onChange={(args) => handleChange(args)}
                  >
                    <Button icon={<UploadOutlined />} style={{ marginRight: '200px' }}>
                      Unggah
                    </Button>
                  </Upload>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Nama Pengguna"
                  name="username"
                  rules={[{ required: true, message: 'Nama Pengguna harus diisi' }]}
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 16 }}
                >
                  <Input
                    style={{ width: '100%', height: '45px' }}
                    placeholder="Nama Pengguna"
                    value={createAkunpetugas.username}
                    onChange={(e) =>
                      setcreateAkunpetugas({ ...createAkunpetugas, username: e.target.value })
                    }
                  />
                </Form.Item>
                <Form.Item
                  label="Sandi"
                  name="password"
                  rules={[{ required: true, message: 'Sandi harus diisi' }]}
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 16 }}
                >
                  <Input.Password
                    style={{ width: '100%', height: '45px' }}
                    placeholder="Sandi"
                    value={createAkunpetugas.password}
                    onChange={(e) =>
                      setcreateAkunpetugas({ ...createAkunpetugas, password: e.target.value })
                    }
                  />
                </Form.Item>
                <Form.Item
                  label="Konfirmasi Sandi"
                  name="konfirmasiSandi"
                  rules={[
                    { required: true, message: 'Konfirmasi Sandi harus diisi' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Sandi tidak cocok.'));
                      },
                    }),
                  ]}
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 16 }}
                >
                  <Input.Password
                    style={{ width: '100%', height: '45px' }}
                    placeholder="Konfirmasi Sandi"
                    onChange={(e) => setKonfirmasiSandi(e.target.value)}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item style={{ textAlign: 'right', marginTop: '24px', marginRight: '40px' }}>
              <Button
                type="default"
                onClick={handleModalCancel}
                style={{
                  width: '100px',
                  height: '35px',
                  borderColor: 'black',
                  color: 'black',
                  marginRight: '10px',
                }}
              >
                Batal
              </Button>
              <Button
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

        <Row gutter={[40, 40]} justify="start" style={{ marginTop: '40px', marginBottom: '40px' }}>
          <Col xs={24} md={15} lg={15} style={{ marginBottom: '40px' }}>
            <Card
              className="shadow-card"
              style={{ width: '100%', height: '600px', borderRadius: '30px' }}
            >
              <h1 style={{ fontSize: '15px', color: '#A7A7A7', padding: '10px 15px' }}>
                Jumlah Peminjaman
              </h1>
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
            <Card
              className="shadow-card"
              style={{
                padding: '100px 50px',
                width: '35vh',
                height: '600px',
                borderRadius: '30px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '50px' }}>
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
                  <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                    {Dashboard?.totalBarangMasuk}
                  </div>
                  <div style={{ color: 'grey' }}>Barang Masuk</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '50px' }}>
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
                  <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                    {Dashboard?.totalBarangKeluar}
                  </div>
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
                  <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                    {Dashboard?.totalBarangRusak}
                  </div>
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
